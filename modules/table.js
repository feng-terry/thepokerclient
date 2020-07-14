const hand = require('../handComparison');
const player = require('./player');

Table=function(io){
    this.pot = 0;
    this.cards = [];
    this.players = [];
    this.holdPlayers = []
    this.activePlayers = []
    this.foldPlayers=[]
    this.sitOutList = []
    this.sitInList = []
    this.revealList = []
    this.deck = new Deck();
    this.deck.shuffle();
    this.stage;
    this.finalPlayer;
    this.currentPlayer;
    this.firstToReveal;
    this.currentBet = 0 ;
    this.possibleActions;
    this.leftOverChips = 0;
    this.isLeftOverChips = true;
    this.totalTurns=0
    this.bigBlindSeat = 0;
    this.disconnectChips = 0;
    this.currentlyAllIn = false
    //Settings
    this.startingStack;
    this.bigBlind; //boolean of whether or not blinds will increase
    this.antes;
    this.blindsIncrease;
    this.blindsIncreaseTimer = 5; //setting for number of hands until blinds increase, 5 is default
    this.blindsPercentage=0; // multiplier of how much the blinds will increase by -> 10% = 1.10
    this.seats;
    this.lobbyName;

    this.setSettings = function(data){
        this.startingStack = data.startingStack
        this.bigBlind = data.blinds
        this.seats = data.seats
        this.antes = data.antes
        this.blindsIncrease=data.blindsIncrease;
        this.blindsIncreaseTimer = data.blindsIncreaseTimer; //setting for number of hands until blinds increase, 5 is default
        this.blindsPercentage=data.blindsPercentage+1;
        this.lobbyName=data.lobbyName;
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
        playerObject.setSeat(this.players.length)
    }

    this.addHoldPlayer = function(player){
        player.setSeat(this.players.length + this.holdPlayers.length + this.sitOutList.length + this.sitInList.length + 1)
        player.addStack(this.startingStack)
        this.holdPlayers.push(player)
    }

    this.removePlayer = function(playerObject){
        const index = this.players.indexOf(playerObject)

        if (index > -1) {
            this.players.splice(index,1)

            if (this.stage != 'showdown'){

                if(this.currentPlayer === playerObject){
                    this.fold()

                }else{ //Modified fold

                    if(this.finalPlayer === playerObject){
                        this.finalPlayer = this.previousPlayer(playerObject)
                    } 

                    this.addPot(playerObject.getBets())
                    this.disconnectChips += playerObject.getBets()

                    const foldIndex = this.activePlayers.indexOf(playerObject);
                    this.activePlayers.splice(foldIndex,1);

                    if (this.activePlayers.length < 2){
                        this.endRound()
                    } 
                }
            }
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

        for (const player of this.holdPlayers){
            if(smallBlindPlayer === player){
                player.clearBets()
                player.addBet(bigBlindAmount)
            }else if (bigBlindPlayer != player){
                player.addBet(bigBlindAmount)
            }
        }
        for (const player of this.sitInList){
            let oweBlinds = ((this.bigBlindSeat > player.getSeat() && player.getSeat() > player.getSitOutSeat())||(player.getSitOutSeat() > this.bigBlindSeat && this.bigBlindSeat > player.getSeat())||(player.getSeat() > player.getSitOutSeat() && player.getSitOutSeat() > this.bigBlindSeat))
            if (oweBlinds || player.getBlindCycle()){ //I:Sit in Seat O:Sit out Seat P:Player Seat, oweBlinds is I>P>O, O>I>P, P>O>I consult:https://imgur.com/a/VnUbLsB
                player.addBet(bigBlindAmount)
                player.setBlindCycle(false)
            }
        }

        this.holdPlayers = []
        this.sitInList = []

        this.currentBet = this.bigBlind

        io.emit('update')
    }

    this.sitIn = function(player){
        player.setCheckFold(false)
        this.sitOutList.splice(this.players.indexOf(player),1)
        this.sitInList.push(player)  
    }

    this.sitOut = function(player){
        player.setCheckFold(true)
        player.setSitOutSeat(this.bigBlindSeat)
        this.players.splice(this.players.indexOf(player),1)
        this.sitOutList.push(player)
        this.premoves()
        io.emit('update')
    }

    this.findLeft = function(seat,mapArr){
       const index =  mapArr.indexOf(seat - 1)

       if (index >= 0){
           return this.players[index]
       } else if (seat === 1){
           this.findLeft(this.players.length + this.holdPlayers.length + this.sitOutList.length + this.sitInList.length + 1,mapArr)
       }else{
           this.findLeft(seat-1,mapArr)
       }
    }

    this.placePlayers = function(){
        for (const player of this.sitInList.concat(this.holdPlayers)){
            const mapArr = this.players.map(player=>player.getSeat())

            const leftPlayer = this.findLeft(player.getSeat(),mapArr)
            this.players.splice(this.players.indexOf(leftPlayer) + 1 ,0,player)
        }
    }

    this.checkBlindCycle = function(){
        let player = this.activePlayers[1]
        while (this.bigBlindSeat != player.getSeat()){
            console.log('Big Blind Seat:',this.bigBlindSeat)
            console.log('player.getSeat:', player.getSeat())
            this.bigBlindSeat += 1
            if (this.bigBlindSeat > this.players.length + this.holdPlayers.length + this.sitOutList.length + this.sitInList.length){
                this.bigBlindSeat = 1
            }

            //Checking if a blind cycle has passed with each increment of the bigBlindSeat
            for (const sitOutPlayer of this.sitOutList){
                if (sitOutPlayer.getSitOutSeat() === this.bigBlindSeat){
                    sitOutPlayer.setBlindCycle(true)
                }
            }
        }
    }

    this.resetSeats = function(){
        let lowestSeat = Number.MAX_SAFE_INTEGER
        let lowestPlayer

        for (const player of this.players){
            if (player.getSeat() < lowestSeat){
                lowestSeat = player.getSeat()
                lowestPlayer = player
            }
        }

        let counter = 1;
        
        for (let i=this.players.indexOf(lowestPlayer);i<=this.players.length+this.players.indexOf(lowestPlayer)-1;i++){
            let index = i
            if (index >= this.players.length){
                index = index - this.players.length
            }

            this.players[index].setSeat(counter)
            counter++
        }

        console.log(this.players)


    }

    this.newHand = function(){
        console.log("New Hand")
        //Blind Increase
        this.totalTurns+=1
        if (this.totalTurns%this.blindsIncreaseTimer===0){
            this.increaseBlinds()
        }
        //Switching position
        this.players.push(this.players.shift())
        //Adding players that sat down and removing the ones that left and aligning their seat #
        this.placePlayers()
        this.resetSeats()
        console.log('placed players')
        //Resetting the Table
        this.cards = [];
        for (const player of this.players.concat(this.sitOutList)){
            player.cards = []
            player.bets = 0
            player.totalBets = 0
        }
        this.isLeftOverChips = true
        this.revealList=[]
        this.foldPlayers = []
        this.currentlyAllIn = false
        io.emit('revealList',this.revealList)
        io.emit('communityCards',this.cards)
        this.deck = new Deck()
        this.deck.shuffle();
        this.activePlayers = Array.from(this.players);
        console.log('right before checkBlindCycle')
        //Initalize Functions
        this.checkBlindCycle()
        console.log("checked blind cycle")
        this.postBlinds()
        console.log('posted blinds')
        this.dealHands()
        console.log('dealt hands')
        this.preflop()
    }

    this.endRound = function(){
        this.takeBets()
        this.activePlayers[0].addStack(this.pot)
        this.pot =0
    
        if (this.players.length > 1){
            this.newHand()
        } 
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
        if (this.allPlayersAllIn()){
            
            this.revealList = Array.from(this.activePlayers)
            io.emit('revealList', this.revealList)
            for (let i = this.cards.length; i < 5;i++){
                this.addCard()
                if (i >= 3){
                    setTimeout(function(){}, 1500)
                    io.emit('communityCards',this.cards)
                }
            }
            
            this.currentlyAllIn = true
            this.showdown()
        }else if (this.stage === 'preflop'){
            this.flop()
        } else if (this.stage === 'flop'){
            this.turnRiver('turn')
        } else if (this.stage === 'turn'){
            this.turnRiver('river')
        } else if (this.stage === 'river'){
            this.showdown()
        }
    }

    this.allPlayersAllIn = function(){
        let counter = 0
        for (const player of this.activePlayers){
            if (player.getStack() != 0){
                counter++
            }
        }
        
        if (counter > 1){
            return false
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
        //Takes bets from all players and those who sat out this round
        for (let player of this.players.concat(this.sitOutList)){
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
        if (this.stage === 'river'){
            this.firstToReveal = this.nextAbsolutePlayer(this.finalPlayer)
        }
        this.stage = 'showdown'
        this.takeBets()
        //////////////////////////////////////////////////////////
        if (this.pot != 0){
            //Finding the minimun bet and the player assosciated with it
            let minBet = this.pot + 1
            let minPlayer
            for (const player of this.activePlayers.concat(this.foldPlayers)){
                if (player.getTotalBets() < minBet){
                    minBet = player.getTotalBets()
                    minPlayer = player
                }
            }
            //Calculating the size of the sidepot
            let partialPot = minBet*(this.activePlayers.length + this.foldPlayers.length) 

            if (this.isLeftOverChips){
                partialPot += this.leftOverChips
                this.leftOverChips = 0
                this.isLeftOverChips = false
            }
            //Determining the winner
            const winner = hand.handComparison(this.activePlayers,this.cards)
            
            if (!this.currentlyAllIn){
                this.addRevealList(this.firstToReveal)
            }
            if (Array.isArray(winner)){
                const amount = Math.floor(partialPot/winner.length)
                const disconnectAmount = Math.floor(this.disconnectChips/winner.length)
                for (const player of winner){
                    player.addStack(amount + disconnectAmount)
                    this.pot -= (amount + disconnectAmount) 
                    partialPot -= amount
                    this.disconnectChips -= disconnectAmount
                }
                this.leftOverChips = partialPot + this.disconnectChips
                this.pot -= this.leftOverChips
                this.disconnectChips = 0
            } else {
                winner.addStack(partialPot + this.disconnectChips)
                this.pot -= (partialPot + this.disconnectChips)
                this.disconnectChips = 0
            }
            //Removing the minPlayer and recursively calling
            if(this.foldPlayers.includes(minPlayer)){
                this.foldPlayers.splice(this.foldPlayers.indexOf(minPlayer),1)
            }else if (this.activePlayers.includes(minPlayer)){
                this.activePlayers.splice(this.activePlayers.indexOf(minPlayer),1)
            }

            for (const player of this.activePlayers.concat(this.foldPlayers)){
                player.totalBets -= minBet
            }

            this.showdown()
            ///////////////////////////////////
        }else{
            for (const player of Array.from(this.players)){
                if (player.getStack() === 0){
                    this.removePlayer(player)
                }
            }
            io.emit('revealList',this.revealList)
            console.log(this.players.map(player => player.name))
            if (this.players.length > 1){
                setTimeout(()=>{this.newHand()},4000)
            }            
        }
    }

    this.addRevealList = function(firstToReveal){
        let bestPlayer = firstToReveal
        this.revealList.push(firstToReveal)

        for (let i=this.activePlayers.indexOf(firstToReveal)+1;i<this.activePlayers.length+this.activePlayers.indexOf(firstToReveal)-1;i++){
            let index = i
            if (index >= this.activePlayers.length){
                index = index - this.activePlayers.length
            }

            const winner = handComparison([bestPlayer,this.activePlayers[index]],this.cards)

            if (winner != bestPlayer && !Array.isArray(winner)){
                this.revealList.push(winner)
                bestPlayer = winner
            }else if (Array.isArray(winner)){
                this.revealList = Array.from(new Set(this.revealList.concat(winner)))
            }
        }
    }

    this.clearPremoves = function(){
        if (this.players.includes(this.currentPlayer)){
            this.currentPlayer.setCheckFold(false)
            this.currentPlayer.setCallAny(false)
        }
        io.emit('update')
    }

    this.premoves = function(){
        if (this.currentPlayer.getCheckFold()){
            this.clearPremoves()
            if(this.currentBet > this.currentPlayer.getBets()){
                this.fold()
            } else {
                this.check()
            }
        } else if(this.currentPlayer.getCallAny()){
            this.clearPremoves()
            this.call()
        }
    }

    this.playTurn = function(){
        this.initializeActions()
        if (this.currentPlayer.getCheckFold() || this.currentPlayer.getCallAny()){
           this.premoves()
        } else{
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
    }
    ///Server Client rift

    this.fold = function(){
        const tempPlayer = this.nextPlayer(this.currentPlayer)
        index = this.activePlayers.indexOf(this.currentPlayer);
        this.foldPlayers = this.foldPlayers.concat(this.activePlayers.splice(index,1));
        io.to(this.currentPlayer.getSocketId()).emit('turn', {isTurn:false,actions:{fold:false,
                                                                                    check:false,
                                                                                    call:false,
                                                                                    bet:false,
                                                                                    raise:false}})

        if (this.activePlayers.length < 2){
            this.endRound()
        } else if (this.currentPlayer === this.finalPlayer){
            this.nextStage() 
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

        this.currentPlayer.addBet(Math.min(this.currentBet - this.currentPlayer.getBets(),this.currentPlayer.getStack()))
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

    this.nextAbsolutePlayer = function(player){
        let index = this.activePlayers.indexOf(player)
        if (index+1> this.activePlayers.length -1){
            index = 0
        }else{
            index++
        }

        return this.activePlayers[index]
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
    this.getCurrentBet = function(){
        return this.currentBet
    }
    this.getActiveNotSatOutPlayers = function(){
        let result = []
        for (const player of this.activePlayers){
            if (!this.sitOutList.includes(player)){
                result.push(player)
            }
        }
        return result
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