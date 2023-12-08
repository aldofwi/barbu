import React, { useEffect, useState } from 'react'
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
    //console.log("newtab = ", newTab);

    return newTab;
}

const getNameOfClass = (style) => {

    switch (style) {
        case "positionPick":
            return "relative flex flex-row px-50 left-40 top-60 bottom-20";

        case "mainPlayer":
            return "relative flex flex-row px-50 left-40 top-80 bottom-10";

        case "westPlayer":
            return "relative";

        case "northPlayer":
            return "relative";

        case "eastPlayer":
            return "relative";
    
        default:
            return "relative";
    }
}

const newDeck = suffle(ranks);
// console.log("newDeck = ", newDeck);

const Hand = ({ handStyle, suitChoice, others, onClickHand }) => {

    const getFlip = (c) => {
    // Back = TRUE | Front = FALSE

        if(others.length === 0) {
            return true;
        } else {

            for(let i=0; i<others.length; i++) {
                if(others[i].pick === c) return false;
            }
            return true;
        }
    }


    
  return (

    <div>
        <div className={getNameOfClass(handStyle)}>
            {newDeck.map((element, i) =>
                <Card
                    rank={element}
                    suit={suitChoice}
                    flip={handStyle === "positionPick" ? getFlip(element+suitChoice) : null}
                    key={i}
                    picked={others}
                    onClickCard={(c) => onClickHand(c) }
                />
                
            )}
        </div>
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