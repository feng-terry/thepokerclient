const hand = require('../handComparison');
const player = require('./player');

Table=function(io){
    this.pot = 0;
    this.cards = [];
    this.players = [];
    this.activePlayers = []
    this.deck = new Deck();
    this.deck.shuffle();
    this.stage;
    this.finalPlayer;
    this.currentPlayer;
    this.currentBet = 0 ;
    this.possibleActions;
    this.leftOverChips = 0;
    this.isLeftOverChips = true;
    this.totalTurns=0
    //Settings
    this.startingStack;
    this.bigBlind; //boolean of whether or not blinds will increase
    this.antes;
    this.blindsIncrease;
    this.blindsIncreaseTimer = 5; //setting for number of hands until blinds increase, 5 is default
    this.blindsPercentage=0; // multiplier of how much the blinds will increase by -> 10% = 1.10
    this.seats;

    this.setSettings = function(data){
        this.startingStack = data.startingStack
        this.bigBlind = data.blinds
        this.seats = data.seats
        this.antes = data.antes
        this.blindsIncrease=data.blindsIncrease;
        this.blindsIncreaseTimer = data.blindsIncreaseTimer; //setting for number of hands until blinds increase, 5 is default
        this.blindsPercentage=data.blindsPercentage+1;
    }

    this.increaseBlinds = function(){
        this.bigBlind=Math.ceil(this.blindsPercentage*this.bigBlind)
    }

    this.addPot = function(amount){
        this.pot += amount;
    }

    this.addCard = function(){
        this.cards.push(this.deck.draw());
    }

    this.addPlayer = function(playerObject){
        this.players.push(playerObject);
    }

    this.removePlayer = function(playerObject){
        const index = this.players.indexOf(playerObject)

        if (index > -1) {
            this.players.splice(index, 1);
        }
          
    }

    this.initializeActions = function(){
        this.possibleActions = {
            fold:false,
            check:false,
            call:false,
            bet:false,
            raise:false
        }
    }

    this.postBlinds = function(){
        bigBlindAmount = this.bigBlind
        bigBlindPlayer = this.activePlayers[1];
        bigBlindPlayer.addBet(bigBlindAmount)
        smallBlindPlayer = this.activePlayers[0];
        smallBlindAmount = Math.floor(bigBlindAmount/2)
        smallBlindPlayer.addBet(smallBlindAmount)

        for (let i = 2; i < this.activePlayers.length; i++){
            this.activePlayers[i].addBet(this.antes)
        }

        this.currentBet = this.bigBlind

        io.emit('update')
    }

    this.newHand = function(){
        this.totalTurns+=1
        if (this.totalTurns%this.blindsIncreaseTimer===0){
            this.increaseBlinds()
        }
        this.players.unshift(this.players.pop())
        this.cards = [];
        for (const player of this.players){
            player.cards = []
            player.bets = 0
            player.totalBets = 0
        }
        this.isLeftOverChips = true
        io.emit('communityCards',this.cards)
        this.deck = new Deck()
        this.deck.shuffle();
        this.activePlayers = Array.from(this.players);
        this.postBlinds()
        this.dealHands()
        this.preflop()
    }

    this.endRound = function(){
        this.takeBets()
        this.activePlayers[0].addStack(this.pot)
        this.pot =0
    
        this.newHand()
    }

    this.dealHands = function(){
        for (let player of this.activePlayers){
            player.addCards(this.deck);
        }
        for (const player of this.activePlayers){
            io.to(player.socketId).emit('dealCards', player.getCards())
        }
    }

    this.checkNextStage = function(){
        if (this.currentPlayer === this.finalPlayer){
            this.nextStage()
        } else{
            this.currentPlayer = this.nextPlayer(this.currentPlayer)
            this.playTurn()
        }
    }

    this.nextStage = function(){
        if (this.allPlayersAllIn() || this.stage === 'river'){
            for (let i = this.cards.length; i < 5;i++){
                this.addCard()
                if (i >= 3){
                    setTimeout(function(){}, 1500)
                    io.emit('communityCards',this.cards)
                }
            }
            this.showdown()
        }else if (this.stage === 'preflop'){
            this.flop()
        } else if (this.stage === 'flop'){
            this.turnRiver('turn')
        } else if (this.stage === 'turn'){
            this.turnRiver('river')
        } 
    }

    this.allPlayersAllIn = function(){
        for (const player of this.activePlayers){
            if (player.getStack() != 0){
                return false
            }
        }
        return true
    }

    this.onlyStack = function(stackPlayer){
        for (const player of this.activePlayers){
            if (player.getStack() != 0 && player != stackPlayer){
                return false
            }
        }
        return true
    }

    this.takeBets = function(){
        let totalAmount = 0;
        for (let player of this.players){
            totalAmount += player.getBets();
            player.bets = 0;
        }
        this.currentBet = 0
        this.addPot(totalAmount);
    }

    this.preflop = function(){
        this.stage = 'preflop'
        this.finalPlayer = this.activePlayers[1]
        this.currentPlayer = this.nextPlayer(this.finalPlayer) 

        this.playTurn()
    }

    this.flop = function(){
        this.stage = 'flop'
        if (this.activePlayers.length === 2){
            this.finalPlayer = this.activePlayers[0]
        }else{
            this.finalPlayer = this.activePlayers[this.activePlayers.length - 1]
        }
        
        this.takeBets()
        this.currentPlayer = this.nextPlayer(this.finalPlayer)
        //Deal 3 cards
        this.addCard()
        this.addCard()
        this.addCard()

        io.emit('communityCards',this.cards)

        this.playTurn()
    }

    this.turnRiver = function(stage){
        this.stage = stage

        if (this.activePlayers.length === 2){
            this.finalPlayer = this.activePlayers[0]
        }else{
            this.finalPlayer = this.activePlayers[this.activePlayers.length - 1]
        }
        
        this.takeBets()
        this.currentPlayer = this.nextPlayer(this.finalPlayer)
        //Deal 1 cards
        this.addCard()

        io.emit('communityCards',this.cards)
        this.playTurn()
    }

    this.showdown = function(){
        this.stage = 'showdown'
        this.takeBets()
        //////////////////////////////////////////////////////////
        if (this.pot != 0){
            console.log('pot:', this.pot)
            //Finding the minimun bet and the player assosciated with it
            let minBet = this.pot + 1
            let minPlayer
            for (const player of this.activePlayers){
                if (player.getTotalBets() < minBet){
                    minBet = player.getTotalBets()
                    minPlayer = player
                }
            }
            console.log('minBet:', minBet)
            console.log('minPlayer:', minPlayer.name)
            //Calculating the size of the sidepot
            let partialPot = minBet*this.activePlayers.length

            if (this.isLeftOverChips){
                partialPot += this.leftOverChips
                this.leftOverChips = 0
                this.isLeftOverChips = false
            }
            console.log('partialPot:', partialPot)
            //Determining the winner
            const winner = hand.handComparison(this.activePlayers,this.cards)
            console.log('winner:', winner.name)
            if (Array.isArray(winner)){
                const amount = Math.floor(partialPot/winner.length)
                for (const player of winner){
                    player.addStack(amount)
                    this.pot -= amount
                    partialPot -= amount
                }
                this.leftOverChips = partialPot
                this.pot -= this.leftOverChips
            } else {
                winner.addStack(partialPot)
                this.pot -= partialPot
            }
            //Removing the minPlayer and recursively calling
            this.activePlayers.splice(this.activePlayers.indexOf(minPlayer),1)
            for (const player of this.activePlayers){
                console.log('totalBets Before:', player.totalBets)
                player.totalBets -= minBet
                console.log('totalBets After:', player.totalBets)
            }

            this.showdown()
            ///////////////////////////////////
        }else{
            for (const player of Array.from(this.players)){
                if (player.getStack() === 0){
                    this.removePlayer(player)
                }
            }
            setTimeout(function(){}, 2000)
            if (this.players.length > 1){
                this.newHand()
            }            
        }
    }

    this.playTurn = function(){
        this.initializeActions()

        if (this.currentBet === this.currentPlayer.getBets()){
            this.possibleActions.check = true
        } else{
            this.possibleActions.fold = true
            this.possibleActions.call=true
        }

        if(this.currentBet === 0){
            this.possibleActions.bet = true
        } else{
            this.possibleActions.raise = true
        }

        switch(this.stage){
            case 'preflop':
                io.to(this.currentPlayer.getSocketId()).emit('turn', 
                    {isTurn:true,
                    actions:this.possibleActions,
                    stack:this.currentPlayer.getStack(),
                    bigBlind:this.bigBlind,
                    currentBet:this.currentBet,
                    playerCurrentBet:this.currentPlayer.getBets()})
            case 'flop':
                io.to(this.currentPlayer.getSocketId()).emit('turn', 
                    {isTurn:true,
                    actions:this.possibleActions,
                    stack:this.currentPlayer.getStack(),
                    bigBlind:this.bigBlind,
                    currentBet:this.currentBet,
                    playerCurrentBet:this.currentPlayer.getBets()})
            case 'turn':
                io.to(this.currentPlayer.getSocketId()).emit('turn', 
                    {isTurn:true,
                    actions:this.possibleActions,
                    stack:this.currentPlayer.getStack(),
                    bigBlind:this.bigBlind,
                    currentBet:this.currentBet,
                    playerCurrentBet:this.currentPlayer.getBets()})
            case 'river':
                io.to(this.currentPlayer.getSocketId()).emit('turn', 
                    {isTurn:true,
                    actions:this.possibleActions,
                    stack:this.currentPlayer.getStack(),
                    bigBlind:this.bigBlind,
                    currentBet:this.currentBet,
                    playerCurrentBet:this.currentPlayer.getBets()})
        }
    }
    ///Server Client rift

    this.fold = function(){
        const tempPlayer = this.nextPlayer(this.currentPlayer)
        index = this.activePlayers.indexOf(this.currentPlayer);
        this.activePlayers.splice(index,1);
        io.to(this.currentPlayer.getSocketId()).emit('turn', {isTurn:false,actions:{fold:false,
                                                                                    check:false,
                                                                                    call:false,
                                                                                    bet:false,
                                                                                    raise:false}})

        if (this.activePlayers.length < 2){
            this.endRound()//Still have to write
        } else if (this.currentPlayer === this.finalPlayer){
            this.nextStage() //Still have to write
        }
        else{
            this.currentPlayer = tempPlayer
            this.playTurn()
        }
    }

    this.check = function(){
        io.to(this.currentPlayer.getSocketId()).emit('turn', {isTurn:false,actions:{fold:false,
                                                                                    check:false,
                                                                                    call:false,
                                                                                    bet:false,
                                                                                    raise:false}})
        this.checkNextStage()
    }
    
    this.call = function(){
        io.to(this.currentPlayer.getSocketId()).emit('turn', {isTurn:false,actions:{fold:false,
                                                                                    check:false,
                                                                                    call:false,
                                                                                    bet:false,
                                                                                    raise:false}})

        this.currentPlayer.addBet(this.currentBet - this.currentPlayer.getBets())

        this.checkNextStage()
    }

    this.bet = function(value){
        io.to(this.currentPlayer.getSocketId()).emit('turn', {isTurn:false,actions:{fold:false,
                                                                                    check:false,
                                                                                    call:false,
                                                                                    bet:false,
                                                                                    raise:false}})
        if (value < Math.min(this.bigBlind,this.currentPlayer.getStack())){
            value = Math.min(this.bigBlind,this.currentPlayer.getStack())
        } else if (value > this.currentPlayer.getStack()){
            value = this.currentPlayer.getStack()
        }

        this.currentPlayer.addBet(value)
        this.currentBet = value

        this.finalPlayer = this.previousPlayer(this.currentPlayer)
        this.currentPlayer = this.nextPlayer(this.currentPlayer)
        this.playTurn()
    }

    this.raise = function(value){
        io.to(this.currentPlayer.getSocketId()).emit('turn', {isTurn:false,actions:{fold:false,
                                                                                    check:false,
                                                                                    call:false,
                                                                                    bet:false,
                                                                                    raise:false}})

        if (value < Math.min(2*this.currentBet  - this.currentPlayer.getBets() ,this.currentPlayer.getStack())){
            value =  Math.min(2*this.currentBet - this.currentPlayer.getBets(),this.currentPlayer.getStack()) 
        } else if (value > this.currentPlayer.getStack()){
            value = this.currentPlayer.getStack() 
        }

        this.currentPlayer.addBet(value)
        this.currentBet = this.currentPlayer.getBets()
        if (this.onlyStack(this.currentPlayer)){
            this.nextStage()
        } else{
            this.finalPlayer = this.previousPlayer(this.currentPlayer)
            this.currentPlayer = this.nextPlayer(this.currentPlayer)
            this.playTurn()
        }
    }
///Server Client rift

    this.nextPlayer = function(player){
        let index = this.activePlayers.indexOf(player)
        if (index+1> this.activePlayers.length -1){
            index = 0
        }else{
            index++
        }

        if (this.activePlayers[index].getStack() != 0){
            return this.activePlayers[index]
        }

        return this.nextPlayer(this.activePlayers[index])
    }

    this.previousPlayer = function(player){
        let index = this.activePlayers.indexOf(player)
        if (index-1<0){
            index = this.activePlayers.length - 1
        }else{
            index--
        }

        if (this.activePlayers[index].getStack() != 0){
            return this.activePlayers[index]
        }

        return this.previousPlayer(this.activePlayers[index])
    }

    //Getter Methods
    this.getPot = function(){
        return this.pot;
    }
    this.getCards = function(){
        return this.cards;
    }
    this.getPlayers = function(){
        return this.players;
    }
    this.getActivePlayers = function(){
        return this.activePlayers;
    }
    this.getPrePostFlop = function(){
        return this.prePostFlop;
    }
    this.getBigBlindActed = function(){
        return this.bigBlindActed;
    }
    this.playHand = function(){
        this.dealHands();
        this.postBlinds();
    }

}

function Deck(){
    this.cards = [];
        for (let rank = 2; rank <= 14; rank++){
            for (const suit of ["D","C","H","S"]){
                this.cards.push(new Card(rank,suit));
            }
        }
    this.shuffle = function(){
        //Citation: https://github.com/coolaj86/knuth-shuffle
        let currentIndex = this.cards.length, temporaryValue, randomIndex;

        while (0 !== currentIndex) { 

            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex -= 1;

            temporaryValue = this.cards[currentIndex];
            this.cards[currentIndex] = this.cards[randomIndex];
            this.cards[randomIndex] = temporaryValue;
        }
    }
    this.draw = function(){
        return this.cards.pop();
    }
}

function Card(rank,suit){
    this.rank = rank;
    this.suit = suit;
}
module.exports={
    Table: Table
}