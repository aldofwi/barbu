/* eslint-disable react-hooks/exhaustive-deps */
import { onValue, ref, remove, set, update } from 'firebase/database';
import { useAuthContext } from '@/context/AuthContext';
import React, { useEffect, useState } from 'react';
import { database } from '@/firebase/config';

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

  const { user } = useAuthContext();

  const [myRank, setMyRank] = useState(0);
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
  const [nbClic, setNbClic] = useState(0);
  const [master, setMaster] = useState("");

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

        if(playerz[i].uid === user.uid) setMyRank(playerz[i].rank);
        
        if(playerz[i].rank === nb) {
          playaz.push(playerz[i]);
          nb++;
        }
      }
    }
    return playaz;
  }

  // TODO : sortPlayerz with UID 
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

  const getPlaceByUid = (id) => {
    let thatRank = 0;

    for (let i = 0; i < players.length; i++) {
      if(players[i].uid === id) thatRank = players[i].rank;
    }

    if(thatRank === myRank) return "SOUTH";

    switch(thatRank) {

      case 1 : 
        switch(myRank) {
          case 2 : return "EAST";
          case 3 : return "NORTH";
          case 4 : return "WEST";
          default: break;
        }
      case 2 : 
        switch(myRank) {
          case 1 : return "WEST";
          case 3 : return "EAST";
          case 4 : return "NORTH";
          default: break;
        }
      case 3 : 
        switch(myRank) {
          case 1 : return "NORTH";
          case 2 : return "WEST";
          case 4 : return "EAST";
          default: break;
        }
      case 4 : 
        switch(myRank) {
          case 1 : return "EAST";
          case 2 : return "NORTH";
          case 3 : return "WEST";
          default: break;
        }
      default: break;
    }
  }

  const getBoxClass = (oneID) => {
    // console.log("BOARDGAME // getClass ", hasToPlay);
    // HAS TO PLAY :  border border-2 rounded-full border-[red]
    switch(oneID) {
      case "SOUTH":
        if(hasToPlay === oneID) return "image_S border border-2 rounded-full border-[red]"
        else return "image_S";

      case "NORTH": 
      if(hasToPlay === oneID) return "image_N border border-2 rounded-full border-[red]"
        else return "image_N";

      case "EAST" : 
      if(hasToPlay === oneID) return "image_E border border-2 rounded-full border-[red]"
        else return "image_E";

      case "WEST" : 
      if(hasToPlay === oneID) return "image_W border border-2 rounded-full border-[red]"
        else return "image_W";

      default: break;
    }
  }

  const cleanBoard = (diBoard) => {

    if(diBoard.length === 4) {

      setTimeout(() => {
        // setBoard([]);
        remove(ref(database, 'game/board/'));
        console.log("BOARDGAME // CleanBoard() - Done");
      }, 1500);
    }
  }

  const whoIsTheMaster = (daBoard) => {
    console.log("BOARDGAME // whoIsTheMaster() = ", daBoard.length);
    console.log("BOARDGAME // Board = ", daBoard);

    if(daBoard.length === 4) {

      let masterKey = 0;
      let masterPlace = daBoard[masterKey].place;

      for(let i=1; i<daBoard.length; i++) {
        if(cardValues.indexOf(daBoard[i].value.charAt(0)) > cardValues.indexOf(daBoard[masterKey].value.charAt(0))) {
          console.log("cardValues.indexOf(daBoard[i].value.charAt(0))", cardValues.indexOf(daBoard[i].value.charAt(0)), " > ", cardValues.indexOf(daBoard[masterKey].value.charAt(0)) ,"cardValues.indexOf(daBoard[masterKey].value.charAt(0))");
          masterKey = i;
          masterPlace = daBoard[masterKey].place;
        }
      }
      console.log("BOARDGAME // Who is The Master = ", masterPlace);

      cleanBoard(daBoard);

      return(masterPlace);
    }
  }

  const onClickBoard = () => {
    console.log("BOARDGAME // onClickBoard() // board", board);

  }

  useEffect(() => {
    // TODO Prod change place to UID.
    onValue(
      ref(database, 'game/contractor/uid' ), (snapshot) => {
        setContractor(snapshot.val());
        nbClic === 0 ? setHasToPlay(getPlaceByUid(contractor)) : null;
      }
    );
      
    onValue(
      ref(database, 'game/players/' ), (snapshot) => {
        let playz = [];
          snapshot.forEach((doc) => {
            playz.push({...doc.val()});
          });
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
        setNbClic(nbClic+1);
        theBoard.length === 4 ? setHasToPlay(whoIsTheMaster(theBoard)) : console.log("BOARDGAME // onValue : Board(", theBoard.length, ")");
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

    onValue(
      ref(database, 'game/current/nbClic' ), (snapshot) => {
          setNbClic(snapshot.val());
      }
    );

  }, []);

  console.log("BOARDGAME _--------------------_");
  console.log("BOARDGAME // myRank = ", myRank);
  console.log("BOARDGAME // board = ", board.length);
  console.log("BOARDGAME // master = ", master);
  console.log("BOARDGAME // nbClic = ", nbClic);
  console.log("BOARDGAME // contract = ", contract);
  console.log("BOARDGAME // hasToPlay = ", hasToPlay);
  console.log("BOARDGAME // contractor = ", getPlaceByUid(contractor));
  console.log("BOARDGAME // endOfContract = ", endOfContract);
  console.log("BOARDGAME -____________________-");


  return (

    <div>

      <PlayerBox
        id="EAST"
        board={board}
        player={players[getPlaceByMyRank("EAST")]}
        myCards={eastHand}
        hasToPlay={hasToPlay}
        contractor={contractor}
        getBoxClass={(e) => getBoxClass(e)}
        clickBoard={(key) => onClickBoard(key)}
        nameOfClass={`${positions[3]}`}
      />

      <PlayerBox
        id="NORTH"
        board={board}
        player={players[getPlaceByMyRank("NORTH")]}
        myCards={northHand}
        hasToPlay={hasToPlay}
        contractor={contractor}
        getBoxClass={(e) => getBoxClass(e)}
        clickBoard={(key) => onClickBoard(key)}
        nameOfClass={`${positions[2]}`}
      />

      <PlayerBox
        id="WEST"
        board={board}
        player={players[getPlaceByMyRank("WEST")]}
        myCards={westHand}
        hasToPlay={hasToPlay}
        contractor={contractor}
        getBoxClass={(e) => getBoxClass(e)}
        clickBoard={(key) => onClickBoard(key)}
        nameOfClass={`${positions[1]}`}
      />
        
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

        {
          endOfContract 
              ?

            <Panel 
              contractor={getPlaceByUid(contractor)}
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
