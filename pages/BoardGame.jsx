import React, { useState } from 'react'
import Board from './Board';
import Panel from './Panel';
import PlayerBox from './PlayerBox';

const positions = [
  'absolute bottom-10 justify-center',
  'absolute left-10   justify-center',
  'absolute top-10    justify-center',
  'absolute right-10  justify-center',
];

const cards = [
  "7h", "8h", "9h", "th", "jh", "qh", "kh", "ah",
  "7s", "8s", "9s", "ts", "js", "qs", "ks", "as",
  "7c", "8c", "9c", "tc", "jc", "qc", "kc", "ac",
  "7d", "8d", "9d", "td", "jd", "qd", "kd", "ad",
];

const suffle = (tab) => {

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

const BoardGame = ({ players, rank }) => {

  const [nbClic, setNbClic] = useState(0);
  const [displayLoading, setDisplayLoading] = useState(false);
  const [contractor, setContractor] = useState("");
  const [nbContractsDone, setNbContractsDone] = useState(0); // Max is 28.
  const [endOfContract, setEndOfContract] = useState(true);
  const [endOfGame, setEndOfGame] = useState(false);



  return (

    <div>
        <div className={`${positions[1]}`}>
            <PlayerBox
              player={players[1]}
            // main <Hand /> & <Picture />
            />
        </div>

        <div className={`${positions[0]}`}>
            <PlayerBox
              player={players[0]}
            // main <Hand /> & <Picture />
            />
        </div>

        {
          endOfContract 
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