import { database } from '@/firebase/config';
import { onValue, ref, remove, set, update } from 'firebase/database';
import React, { useEffect, useState } from 'react';
import ContractName from './ContractName';
import PlayerBox from './PlayerBox';
import Board from './Board';
import Panel from './Panel';

const cardValues = ["7", "8", "9", "t", "j", "q", "k", "a"];

const positions = [
  'absolute bottom-10 justify-center',
  'absolute left-10 justify-center',
  'absolute top-10 justify-center',
  'absolute right-10 justify-center',
];

const cards = [
  "7h", "8h", "9h", "th", "jh", "qh", "kh", "ah",
  "7s", "8s", "9s", "ts", "js", "qs", "ks", "as",
  "7c", "8c", "9c", "tc", "jc", "qc", "kc", "ac",
  "7d", "8d", "9d", "td", "jd", "qd", "kd", "ad",
];

const contracts = [
  "RATA",
  "Barbu",
  "Domino",
  "Coeurs",
  "Dames",
  "Plis",
  "Dernier Pli"
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

const BoardGame = () => {

  const [nbClic, setNbClic] = useState(0);
  const [newDeck, setNewDeck] = useState(shuffle(cards));
  const [eastHand,  setEastHand]  = useState(newDeck.slice(24, 32));
  const [northHand, setNorthHand] = useState(newDeck.slice(16, 24));
  const [westHand,  setWestHand]  = useState(newDeck.slice(8, 16));
  const [southHand, setSouthHand] = useState(newDeck.slice(0, 8));

  const [board, setBoard] = useState([]);
  const [players, setPlayers] = useState([]);
  const [contract, setContract] = useState("");
  const [contractor, setContractor] = useState("");

  const [displayLoading, setDisplayLoading] = useState(false);
  const [hasToPlay, setHasToPlay] = useState("");
  const [master, setMaster] = useState("SOUTH");

  const [contractsDone, setContractsDone] = useState([]);
  const [nbContractsDone, setNbContractsDone] = useState(0); // Max is 28.

  const [endOfContract, setEndOfContract] = useState(true);
  const [endOfGame, setEndOfGame] = useState(false);

  // INIT Hands
  set(ref(database, 'game/hands/'), {
    SOUTH:  southHand,
    WEST:   westHand,
    NORTH:  northHand,
    EAST:   eastHand,   
  });

  const sortPlayz = (playerz) => {

    let nb=1;
    let playaz = [];
    while(nb<5) {
      for(let i=0; i<playerz.length; i++) {
        
        if(playerz[i].rank === nb) {
          playaz.push(playerz[i]);
          nb++;
        }
      }
    }
    return playaz;
  }

  const cleanBoard = (diBoard) => {

    if(diBoard.length === 4) {

      setTimeout(() => {
        setBoard([]);
        remove(ref(database, 'game/board/'));
        console.log("BOARDGAME // CleanBoard() - Done");
      }, 1500);
    }
  }

  const whoIsTheMaster = (daBoard) => {
    console.log("BOARDGAME // whoIsTheMaster() = ", daBoard.length);
    console.log("BOARDGAME // Board = ", daBoard);

    if(daBoard.length === 4) {

      let masterPlace = "";

      for(let i=1; i<daBoard.length; i++) {
        if(cardValues.indexOf(daBoard[i].value.charAt(0)) > cardValues.indexOf(daBoard[i-1].value.charAt(0))) {
          masterPlace = daBoard[i].place;
        }
      }
      console.log("BOARDGAME // Who is The Master = ", masterPlace);
      // alert("BOARDGAME // Who is The Master = "+masterPlace);

      cleanBoard(daBoard);
      setMaster(masterPlace);
      setHasToPlay(masterPlace);
      // setTimeout(() => { remove(ref(database, 'game/board/')) }, 2000);
      // return masterPlace;
    } // else return "";
  }

  const onBoardClick = (oneBoard) => {

    // alert("BOARDGAME // onBoardClick() = "+oneBoard.length);
    console.log("BOARDGAME // onBoardClick() = ", oneBoard.length);

    if(oneBoard.length < 3) {

      switch(hasToPlay) {
        case "SOUTH": 
        update(ref(database, 'game/current/'), {
          hasToPlay: "WEST",
        });
        return;
      case "WEST":  
        update(ref(database, 'game/current/'), {
          hasToPlay: "NORTH",
        });
        return;
      case "NORTH":  
        update(ref(database, 'game/current/'), {
          hasToPlay: "EAST",
        });
        return;
      case "EAST":
        update(ref(database, 'game/current/'), {
          hasToPlay: "SOUTH",
        });
        return;

      default: break;
      } 
    } 

  }

  // CHANGE CONTRACTOR

  useEffect(() => {
    // TODO Prod change place to UID.
    onValue(
      ref(database, 'game/contractor/name' ), (snapshot) => {
        setContractor(snapshot.val());
      }
    );
      
    onValue(
      ref(database, 'game/players/' ), (snapshot) => {
        let playz = [];
          snapshot.forEach((doc) => {
            playz.push({...doc.val()});
          });
          //console.log("playz : ", playz);
          setPlayers(sortPlayz(playz));
      }
    );

    onValue(
      ref(database, 'game/board' ), (snapshot) => {
        let theBoard = [];
        snapshot.forEach((doc) => {
          theBoard.push(doc.val());
        });
        setBoard(theBoard);
        whoIsTheMaster(theBoard);
      }
    );

    onValue(
      ref(database, 'game/hands/SOUTH' ), (snapshot) => {
        setSouthHand(snapshot.val());
      }
    );

    onValue(
      ref(database, 'game/hands/WEST' ), (snapshot) => {
        setWestHand(snapshot.val());
      }
    );

    onValue(
      ref(database, 'game/hands/NORTH' ), (snapshot) => {
        setNorthHand(snapshot.val());
      }
    );

    onValue(
      ref(database, 'game/hands/EAST' ), (snapshot) => {
        setEastHand(snapshot.val());
      }
    );

    onValue(
      ref(database, 'game/current/contract' ), (snapshot) => {
          setContract(snapshot.val());
      }
    );

    onValue(
      ref(database, 'game/current/nbClic' ), (snapshot) => {
          setNbClic(snapshot.val());
      }
    );

    onValue(
      ref(database, 'game/current/hasToPlay' ), (snapshot) => {
          setHasToPlay(snapshot.val());
      }
    );

    onValue(
      ref(database, 'game/current/endOfContract' ), (snapshot) => {
          setEndOfContract(snapshot.val());
      }
    );

  }, []);

  console.log("BOARDGAME _--------------------_");
  console.log("BOARDGAME // board = ", board.length);
  console.log("BOARDGAME // master = ", master);
  console.log("BOARDGAME // contract = ", contract);
  console.log("BOARDGAME // hasToPlay = ", hasToPlay);
  console.log("BOARDGAME // contractor = ", contractor);
  console.log("BOARDGAME // endOfContract = ", endOfContract);
  console.log("BOARDGAME -____________________-");


  return (

    <div>

      <PlayerBox
        id="EAST"
        board={board}
        player={players[3]}
        myCards={eastHand}
        hasToPlay={hasToPlay}
        whoIsMaster={() => whoIsTheMaster()}
        clickBoard={() => onBoardClick(board)}
        contractor={contractor}
        nameOfClass={`${positions[3]}`}
      />

      <PlayerBox
        id="NORTH"
        board={board}
        player={players[2]}
        myCards={northHand}
        hasToPlay={hasToPlay}
        whoIsMaster={() => whoIsTheMaster()}
        clickBoard={() => onBoardClick(board)}
        contractor={contractor}
        nameOfClass={`${positions[2]}`}
      />

      <PlayerBox
        id="WEST"
        board={board}
        player={players[1]}
        myCards={westHand}
        hasToPlay={hasToPlay}
        whoIsMaster={() => whoIsTheMaster()}
        clickBoard={() => onBoardClick(board)}
        contractor={contractor}
        nameOfClass={`${positions[1]}`}
      />
        
      <PlayerBox
        id="SOUTH"
        board={board}
        player={players[0]}
        myCards={southHand}
        hasToPlay={hasToPlay}
        whoIsMaster={() => whoIsTheMaster()}
        clickBoard={() => onBoardClick(board)}
        contractor={contractor}
        nameOfClass={`${positions[0]}`}
      />

        {
          endOfContract 
              ?

            <Panel 
              contractor={contractor}
            />
            
              :
            <Board
              oneBoard={board}
            />
        }

        <ContractName value={contract} />
        
    </div>

  )
}

export default BoardGame;
