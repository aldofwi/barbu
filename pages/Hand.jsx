import React, { useState } from 'react'
import Card from './Card';

const getNameOfClass = (style) => {

    switch (style) {
        case "positionPick":
            return "relative flex flex-row px-50 left-40 top-60 bottom-20";

        case "SOUTH":
            return "relative flex px-50 left-80 top-8"; // Done

        case "WEST":
            return "relative px-50 top-40 -right-2";

        case "NORTH":
            return "relative flex pl-64 px-50 left-80 -top-8";

        case "EAST":
            return "relative px-50 top-40 -left-2";

        case "board":
            return "relative px-50 justify-center";
    
        default:
            return "relative";
    }
}

const getCardPos = (iCard) => {
    // BOARD
    switch(iCard) {
        case 0 :
            return "southBoard";

        case 1 :
            return "westBoard";

        case 2 :
            return "northBoard";

        case 3 :
            return "eastBoard";
    
        default:
            return "relative";
    }
}


const Hand = ({ handStyle, cards, others, onClickHand }) => {

    // console.log("cards = ", cards);
    const getFlip = (c) => {
    // Back = TRUE | Front = FALSE

        if(others.length === 0) return true;
        else {
            for(let i=0; i<others.length; i++) {
                if(others[i].pick === c) return false;
            }
            return true;
        }
    }

  return (
    // TODO : correct flip condition
        <div className={getNameOfClass(handStyle)}>
            {cards?.map((element, i) =>
                <Card
                    value={element}
                    flip={handStyle === "positionPick" ? getFlip(element) : false}
                    key={i}
                    picked={others}
                    cardStyle={handStyle === "board" ? getCardPos(i) : handStyle}
                    onClickCard={(c) => onClickHand(c) }
                />
                
            )}
        </div>


  )
};

export default Hand;