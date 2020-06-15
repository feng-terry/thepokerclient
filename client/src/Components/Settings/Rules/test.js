import * as main from './main.js';
import * as hand from './handComparison.js'

for (let i=0;i<100;i++){
//################Random##################
let t = new main.Table();
t.newHand();
t.addCard();
t.addCard();
t.addCard();
t.addCard();
t.addCard();
console.log(t.getCards());

let p1 = new main.Player("P1",200,1);
p1.addCards(t.deck);


let p2 = new main.Player("P2",200,1);
p2.addCards(t.deck);

let l = [p1,p2];

console.log(p1.getCards());
console.log(p2.getCards());
//####################################
//###############Specific####
/*let t = new main.Table();
t.cards = [new main.Card(9,"D"),new main.Card(9,"S"),new main.Card(9,"C"),new main.Card(11,"S"),new main.Card(10,"D")]
console.log(t.getCards());

let p1 = new main.Player("P1",0,0);
let p2 = new main.Player("P2",0,0);

p1.cards = [new main.Card(5,"D"),new main.Card(4,"C")];
p2.cards = [new main.Card(3,"S"),new main.Card(5,"C")]
console.log(p1.getCards());
console.log(p2.getCards());

let l = [p1,p2];*/

console.log(hand.handComparison(l,t));
if (hand.handComparison(l,t) === undefined){
    break
}
}

