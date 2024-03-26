import { database } from '@/firebase/config';
import { onValue, ref } from 'firebase/database';
import React, { useEffect, useState } from 'react'
import Card from './Card';

const Board = ({ getUIDPlace }) => {

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
      ref(database, 'game/board/'+getUIDPlace("SOUTH")), (snapshot) => {

        snapshot.forEach((doc) => {
          setCardS(doc.val());
        });
      }
    );

    onValue(
      ref(database, 'game/board/'+getUIDPlace("WEST")), (snapshot) => {
        
        snapshot.forEach((doc) => {
          setCardW(doc.val());
        });
      }
    );

    onValue(
      ref(database, 'game/board/'+getUIDPlace("NORTH")), (snapshot) => {
        
        snapshot.forEach((doc) => {
          setCardN(doc.val());
        });
      }
    );

    onValue(
      ref(database, 'game/board/'+getUIDPlace("EAST")), (snapshot) => {
        
        snapshot.forEach((doc) => {
          setCardE(doc.val());
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