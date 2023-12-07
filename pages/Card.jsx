import { useAuthContext } from '@/context/AuthContext';
import Image from 'next/image';
import React, { useEffect, useState } from 'react';

const Card = ({ rank, suit, flip, picked, onClickCard }) => {

  const { user } = useAuthContext();

  const card = rank+suit;
  const front = "/CardImg/"+rank+suit+".png";
  const back = "/CardImg/back.png";

  const handleClickCard = (c) => {

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
  }

  return (

    <div className="px-2">
        <Image 
            className="rounded-lg"
            src={flip ? back : front}
            width={105}
            height={65}
            alt="card"
            onClick={() => { handleClickCard(card) }}
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