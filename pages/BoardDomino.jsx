import { database } from '@/firebase/config';
import { onValue, ref } from 'firebase/database';
import React, { useEffect, useState } from 'react';
import Hand from './Hand';

const cards_S = ["7s", "8s", "9s", "ts", "js", "qs", "ks", "as"];
const cards_H = ["7h", "8h", "9h", "th", "jh", "qh", "kh", "ah"];
const cards_C = ["7c", "8c", "9c", "tc", "jc", "qc", "kc", "ac"];
const cards_D = ["7d", "8d", "9d", "td", "jd", "qd", "kd", "ad"];

const BoardDomino = ({ cardSpides, cardHearts, cardCloves, cardDiamonds }) => {

  return (

    <div className="absolute align-center justify-center top-56 left-48">

        <Hand
          handStyle="SPIDES"
          cards={cardSpides}
        />
      
        <Hand
          handStyle="HEARTS"
          cards={cardHearts}
        />

        <Hand
          handStyle="CLOVES"
          cards={cardCloves}
        />

        <Hand
          handStyle="DIAMONDS"
          cards={cardDiamonds}
        />
    
    </div>

  )
}

export default BoardDomino;