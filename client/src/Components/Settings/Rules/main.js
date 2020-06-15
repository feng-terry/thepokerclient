//This is for the big loop playing the game

//Helper Functions
function postBlinds(table,settings){
    smallBlind = table.getPlayers()[0];
    bigBlind = table.getPlayers()[1];
    smallBlind.addBet(settings.smallBlind);
    bigBlind.addBet(settings.bigBlind)
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

function playhand(table){
	table.dealHands();
    postBlinds(table); //code as bet + raise
    playTurn('preflop')
    playTurn('flop')
    playTurn('turn')
    playTurn('river')
    showdown(table)
}
function playStage(stage){
    if (stage==='preflop'){
        let hold=0; //loop through the below loop twice
        while(potIsOpen(table))
		    for (let i=0; i<length;i++){
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
        while(potIsOpen(table))
        for (let i=0; i<length;i++){
                playTurn(player,table)
                if (player.position === 1 ){
                    table.setBigBlindActed(true)
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
        case "bet"://Unfinised
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
