import Image from 'next/image';
import React, { useState } from 'react'
//import styled from 'styled-components'

const Card = ({ rank, suit, styled, pos, size }) => {

  const [style, setStyle] = useState([]);
  const [flipped, setFlipped] = useState(false);
  const [positions, setPositions] = useState({x: 0, y:0 });

  const onClickCard = () => {
    flipped ? setFlipped(false) : setFlipped(true);
  }

  const front = "/CardImg/"+rank+suit+".png";
  const back = "/CardImg/back.png";

  const nameofclass = "cardStyle bottom-"+pos.y+" left-"+pos.x; // "+"left-"+pos.x+" bottom-"+pos.y;
  console.log("className = ", nameofclass);
  console.log("position = ", pos);

  return (

    <div>
        <Image 
            className="cardStyle bottom-10 left-10"
            src={flipped === true ? back : front}
            width={105}
            height={65}
            alt="card"
            onClick={() => onClickCard()}
        />
        <Image 
            className="cardStyle bottom-10 left-40"
            src={flipped === true ? back : front}
            width={105}
            height={65}
            alt="card"
            onClick={() => onClickCard()}
        />
        <Image 
            className="cardStyle bottom-10 left-80"
            src={flipped === true ? back : front}
            width={105}
            height={65}
            alt="card"
            onClick={() => onClickCard()}
        />
        <Image 
            className="cardStyle bottom-10 left-120"
            src={flipped === true ? back : front}
            width={105}
            height={65}
            alt="card"
            onClick={() => onClickCard()}
        />
    </div>
  )
}

export default Card;

/*
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