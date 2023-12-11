import { useAuthContext } from '@/context/AuthContext';
import Image from 'next/image';
import React, { useEffect, useState } from 'react';

const getNameOfClassCard = (style) => {

  switch (style) {
      case "positionPick":
          return "relative";

      case "mainPlayer":
          return "relative px-2 w-32"; // Done

      case "westPlayer":
          return "relative px-2 w-16 rotate-90";

      case "northPlayer":
          return "relative px-2 w-16";

      case "eastPlayer":
          return "relative px-2 w-16 rotate-90";

      case "mainBoard":
          return "boardCS";

      case "westBoard":
          return "boardCW";

      case "northBoard":
          return "boardCN";

      case "eastBoard":
          return "boardCE";
  
      default:
          return "relative";
  }
}

const Card = ({ value, flip, picked, cardStyle, onClickCard }) => {

  const { user } = useAuthContext();

  const front = "/CardImg/"+value+".png";
  const back = "/CardImg/back.png";

  const handleClickCard = (c) => {

    if(cardStyle === "positionPick") {
      for(let i=0; i<picked.length; i++) {
        if(picked[i].username === user.displayName) {
          alert('Sorry, You already picked a card!');
          return;
        }
      }
  
      if(!flip) alert('Already picked.');
      else {
        onClickCard(c);
      }
    } else {
      // 
    }
    
  }

  return (

    <div className={getNameOfClassCard(cardStyle)}>
        <Image 
            className="rounded-lg"
            src={flip ? back : front}
            width={105}
            height={65}
            alt="card"
            onClick={() => { handleClickCard(value) }}
        />
    </div>
  )
}

export default Card;

/*


        <Image 
            className="cardStyle bottom-10 left-44"
            src={flipped === true ? back : front}
            width={105}
            height={65}
            alt="card"
            onClick={() => onClickCard()}
        />
        <Image 
            className="cardStyle bottom-10 left-64"
            src={flipped === true ? back : front}
            width={105}
            height={65}
            alt="card"
            onClick={() => onClickCard()}
        />
        <Image 
            className="cardStyle bottom-10 left-84"
            src={flipped === true ? back : front}
            width={105}
            height={65}
            alt="card"
            onClick={() => onClickCard()}
        />
        <Image 
            className={nameofclass}
            src={flipped === true ? back : front}
            width={105}
            height={65}
            alt="card"
            onClick={() => onClickCard()}
        />


<div style={{ left: pos.x }}></div>
const heartSuit = new Map([
  ["Seven", "🂷"],
  ["Eight", "🂸"],
  ["Nine",  "🂹"],
  ["Ten",   "🂺"],
  ["Jack",  "🂻"],
  ["Queen", "🂽"],
  ["King",  "🂾"],
  ["Ace",   "🂱"],
  ["Back",  "🂠"],
]);


const CardBox = styled.div`
`;

      {heartSuit.get(value)}
*/