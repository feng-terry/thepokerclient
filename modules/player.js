Player = function(name,socketId){
    //Initializating
    this.name=name;
    this.stack=0;
    this.position;
    this.cards = [];
    this.bets = 0;
    this.totalBets = 0;
    this.socketId = socketId;

    //Getter Methods
    this.getName = function(){
        return this.name;
    }
    this.getStack = function(){
        return this.stack;
    }
    this.getPosition = function(){
        return this.position;
    }
    this.getCards = function(){
        return this.cards;
    }
    this.getBets = function(){
        return this.bets;
    }
    this.getSocketId = function(){
        return this.socketId;
    }
    this.getTotalBets = function(){
        return this.totalBets
    }
    //Setter Methods
    this.addStack = function(amount){
        this.stack = Number(this.stack) + Number(amount);
    }
    this.subStack = function(amount){
        this.stack -= amount;
    }
    this.updatePosition = function(newPosition){
        this.position = newPosition;
    }
    this.addCards = function(deck){
        this.cards.push(deck.draw());
        this.cards.push(deck.draw());
    }
    this.removeCards = function(){
        this.cards = [];
    }
    this.addBet = function(amount){
        this.subStack(amount);
        this.bets = Number(this.bets) + Number(amount);
        this.totalBets = Number(this.totalBets) + Number(amount)
    }
}

module.exports={
    Player: Player
}