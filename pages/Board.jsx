import React, { useState } from 'react'
import Card from './Card';
import Hand from './Hand';

const Board = () => {
  // Board
  const [myCards, setMyCards] = useState(["8h", "th", "kh", "9h"]);



  return (

    <div>
    
    <Hand
      handStyle={"board"}
      cards={myCards}
    />
    
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