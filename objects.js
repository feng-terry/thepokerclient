//Card Class
function Card(rank,suit){
    this.rank = rank;
    this.suit = suit;
}
 
//Deck Class
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
 
//Player Class
Player = function(name){
    //Initializating
    this.name=name;
    this.stack=0;
    this.position;
    this.cards = [];
    this.bets = 0;

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

    //Setter Methods
    this.addStack = function(amount){
        this.stack = Number(this.stack + amount);
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
        this.bets += amount;
    }
}

//Settings Class
Settings=function(){
    this.startingStack;
    this.bigBlind;
    this.blindsIncrease; //boolean of whether or not blinds will increase

    this.blindsCounterSetting = 5; //setting for number of hands until blinds increase, 5 is default
    this.blindsCounter = this.blindsCounterSetting // live counter until blinds increase

    this.blindsIncrement; // multiplier of how much the blinds will increase by -> 10% = 1.10
    this.seats;

    this.increaseBlinds = function(){
        bigBlind*=blindsIncrement
    }

    this.decreaseCounter = function(){
        blindsCounter -=1
        if(blindsCounter === 0){
            increaseBlinds()
            blindsCounter = blindsTimerSetting
        }
    }
}

//Table Class
Table=function(){
    this.pot = 0;
    this.cards = [];
    this.players = [];
    this.activePlayers = []
    this.deck = new Deck();
    this.deck.shuffle();
    this.prePostFlop = "preflop";
    this.bigBlindActed = false;

    this.addPot = function(amount){
        this.pot += amount;
    }

    this.addCard = function(){
        this.cards.push(this.deck.draw());
    }

    this.addPlayer = function(playerObject){
        this.players.push(playerObject);
    }

    this.newHand = function(){
        this.pot = 0;
        this.cards = [];
        this.deck = new Deck()
        this.deck.shuffle();
        this.activePlayers = Array.from(this.players);
        this.prePostFlop = "preflop";
    }

    this.fold = function(playerObject){
        index = this.activePlayers.indexOf(playerObject);
        this.activePlayers.splice(index,1);
    }
    this.dealHands = function(){
        for (let player of this.players){
            player.addCards(this.deck);
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
    this.switchPrePostFlop = function(){
        if (this.prePostFlop === "preflop"){
            this.prePostFlop = "postflop";
        }
        else{
            this.prePostFlop = "preflop";
        }
    }
    this.setBigBlindActed = function(value){
        this.bigBlindActed = value;
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
}

//Gamestate Class 
Gamestate = function(){
    this.playGame = false;
    this.liveHand = false;

    this.setPlayGame = function(bool){
        this.playGame = bool;
    }
    this.setLiveHand = function(bool){
        this.liveHand = bool;
    }
    

    this.getPrePostFlop = function(){
        return this.prePostFlop;
    }
}

module.exports={
    Player: Player,
    Table:Table,
    Settings:Settings

}