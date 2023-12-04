import React from 'react'
import Card from './Card';

const suits = ["s", "d", "c", "h"];
const ranks = ["7", "8", "9", "t", "j", "q", "k", "a"];

const suffle = (tab) => {

    const theTab = [...tab];
    const newTab = [];
    let i;  let n = tab.length;
    
    // While it remains elements to suffle.
    while(n) {
        // Pick a remaining element.
        i = Math.floor(Math.random() * theTab.length);
        
        // If not already shuffle, move it to the new array.
        newTab.push(theTab[i]);
        theTab.splice(i, 1);
        //delete tab[i];
        n--;
    }
    console.log("newtab = ", newTab);

    return newTab;
}

const newDeck = suffle(ranks);
console.log("newDeck = ", newDeck);

const Hand = () => {

  return (

    <div>
        {newDeck.map((element, i) => 
            <Card 
                rank={element} 
                suit="h"
                key={i} 
            />
        )}
    </div>


  )
};

export default Hand;

//  <Card rank="ba" suit="ck" />
/*

const getHeartDeck = () => {
    const firstDeck = 
    const heartDeck = []

    firstDeck.forEach(element => {
        heartDeck.push(element + "h");
    });

     return heartDeck;
}

*/