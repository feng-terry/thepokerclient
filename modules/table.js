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
    this.currentBet;
    this.possibleActions;

    this.addPot = function(amount){
        this.pot += amount;
    }

    this.addCard = function(){
        this.cards.push(this.deck.draw());
    }

    this.addPlayer = function(playerObject){
        this.players.push(playerObject);
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

    this.newHand = function(){
        this.pot = 0;
        this.cards = [];
        this.deck = new Deck()
        this.deck.shuffle();
        this.activePlayers = Array.from(this.players);
    }

    this.dealHands = function(){
        for (let player of this.players){
            player.addCards(this.deck);
        }
        for (const player of this.activePlayers){
            io.to(player.socketId).emit('dealCards', player.getCards())
        }
    }

    this.takeBets = function(){
        let totalAmount = 0;
        for (let player of this.players){
            totalAmount += player.getBets();
            player.bets = 0;
        }
        this.addPot(totalAmount);
    }

    this.preflop = function(){
        this.stage = 'preflop'
        this.finalPlayer = this.activePlayers[1]
        this.currentPlayer = this.nextPlayer(this.finalPlayer) //Still have to code next player

        this.playTurn()
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
                console.log(this.possibleActions)
                io.to(this.currentPlayer.getSocketId()).emit('turn', [true,this.possibleActions])
        }
    }

    this.fold = function(){
        console.log('fold event called')
        index = this.activePlayers.indexOf(this.currentPlayer);
        this.activePlayers.splice(index,1);
        io.to(this.currentPlayer.getSocketId()).emit('turn', [false])

        if (this.activePlayers.length < 2){
            this.endRound()//Still have to write
        } else if (this.currentPlayer === this.finalPlayer){
            this.nextStage() //Still have to write
        }
        else{
            this.currentPlayer = this.nextPlayer(this.currentPlayer)
            this.playTurn()
        }
    }

    this.check = function(){
        io.to(this.currentPlayer.getSocketId()).emit('turn', [false])
        this.currentPlayer = this.nextPlayer(this.currentPlayer)
        this.playTurn()
    }

    this.nextPlayer = function(player){
        let index = this.activePlayers.indexOf(player)
        if (index+1> this.activePlayers.length -1){
            index = 0
        }else{
            index++
        }
        return this.activePlayers[index]
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
    this.postBlinds = function(){
        bigBlindAmount = settings.bigBlind
        bigBlindPlayer = table.getPlayers()[1];
        bigBlindPlayer.addBet(bigBlindAmount)
        smallBlindPlayer = table.getPlayers()[0];
        smallBlindAmount = bigBlindAmount/2
        smallBlindPlayer.addBet(smallBlindAmount)
        emitBet(io,bigBlindAmount,bigBlind)
        emitBet(io,smallBlindAmount,smallBlind)
    }

    this.emitBet = function(io,betAmount,player){
        io.emit('bet',[betAmount,player])
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