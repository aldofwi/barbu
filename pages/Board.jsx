import { database } from '@/firebase/config';
import { onValue, ref } from 'firebase/database';
import React, { useEffect, useState } from 'react'
import Card from './Card';

const Board = ({ }) => {

  const [cardS, setCardS] = useState("");
  const [cardW, setCardW] = useState("");
  const [cardN, setCardN] = useState("");
  const [cardE, setCardE] = useState("");

  const cleanCards = (diBoard) => {

    if(diBoard.length === 0) {      
        setCardS("");
        setCardW("");
        setCardN("");
        setCardE("");
    }
  }

  useEffect(() => {
    
    onValue(
      ref(database, 'game/board/SOUTH' ), (snapshot) => {

        snapshot.forEach((doc) => {
          setCardS(doc.val());
          // console.log("BOARD // cardS =", cardS);
        });
      }
    );

    onValue(
      ref(database, 'game/board/WEST' ), (snapshot) => {
        
        snapshot.forEach((doc) => {
          setCardW(doc.val());
          // console.log("BOARD // cardW =", cardW);
        });
      }
    );

    onValue(
      ref(database, 'game/board/NORTH' ), (snapshot) => {
        
        snapshot.forEach((doc) => {
          setCardN(doc.val());
          // console.log("BOARD // cardN =", cardN);
        });
      }
    );

    onValue(
      ref(database, 'game/board/EAST' ), (snapshot) => {
        
        snapshot.forEach((doc) => {
          setCardE(doc.val());
          // console.log("BOARD // cardE =", cardE);
        });
      }
    );

    onValue(
      ref(database, 'game/board' ), (snapshot) => {
        let oneBoard = [];
        snapshot.forEach((doc) => {
          oneBoard.push(doc.val());
        });
        cleanCards(oneBoard);
      }
    );
  
  });

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