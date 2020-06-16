//Helper Functions
playHand=function(table,socket,io,playersList){
    table.dealHands();
    for (const socketId of playerList){
        io.to(socketId).emit('dealCards',playerList[socketId].getCards())
    }

    postBlinds(table); //code as bet + raise

    playStage('preflop',table)
    playStage('flop',table)
    playStage('turn',table)
    playStage('river',table)

    showdown(table)
}

function emitBet(io,betAmount,player){
    io.emit('bet',[betAmount,player])
}

function postBlinds(table,settings,player){

    bigBlindPlayer = table.getPlayers()[1];
    smallBlindPlayer = table.getPlayers()[0];
    bigBlindAmount = table.bigBlind
    smallBlindAmount = bigBlindAmount/2

    emitBet(io,bigBlindAmount,bigBlind)
    emitBet(io,smallBlindAmount,smallBlind)
}

function potIsOpen(table){
    if (table.getPrePostFlop() == "preflop"){
        if (table.getBigBlindActed() && equalBets(table)){
            return false;
        }
        return true;
    }
}

function equalBets(table){
   const equality = table.getActivePlayers()[0].getBets(); //Takes first player of the active player list and gets their bet amount
   for (const player of table.getActivePlayers()){
       if (player.getBets() != equality){
           return false;
       }
   }
   return true;
}

function playStage(stage,table){
    if (stage==='preflop'){
        let hold=0; //loop through the below loop twice
        while(potIsOpen(table))
		    for (let i=0; i<table.activePlayers.length;i++){
                if(hold>=2){
                    playTurn(player,table)
				    if (player.position === 1 ){
                        table.setBigBlindActed(true)
                    }
                } else {
                    hold++
                }
            }
    } else if (stage==='flop' || stage==='turn' || stage==='river' ) {
        while(potIsOpen(table)){
            for (let i=0; i<table.activePlayers.length;i++){
                playTurn(player,table)
                if (player.position === 1 ){
                    table.setBigBlindActed(true)
                }
            }
    }
}
}

function showdown(table){
    let winners = (handComparison(table.getactivePlayers()))
    if (winners.isArray()){
        for (let i=0; i<winners.length;i++){
            winners[i].addStack(table.getPot()/winners.length)
        }
    } else {
        winners.addStack(table.getPot())
    }
}

function playTurn(player,table){
    const option = getOptionFromPlayer(player);
    switch (option){
        case "bet"://Unfinished
            player.addBet(amount);
        case "fold":
            table.fold(player);
        case "check":
        case "raise":
            player.raise(amount,table); //Have not written yet
        case "call":
            player.addBet(table.getCurrentBet()); //getCurrentBet() not written yet
    }      
}
module.exports={
    playHand:playHand
}