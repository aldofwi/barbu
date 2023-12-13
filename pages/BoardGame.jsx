import { database } from '@/firebase/config';
import { ref, set } from 'firebase/database';
import React, { useState } from 'react'
import Board from './Board';
import Panel from './Panel';
import PlayerBox from './PlayerBox';

const positions = [
  'absolute bottom-10 right-0',
  'absolute left-10 justify-center',
  'absolute top-0 right-1/3',
  'absolute right-10 justify-center',
];

const cards = [
  "7h", "8h", "9h", "th", "jh", "qh", "kh", "ah",
  "7s", "8s", "9s", "ts", "js", "qs", "ks", "as",
  "7c", "8c", "9c", "tc", "jc", "qc", "kc", "ac",
  "7d", "8d", "9d", "td", "jd", "qd", "kd", "ad",
];

const shuffle = (tab) => {

  const theTab = [...tab];
  const newTab = [];
  let i;  let n = tab.length;
  
  // While it remains elements to suffle.
  while(n) {
      // Pick a remaining element.
      i = Math.floor(Math.random() * theTab.length);
      
      // If not already shuffle, move it to the new array.
      newTab.push(theTab[i]);
      theTab.splice(i, 1);
      //delete tab[i];
      n--;
  }
  console.log("newtab = ", newTab);

  return newTab;
}

const BoardGame = ({ players }) => {

  const [nbClic, setNbClic] = useState(0);
  const [newDeck, setNewDeck] = useState(shuffle(cards));
  const [eastHand,  setEastHand]  = useState(newDeck.slice(24, 32));
  const [northHand, setNorthHand] = useState(newDeck.slice(16, 24));
  const [westHand,  setWestHand]  = useState(newDeck.slice(8, 16));
  const [southHand, setSouthHand] = useState(newDeck.slice(0, 8));

  const [contractor, setContractor] = useState("");
  const [displayLoading, setDisplayLoading] = useState(false);
  const [nbContractsDone, setNbContractsDone] = useState(0); // Max is 28.
  const [endOfContract, setEndOfContract] = useState(true);
  const [endOfGame, setEndOfGame] = useState(false);

  set(ref(database, 'game/hands/'), {
    SOUTH: southHand,
  });

  // Nettoyer les mains en base directement
  // UPDATE & Remove from db in PlayerBox

  console.log("1st Hand = ", eastHand);
  console.log("2nd Hand = ", northHand);
  console.log("3rd Hand = ", westHand);
  console.log("4th Hand = ", southHand);

  const handlePlayerClick = () => {

    alert("handlePlayerClick()");
  }

  // CHANGE CONTRACTOR


/*
  UseEffect : 
    onValue
      allHands
*/

  return (

    <div>

      <PlayerBox
        id="EAST"
        player={players[1]}
        myCards={eastHand}
        nameOfClass={`${positions[3]}`}
        onPlayerClick={() => handlePlayerClick()}
      />

      <PlayerBox
        id="NORTH"
        player={players[0]}
        myCards={northHand}
        nameOfClass={`${positions[2]}`}
      />

      <PlayerBox
        id="WEST"
        player={players[1]}
        myCards={westHand}
        nameOfClass={`${positions[1]}`}
      />
        
      <PlayerBox
        id="SOUTH"
        player={players[0]}
        myCards={southHand}
        nameOfClass={`${positions[0]}`}
      />

        {
          !endOfContract 
              ?

            <Panel />
            
              :
            <Board

            />
        }
        
    </div>

  )
}

export default BoardGame;
