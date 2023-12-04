import Image from 'next/image';
import React from 'react'
import styled from 'styled-components'

const CardBox = styled.div`
  font-size: 10rem;
`;

const Card = ({ rank, suit }) => {

  const name = "/CardImg/"+rank+suit+".png"

  return (

    <CardBox>
        <Image 
            className='cardStyle'
            src={name}
            width={105}
            height={65}
            alt=""
            unoptimized
            priority
        />
    </CardBox>

  )
}

export default Card;

/*
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


      {heartSuit.get(value)}
*/