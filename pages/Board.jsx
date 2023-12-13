import { database } from '@/firebase/config';
import { onValue, ref } from 'firebase/database';
import React, { useEffect, useState } from 'react'
import Card from './Card';
import Hand from './Hand';

const Board = () => {
  // Board
  // const [board, setBoard] = useState([]); // myCards
  //const [myCards, setMyCards] = useState(["8h", "th", "kh", "9h"]);

  const [cardS, setCardS] = useState("");
  const [cardW, setCardW] = useState("");
  const [cardN, setCardN] = useState("");
  const [cardE, setCardE] = useState("");

  useEffect(() => {
    
    onValue(
      ref(database, 'game/board/SOUTH' ), (snapshot) => {
        
        snapshot.forEach((doc) => {
          setCardS(doc.val());
        });
      }
    );

    onValue(
      ref(database, 'game/board/WEST' ), (snapshot) => {
        
        snapshot.forEach((doc) => {
          setCardW(doc.val());
        });
      }
    );

    onValue(
      ref(database, 'game/board/NORTH' ), (snapshot) => {
        
        snapshot.forEach((doc) => {
          setCardN(doc.val());
        });
      }
    );

    onValue(
      ref(database, 'game/board/EAST' ), (snapshot) => {
        
        snapshot.forEach((doc) => {
          setCardE(doc.val());
        });
      }
    );
  
  }, []);
  

  return (

    <div>
      {
        cardS
          ?  
        <Card
          value={cardS}
          flip={false}
          key={"SOUTH"}
          cardStyle={"southBoard"}
        />
          :
          null
      }

      {
        cardW
          ?  

        <Card
          value={cardW}
          flip={false}
          key={"WEST"}
          cardStyle={"westBoard"}
        />
          :
          null
      }

      {
        cardN
          ?  
        <Card
          value={cardN}
          flip={false}
          key={"NORTH"}
          cardStyle={"northBoard"}
        />
          :
          null
      }

      {
        cardE
          ?  
        <Card
          value={cardE}
          flip={false}
          key={"EAST"}
          cardStyle={"eastBoard"}
        />
          :
          null
      }

    </div>

  )
}

export default Board;

/*
      <Card
          value={myCards[0]}
          flip={false}
          key={i}
          picked={others}
          cardStyle={handStyle}
          onClickCard={(c) => onClickHand(c) }
      />
*/