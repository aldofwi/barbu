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

  const [southPlis, setSouthPlis] = useState([]);
  const [westPlis,  setWestPlis]  = useState([]);
  const [northPlis, setNorthPlis] = useState([]);
  const [eastPlis,  setEastPlis]  = useState([]);

  const [southScore, setSouthScore] = useState(0);
  const [westScore,  setWestScore]  = useState(0);
  const [northScore, setNorthScore] = useState(0);
  const [eastScore,  setEastScore]  = useState(0);

  let [southGlobalScore, setSouthGlobalScore] = useState(0);
  let [westGlobalScore,  setWestGlobalScore]  = useState(0);
  let [northGlobalScore, setNorthGlobalScore] = useState(0);
  let [eastGlobalScore,  setEastGlobalScore]  = useState(0);

  const [board, setBoard] = useState([]);
  const [players, setPlayers] = useState([]);
  const [contract, setContract] = useState("");
  const [contractor, setContractor] = useState("");

  const [displayLoading, setDisplayLoading] = useState(false);
  const [hasToPlay, setHasToPlay] = useState("");
  const [colorAsked, setColorAsked] = useState("");
  const [nbClic, setNbClic] = useState(0);
  const [master, setMaster] = useState("");

  const [contractsDone, setContractsDone] = useState([]);
  const [nbContractsDone, setNbContractsDone] = useState(0); // Max is 28.

  const [endOfContract, setEndOfContract] = useState(false);
  const [endOfGame, setEndOfGame] = useState(false);

  // INIT Hands
  set(ref(database, 'game/hands/'), {
    SOUTH:  southHand,
    WEST:   westHand,
    NORTH:  northHand,
    EAST:   eastHand,   
  });

  const initHands = () => {

    // NEW PLIS
    setSouthPlis([]);
    setWestPlis([]);
    setNorthPlis([]);
    setEastPlis([]);

    // NEW SCORE
    setSouthScore(0);
    setWestScore(0);
    setNorthScore(0);
    setEastScore(0);

    // NEW DECK
    setNewDeck(shuffle(cards));
    // console.log(". initHands() // newDeck :", newDeck);

    update(ref(database, 'game/current/'), {
      endOfContract: true,
      nbClic: 0,
    });

    // hasToPlay: getPlaceByUid(contractor),
    // console.log(". initHands() // update Current");

    // SEND Hands
    set(ref(database, 'game/hands/'), {
      SOUTH:  newDeck.slice(0, 8),
      WEST:   newDeck.slice(8, 16),
      NORTH:  newDeck.slice(16, 24),
      EAST:   newDeck.slice(24, 32), 
    });

    // console.log(". initHands() // set Hands");
  }

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
        // console.log("BOARDGAME // CleanBoard() - Done");
      }, 1500);
    }
  }

  const hasColorAsked = (place) => {

    let list = [];

    switch(place) {
      case "SOUTH":
        list = southHand; break;
      case "WEST": 
        list = westHand; break;
      case "NORTH": 
        list = northHand; break;
      case "EAST": 
        list = eastHand; break;
      default: break;
    }

    for(let i=0; i<list.length; i++) {
      if(list[i].charAt(1) === colorAsked) return true;
    }
    return false;
  }

  const handlePlis = () => {

    if(!contractsDone.includes("Plis")) {

      contractsDone.push("Plis");
      setContractsDone(contractsDone);
      setNbContractsDone(contractsDone.length);

      setSouthScore(southPlis.length * -5);
      setWestScore(westPlis.length * -5);
      setNorthScore(northPlis.length * -5);
      setEastScore(eastPlis.length * -5);
  
      console.log("2.2 BOARDGAME // handlePlis() - southScore : ", southScore);
      console.log("2.2 BOARDGAME // handlePlis() - westScore : ", westScore);
      console.log("2.2 BOARDGAME // handlePlis() - northScore : ", northScore);
      console.log("2.2 BOARDGAME // handlePlis() - eastScore : ", eastScore);
  
      // UPDATE GLOBAL
      setSouthGlobalScore(southGlobalScore + (southPlis.length * -5));
      setWestGlobalScore(westGlobalScore + (westPlis.length * -5));
      setNorthGlobalScore(northGlobalScore + (northPlis.length * -5));
      setEastGlobalScore(eastGlobalScore + (eastPlis.length * -5));

      console.log("2.2 BOARDGAME // handlePlis() - southGlobalScore : ", southGlobalScore);
      console.log("2.2 BOARDGAME // handlePlis() - westGlobalScore : ", westGlobalScore);
      console.log("2.2 BOARDGAME // handlePlis() - northGlobalScore : ", northGlobalScore);
      console.log("2.2 BOARDGAME // handlePlis() - eastGlobalScore : ", eastGlobalScore);
    }
  }

  const handleDP = (player) => {

    if(!contractsDone.includes("Dernier Pli")) {
      console.log("2.3 BOARDGAME // handleDP - Dernier Pli pour ", player);

      contractsDone.push("Dernier Pli");
      setContractsDone(contractsDone);
      setNbContractsDone(contractsDone.length);
      
      // UPDATE GLOBAL
      switch(player) {
        case "SOUTH" : 
          setSouthScore(-25); console.log("2.3 BOARDGAME // handleDP() - southScore : ", southScore);
          setSouthGlobalScore(southGlobalScore - 25); console.log("2.3 BOARDGAME // handleDP() - southGlobalScore : ", southGlobalScore);
          break;
        case "WEST"  : 
          setWestScore(-25); console.log("2.3 BOARDGAME // handleDP() - westScore : ", westScore);
          setWestGlobalScore(westGlobalScore - 25); console.log("2.3 BOARDGAME // handleDP() - westGlobalScore : ", westGlobalScore);
          break;
        case "NORTH" : 
          setNorthScore(-25); console.log("2.3 BOARDGAME // handleDP() - northScore : ", northScore);
          setNorthGlobalScore(northGlobalScore - 25); console.log("2.3 BOARDGAME // handleDP() - northGlobalScore : ", northGlobalScore);
          break;
        case "EAST"  : 
          setEastScore(-25); console.log("2.3 BOARDGAME // handleDP() - eastScore : ", eastScore);
          setEastGlobalScore(eastGlobalScore - 25); console.log("2.3 BOARDGAME // handleDP() - eastGlobalScore : ", eastGlobalScore);
          break;
        default : break;
      }

    }
  }

  const handleContract = (p, c) => {

    if((nbClic === 31) && (southPlis.length + westPlis.length + northPlis.length + eastPlis.length) === 8) {
      
      switch(c) {
        case "Coeurs"      : handleHearts(); break;
        case "Dames"       : handleQueens(); break;
        case "Plis"        : handlePlis();   break;
        case "Dernier Pli" : handleDP(p);    break;
          default : break;
      }

      console.log("2.2 BOARDGAME // handleContract() - contractsDone : ", contractsDone);
      console.log("2.2 BOARDGAME // handleContract() - NbContractsDone : ", nbContractsDone);

      console.log("2.2 BOARDGAME // handleContract() - southPlis : ", southPlis);
      console.log("2.2 BOARDGAME // handleContract() - westPlis : ", westPlis);
      console.log("2.2 BOARDGAME // handleContract() - northPlis : ", northPlis);
      console.log("2.2 BOARDGAME // handleContract() - eastPlis : ", eastPlis);

      // RECORD GLOBAL ON BASE.
      recordScore();

      update(ref(database, 'game/current/'), { 
        hasToPlay: getPlaceByUid(contractor), 
      });

      return getPlaceByUid(contractor);
    }
    return p;
  }

  const presenceIn = (temp) => {

    for (let i = 0; i < southPlis.length; i++) {
      if(southPlis[i].includes(temp)) {
        console.log("2.2 BOARDGAME // RecordBoard() - ", temp," IS IN SOUTH");
        return true;
      }
    }
    for (let i = 0; i < westPlis.length; i++) {
      if(westPlis[i].includes(temp)) {
        console.log("2.2 BOARDGAME // RecordBoard() - ", temp," IS IN WEST");
        return true;
      }
    }
    for (let i = 0; i < northPlis.length; i++) {
      if(northPlis[i].includes(temp)) {
        console.log("2.2 BOARDGAME // RecordBoard() - ", temp," IS IN NORTH");
        return true;
      }
    }
    for (let i = 0; i < eastPlis.length; i++) {
      if(eastPlis[i].includes(temp)) {
        console.log("2.2 BOARDGAME // RecordBoard() - ", temp," IS IN EAST");
        return true;
      }
    }
    return false;
  }

  const recordScore = () => {
      // UPDATE PLAYER1 SCORE
      update(ref(database, 'game/players/n3gYoJQyeHhCKzr3WGFybc8nIdb2'), {
        score: southGlobalScore,
      });
      // UPDATE PLAYER2 SCORE
      update(ref(database, 'game/players/n3gYoJQyeHhCKzr3WGFybc8nIdb3'), {
        score: westGlobalScore,
      });
      // UPDATE PLAYER3 SCORE
      update(ref(database, 'game/players/n3gYoJQyeHhCKzr3WGFybc8nIdb4'), {
        score: northGlobalScore,
      });
      // UPDATE PLAYER4 SCORE
      update(ref(database, 'game/players/n3gYoJQyeHhCKzr3WGFybc8nIdb5'), {
        score: eastGlobalScore,
      });
      
    console.log(" -____________________________________________-> RECORD SCORES");
  }

  const recordBoard = (place, board) => {

    if(place === "") return;

    console.log("recordBoard _--------------------------------------------_");
    console.log("2.2 BOARDGAME // RecordBoard = ", board, " - place = ", place);

    let tempoPli = [];

    for(let i=0; i<board.length; i++) {
      tempoPli.push(board[i].value);
    }

    if(!presenceIn(tempoPli[0])) {

      switch(place) {
        case "SOUTH" : 
          southPlis.push(tempoPli);
          break;

        case "WEST" : 
          westPlis.push(tempoPli);
          break;

        case "NORTH" : 
          northPlis.push(tempoPli);
          break;

        case "EAST" : 
          eastPlis.push(tempoPli);
          break;
        
        default : break;
      }
    }

    console.log("recordBoard -__________________________________________-");
  }

  const whoIsTheMaster = (daBoard) => {

    if(daBoard.length === 4 && colorAsked !== "") {

      let masterKey = 0;
      let tempoMaster = [];
      let masterPlace = "";

      for(let j=0; j<daBoard.length; j++) {
        if(daBoard[j].value.charAt(1) === colorAsked) {
          tempoMaster.push(daBoard[j]);
        }
      }
      if(tempoMaster.length>0) masterPlace = tempoMaster[masterKey].place;
      // console.log("2.1 BOARDGAME // whoIsTheMaster() - Board = ", daBoard, " - masterPlace = ", masterPlace);

      for(let i=1; i<tempoMaster.length; i++) {
        if(cardValues.indexOf(tempoMaster[i].value.charAt(0)) > cardValues.indexOf(tempoMaster[masterKey].value.charAt(0))) {
          // console.log("cardValues.indexOf(tempoMaster[i].value.charAt(0))", cardValues.indexOf(tempoMaster[i].value.charAt(0)), " > ", cardValues.indexOf(tempoMaster[masterKey].value.charAt(0)) ,"cardValues.indexOf(tempoMaster[masterKey].value.charAt(0))");
          masterKey = i;
          masterPlace = tempoMaster[masterKey].place;
        }
      }
      setMaster(masterPlace);
      update(ref(database, 'game/current/'), { 
        hasToPlay: masterPlace, 
      });

      // RECORD EACH PLI FOR EACH PLAYER.
      recordBoard(masterPlace, daBoard);

      // CHECK EVOLUTION OF CONTRACT.
      masterPlace = handleContract(masterPlace, contract);

      console.log("2.1 BOARDGAME // whoIsTheMaster() = ", masterPlace);
      
      return(masterPlace);
    }
  }

  const onClickBoard = async (click) => {
    console.log("1. BOARDGAME // onClickBoard(", click,") // board", board);
    board.length === 0 ? setColorAsked(click[1].charAt(1)) : null;

    // CHECK IF PLAYER HAS TO PLAY.
    if(click[0] !== hasToPlay) { 
      alert(hasToPlay+" has to play !"); 
      return; 
    }

    // CHECK IF CARD IS THE GOOD ONE.
    if(board.length > 0 && (click[1].charAt(1) !== colorAsked)) {
      if(hasColorAsked(click[0])) {
        alert("Wrong Color !");
        return;
      }
    }

    // Save clicked card in Database table "Board".
    console.log("2. BOARDGAME // ", click[0]," ADDED ", click[1]," TO BOARD.");
    await set(ref(database, 'game/board/'+click[0]), {
      value: click[1],
      place: click[0],
    });
        
    console.log("3. BOARDGAME // BOARD (", board.length ,") // switch() from ", hasToPlay);
    if(board.length < 3) {
      switch(hasToPlay) {
        case "SOUTH": 
        update(ref(database, 'game/current/'), { 
          hasToPlay: "WEST" 
        }); break;
      case "WEST":  
        update(ref(database, 'game/current/'), { 
          hasToPlay: "NORTH" 
        }); break;
      case "NORTH":  
        update(ref(database, 'game/current/'), { 
          hasToPlay: "EAST" 
        }); break;
      case "EAST":
        update(ref(database, 'game/current/'), { 
          hasToPlay: "SOUTH" 
        }); break;
      default: break;
      }
    }

    // Remove from HANDS in Database table "Hands".
    // TODO PROD : ONLY "SOUTH" updating with uid.
    console.log("4. BOARDGAME // SPLICE // UPDATE HANDS");
    switch(click[0]) {
      case "SOUTH":
        setSouthHand(southHand.splice(southHand.indexOf(click[1]), 1));
        update(ref(database, 'game/hands/'), {
          SOUTH: southHand,
          }); break;
      case "WEST":
        setWestHand(westHand.splice(westHand.indexOf(click[1]), 1));  
        update(ref(database, 'game/hands/'), {
          WEST: westHand,
          }); break;
      case "NORTH":
        setNorthHand(northHand.splice(northHand.indexOf(click[1]), 1)); 
        update(ref(database, 'game/hands/'), {
          NORTH: northHand,
          }); break;
      case "EAST":
        setEastHand(eastHand.splice(eastHand.indexOf(click[1]), 1));
        update(ref(database, 'game/hands/'), {
          EAST: eastHand,
          }); break;

      default: break;
    }

    // HANDLE CHOOSEN CONTRACT.
    console.log("5. BOARDGAME // CONTRACT // HANDLE CHOOSEN");

    // UPDATE NB CLIC INCREMENT.
    update(ref(database, 'game/current/'), { 
      nbClic: nbClic+1 
    });

    // MAYBE CHECK ON TEMPO PLI SIZE
    // CHECK HANDS SIZES TO KNOW IF END OF CONTRACT
    if(nbClic === 31) {
      console.log("6. BOARDGAME // END OF CONTRACT ||");
      alert('6. BOARDGAME // END OF CONTRACT ||');

      initHands();
    }
    
  }

  useEffect(() => {
    // TODO Prod change place to UID.
    onValue(
      ref(database, 'game/contractor/uid' ), (snapshot) => {
        setContractor(snapshot.val());
      }
    );

    onValue(
      ref(database, 'game/current/hasToPlay' ), (snapshot) => {
          setHasToPlay(snapshot.val());
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
        if(theBoard.length === 4) {
          setHasToPlay(whoIsTheMaster(theBoard));
          cleanBoard(theBoard);
        }
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
      ref(database, 'game/current/endOfContract' ), (snapshot) => {
          setEndOfContract(snapshot.val());
      }
    );

  }, [hasToPlay]);

  console.log("BOARDGAME _--------------------_");
  console.log("BOARDGAME // myRank = ", myRank);
  console.log("BOARDGAME // board = ", board.length);
  console.log("BOARDGAME // master = ", master);
  console.log("BOARDGAME // nbClic = ", nbClic);
  console.log("BOARDGAME // contract = ", contract);
  console.log("BOARDGAME // hasToPlay = ", hasToPlay);
  console.log("BOARDGAME // colorAsked = ", colorAsked);
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
