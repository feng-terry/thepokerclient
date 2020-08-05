//This is for comparing which hand wins

handComparison =function(playerList, tableCards){
    let newPlayerList = Array.from(playerList);
    let handList = [];
    let valueList = [];
    for (const player of playerList){
        const cardList = tableCards.concat(player.getCards()); 
        const [typeOfHand,valueOfHand] = hand(cardList);
        handList.push(typeOfHand);
        valueList.push(valueOfHand); 
    }
    //Finding the best hand
    const minValue = Math.min(...handList);
    const sameHand = handList.filter(x => x === minValue).length;
    if (sameHand === 1){
        const index = handList.indexOf(minValue);
        return playerList[index];
    }
    else if (sameHand > 1){
        let tieList = [];
        let tieValueList = [];
        for (let i = 1; i<=sameHand; i++){
            const index = handList.indexOf(minValue);
            tieList.push(newPlayerList[index]);
            tieValueList.push(valueList[index]);
            handList.splice(index,1);
            newPlayerList.splice(index,1);
            valueList.splice(index,1);
        }
        return tiebreaker(tieList,tieValueList,tableCards,minValue);
    }
}
function lowToHigh(cardList){
    let rankList=[]
    for(let i=0; i<cardList.length;i++){
        rankList.push(cardList[i].rank);
    }
    rankList.sort(function(a, b){return a - b});
    return rankList;
}
function isFlush(cardList){
    let flushTable = {"D":0,"C":0,"H":0,"S":0};
    for (const card of cardList){
        flushTable[card.suit]++;
    }
    for (const i in flushTable){
        if (flushTable[i] >= 5){
            let sameSuit = [];
            for(const card of cardList){
                if (card.suit === i){
                    sameSuit.push(card);
                }
            }
            return lowToHigh(sameSuit);
        }
    }
    return null
}
function isStraight(cardList){
    let rankList = [];
    if(cardList===null){
        return null;
    }
    else if (typeof cardList[0] != "number"){
        rankList = lowToHigh(cardList);
        rankList = [...new Set(rankList)];
    }
    else{
        rankList = cardList
    }
    for (let i=1; i<=rankList.length-4;i++){
        if (rankList[rankList.length-i] - rankList[rankList.length-4-i]===4){
            return rankList.slice(rankList.length-4-i,rankList.length-i+1);
        }
        if (rankList[rankList.length-1]===14 && rankList[3]===5){
            return [rankList[rankList.length-1]].concat(rankList.slice(0,4));
        }
    }
    return null;
}
function isStraightFlush(cardList){
    const flush = isFlush(cardList);
    const straight = isStraight(cardList)
    const straightFlush = isStraight(flush)
    if (straightFlush!=null){
        return [0,straightFlush[straightFlush.length-1]];
    }
    else if (flush != null){
        return [3,flush[flush.length-1]];
    } 
    else if (straight !=null){
        return [4,straight[straight.length-1]];
    }    
}
hand = function(cardList){
    let histogram = generateHistogram(cardList)
    //4 of a Kind
    if (histogram.includes(4) === true){
        const index = histogram.indexOf(4);
        return [1,index+2];
    }
    //Full House
    if (histogram.includes(3) === true){
        let index = histogram.indexOf(3);
        if (histogram.includes(3,index+1)===true){
            const segment = histogram.slice(index+1,histogram.length);
            let index2 = segment.indexOf(3);
            index2 = index + 1 + index2;
            index = index2;
        }
        let found = false;
        for (const value of histogram){
            if (found === true && value >=2){
                return [2,index+2];
            }
            else if (value === 3){
                found = true;
            }
        }
    }
    //Straight Flush/Straight/Flush
    if (isStraightFlush(cardList) != null){
        return isStraightFlush(cardList);
    }
    //Trips
    if (histogram.includes(3) === true){
        let index = histogram.indexOf(3);
        return [5,index+2]
    }
    //Two Pair
    if (histogram.includes(2) === true){
        //Checks for first instance of a pair
        let index = histogram.indexOf(2);
        let index2;
        //Segments a new ararray starting after that instance
        const segment = histogram.slice(index+1,histogram.length);
        if (segment.includes(2)){ //Checks for another instance
            index2 = segment.indexOf(2);
            index2 = index + 1 + index2;
            //Another new segment array if true
            const segment2 = histogram.slice(index2+1,histogram.length);
            if (segment2.includes(2)){
                let index3 = segment2.indexOf(2); //Last instance check
                index3 = index2 + 1 + index3
                if (index2 > 9){
                    return [6,(index3+2)*100 + index2 + 2] //This is for when you have to double digit indexes
                }
                return [6,(index3+2)*10 + index2 + 2]
            }
            if (index > 9){
                return [6,(index2+2)*100 + index + 2]
            }
            return [6,(index2+2)*10 + index + 2]
        }
    }
    //Pair
    if (histogram.includes(2) === true){
        const index = histogram.indexOf(2);
        return [7,index+2];
    }
    //High Card
    let index = null
    for (let i=0;i>histogram.length;i++){
        if (histogram[i] > 0){
            index = i
        }
    }
    return [8,index+2]
}
function tiebreaker(playerList,valueList,tableCards,winningHand){
    let winnerList = []
    let index = 0
    for (let i=0; i<playerList.length;i++){
        winnerList.push([valueList[i],playerList[i]])
    }
    //sort by players with the best hand and slice the rest
    insertionSort(winnerList)
    for (let i=0; i<winnerList.length-1;i++){
        if(winnerList[i][0]>winnerList[i+1][0]){
            winnerList = winnerList.slice(0,i+1)
            break
        }
    }
    //save winning rank to var before removing winning rank from the winnerlist array
    let winningRank = winnerList[0][0]
    for (let i=0; i<winnerList.length;i++){
        winnerList[i]=winnerList[i][1]
    }
    
    let chopList = []
    let winner;
    let max=0;
    switch (winningHand){
        case 0://straight flush
            return straight(winnerList)
        case 1://quads
            return bestKicker(tableCards,winnerList,1)
        case 2://full house
            chopList = [];
            for(const player of winnerList){
                let cardList = tableCards.concat(player.getCards());
                let histogram = generateHistogram(cardList)
                for(let i = 0; i<histogram.length; i++){
                    const rank = i + 2
                    if(histogram[i]>1 && rank>=max && rank!=winningRank){
                        if (rank === max){
                            chopList.push(player);
                        }
                        else if (rank > max){
                            chopList = [player];
                            max = rank
                            winner = player
                        } 
                    }
                }
            }
            if (chopList.length > 1){
                return chopList
            }
            return winner;
        case 3://flush
            chopList=[]
            winner = winnerList[0];
            for(let i = 1;i<playerList.length;i++){
                winner = compareFlush(tableCards,winner,playerList[i])
                if(winner==='tie'){
                    chopList.push(playerList[i])
		    winner = playerList[i]
                } else if (!(winner in chopList)){
                    chopList=[winner]
                }
            }
            if (chopList.length > 1){
                return chopList
            }
            return winner
        case 4://straight
            return straight(winnerList)
        case 5://trips
            return bestKicker(tableCards,winnerList,2)
        case 6://two pair
	        return bestKicker(tableCards,winnerList,1)
        case 7://pair
            return bestKicker(tableCards,winnerList,3)
        case 8://high card
            return bestKicker(tableCards,winnerList,5)
            
    }
}
function insertionSort(winnerList){
    for (let outer = 1; outer < winnerList.length; outer++) {
      for (let inner = 0; inner < outer; inner++) {
        if (winnerList[outer][0] < winnerList[inner][0]) {
          const [element] = winnerList.splice(outer, 1)
          winnerList.splice(inner, 0, element)
        }
      }
    }
    return winnerList.reverse();
  }
function generateHistogram(cardList){
    let histogram = [0,0,0,0,0,0,0,0,0,0,0,0,0];
    for (let i = 0; i<7; i++){
        let rank = cardList[i].rank;
        histogram[rank-2]++;
    }
    return histogram
}
function straight(winnerList){
    if (winnerList.length>1){
        return winnerList;
    } else{
        return winnerList[0];
    }
}
function highestKickers(tableCards,player,numOfKickers){
    let cards = tableCards.concat(player.getCards())
    let histogram = generateHistogram(cards)
    let kickers = []
    for(let i = histogram.length-1; i>=0;i--){
        if (histogram[i]===1 && kickers.length<numOfKickers){
            kickers.push(i+2)
        }
    }
    return kickers
}
function compareKickers(tableCards,player1,player2,numOfKickers){
    let kickers1=highestKickers(tableCards,player1,numOfKickers)
    let kickers2= highestKickers(tableCards,player2,numOfKickers)
    for(let i=0; i<kickers1.length;i++){
        if(kickers1[i]>kickers2[i]){
            return player1
        }
        if(kickers2[i]>kickers1[i]){
            return player2
        }
    }
    return 'tie'
}
function bestKicker(tableCards,playerList,numOfKickers){
    let winner = playerList[0];
    let chopList = [winner];
    for(let i = 1;i<playerList.length;i++){
        winner = compareKickers(tableCards,winner,playerList[i],numOfKickers)
        if (winner === 'tie'){
            chopList.push(playerList[i]);
            winner = playerList[i];
        }
        else if (chopList.includes(winner) === false){
            chopList = [winner];
        }
    }
    if (chopList.length > 1){
        return chopList;
    }
    return winner
}
function compareFlush(tableCards,player1,player2){
    let flush1 = isFlush(player1.getCards().concat(tableCards))
    let flush2 = isFlush(player2.getCards().concat(tableCards))
    for(let i=0; i<flush1.length;i++){
        if(flush1[i]>flush2[i]){
            return player1
        }
        if(flush2[i]>flush1[i]){
            return player2
        }
    }
    return 'tie'
}

module.exports={
    handComparison:handComparison,
    hand:hand
}
