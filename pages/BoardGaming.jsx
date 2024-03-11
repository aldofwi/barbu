import { useAuthContext } from '@/context/AuthContext';
import { database } from '@/firebase/config';
import { onValue, ref, update } from 'firebase/database';
import React, { useEffect, useState } from 'react';


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
  // console.log("newtab = ", newTab);

  return newTab;
}

const BoardGaming = ({ amI, persoRank, playaz}) => {

    const { user } = useAuthContext();

    const [board, setBoard] = useState([]);

    const [players, setPlayers] = useState(playaz);
    const [myRank, setMyRank] = useState(persoRank);

    const [amIContractor, setAmIContractor] = useState(amI);

    const initHands = () => {
      console.log("BOARDGAME //", user.displayName," déclenche initHands();");
  
      // // NEW PLIS
      // setSouthPlis([]);
      // setWestPlis([]);
      // setNorthPlis([]);
      // setEastPlis([]);
  
      // // NEW DOM HANDS
      // setHandSpides([]);
      // setHandHearts([]);
      // setHandCloves([]);
      // setHandDiamonds([]);
  
      // // NEW SCORE
      // setSouthScore(0);
      // setWestScore(0);
      // setNorthScore(0);
      // setEastScore(0);
  
      // NEW DECK
      setNewDeck(shuffle(cards));
      console.log("New Deck = ", newDeck);
      console.log("New Deck S = ", newDeck.slice(0, 8));
      console.log("New Deck W = ", newDeck.slice(8, 16));
      console.log("New Deck N = ", newDeck.slice(16, 24));
      console.log("New Deck E = ", newDeck.slice(24, 32));
  
      update(ref(database, 'game/current/'), {
        colorAsk: "",
        contract: "",
        endOfContract: true,
        nbClic: 0,
      });
  
      // SEND Hands


      
      // set(ref(database, 'game/hands/'), {
      //   SOUTH:  newDeck.slice(0, 8),
      //   WEST:   newDeck.slice(8, 16),
      //   NORTH:  newDeck.slice(16, 24),
      //   EAST:   newDeck.slice(24, 32), 
      // });
  
      if(endOfSeven) setEndOfSeven(false);
    }

    const getPlaceByMyRank = (cardinal) => {

      switch(myRank) {
  
        case 1 : 
          switch(cardinal) {
            case "SOUTH"  : return 0;
            case "WEST"   : return 1;
            case "NORTH"  : return 2;
            case "EAST"   : return 3;
            default : break;
          }
        case 2 : 
          switch(cardinal) {
            case "SOUTH"  : return 1;
            case "WEST"   : return 2;
            case "NORTH"  : return 3;
            case "EAST"   : return 0;
            default : break;
          }
        case 3 : 
          switch(cardinal) {
            case "SOUTH"  : return 2;
            case "WEST"   : return 3;
            case "NORTH"  : return 0;
            case "EAST"   : return 1;
            default : break;
          }
        case 4 : 
          switch(cardinal) {
            case "SOUTH"  : return 3;
            case "WEST"   : return 0;
            case "NORTH"  : return 1;
            case "EAST"   : return 2;
            default : break;
          }
        default: break;
      }
    }

    if(amI) initHands();

    useEffect(() => {

        onValue(
          ref(database, 'game/contractor/uid' ), (snapshot) => {
            setAmIContractor(snapshot.val() === user.uid);
          }
        );

    }, []);
    
    console.log("BOARDGAMING // Contractor : "+amIContractor);
    console.log("BOARDGAMING // Contractor : "+amI);
    
  return (

    <div>
       
      <PlayerBox
        id="SOUTH"
        board={board}
        player={players[getPlaceByMyRank("SOUTH")]}
        myCards={southHand}
        hasToPlay={hasToPlay}
        contractor={contractor}
        getBoxClass={(e) => getBoxClass(e)}
        clickBoard={(key) => onClickBoard(key)}
        nameOfClass={`${positions[0]}`}
      />

    </div>
  )

}

export default BoardGaming;

/*
    <div className='boardgame h-screen bg-[#121212] text-white container justify-center items-center'>
        
        <div className="choiceTitle">BoardGaming
          <p>Contractor : {amIContractor ? "True" : "False"} </p>
        </div>

    </div>
*/