/* eslint-disable react-hooks/exhaustive-deps */
import { onValue, ref, remove, set, update } from 'firebase/database';
import { useAuthContext } from '@/context/AuthContext';
import React, { useEffect, useState } from 'react';
import { database } from '@/firebase/config';

import LoadCard from '/public/images/loadCard.png';
import ContractName from './ContractName';
import BoardDomino from './BoardDomino';
import PlayerBox from './PlayerBox';
import Image from 'next/image';
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

const BoardGame = (props) => {

  const { user } = useAuthContext();

  // props.persoRank
  // props.playaz
  // props.ami

  const [myRank, setMyRank] = useState(props.rank);
  const [players, setPlayers] = useState(props.playerz);
  const [amIContractor, setAmIContractor] = useState(props.rank === 1);

  const [newDeck, setNewDeck] = useState([]);
  // const [newDeck, setNewDeck] = useState(shuffle(cards));

  // const [eastHand,  setEastHand]  = useState(newDeck.slice(24, 32));
  // const [northHand, setNorthHand] = useState(newDeck.slice(16, 24));
  // const [westHand,  setWestHand]  = useState(newDeck.slice(8, 16));
  // const [southHand, setSouthHand] = useState(newDeck.slice(0, 8));

  const [hand1, setHand1] = useState([]);
  const [hand2, setHand2] = useState([]);
  const [hand3, setHand3] = useState([]);
  const [hand4, setHand4] = useState([]);

  const [handSpides,   setHandSpides]   = useState([]);
  const [handHearts,   setHandHearts]   = useState([]);
  const [handCloves,   setHandCloves]   = useState([]);
  const [handDiamonds, setHandDiamonds] = useState([]);

  const [southPlis, setSouthPlis] = useState([]);
  const [westPlis,  setWestPlis]  = useState([]);
  const [northPlis, setNorthPlis] = useState([]);
  const [eastPlis,  setEastPlis]  = useState([]);

  let [southScore, setSouthScore] = useState(0);
  let [westScore,  setWestScore]  = useState(0);
  let [northScore, setNorthScore] = useState(0);
  let [eastScore,  setEastScore]  = useState(0);

  let [southGlobalScore, setSouthGlobalScore] = useState(0);
  let [westGlobalScore,  setWestGlobalScore]  = useState(0);
  let [northGlobalScore, setNorthGlobalScore] = useState(0);
  let [eastGlobalScore,  setEastGlobalScore]  = useState(0);

  const [board, setBoard] = useState([]);

  const [contract, setContract] = useState("");
  const [contractor, setContractor] = useState("");

  const [dominoDone, setDominoDone] = useState([]);
  const [displayLoading, setDisplayLoading] = useState(false);

  const [hasToPlay, setHasToPlay] = useState("");
  const [colorAsked, setColorAsked] = useState("");

  const [master, setMaster] = useState("");
  let [nbClic, setNbClic] = useState(0);

  let [contractsDone, setContractsDone] = useState([]);
  let [nbContractsDone, setNbContractsDone] = useState(0); // Max is 28.
  const [playersDone, setPlayersDone] = useState([]); // Max length is 4.

  const [endOfContract, setEndOfContract] = useState(false);
  const [endOfSeven,    setEndOfSeven] = useState(false);
  const [endOfGame,     setEndOfGame] = useState(false);

  // INIT Hands
  // set(ref(database, 'game/hands/'), {
  //   SOUTH:  southHand,
  //   WEST:   westHand,
  //   NORTH:  northHand,
  //   EAST:   eastHand,   
  // });



  const initHands = () => {
    console.log("BOARDGAME //", user.displayName," déclenche initHands();");

    // ORDER WHY NOT IN WELCOME ?
    // setPlayers(orderPlayers(props.playaz));

    // NEW PLIS
    setSouthPlis([]);
    setWestPlis([]);
    setNorthPlis([]);
    setEastPlis([]);

    // NEW DOM HANDS
    setHandSpides([]);
    setHandHearts([]);
    setHandCloves([]);
    setHandDiamonds([]);

    // NEW SCORE
    setSouthScore(0);
    setWestScore(0);
    setNorthScore(0);
    setEastScore(0);

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
      hasToPlay: user.uid,
      nbClic: 0,
    });

    // TODO : Switch to UIDs
    // 'game/players/'+players[1].uid+'/hand'
    // SEND Hands (cannot read uid undefined)
    update(ref(database, 'game/players/'+players[0].uid), {
      hand:  newDeck.slice(0, 8),
    });
    update(ref(database, 'game/players/'+players[1].uid), {
      hand:  newDeck.slice(8, 16),
    });
    update(ref(database, 'game/players/'+players[2].uid), {
      hand:  newDeck.slice(16, 24),
    });
    update(ref(database, 'game/players/'+players[3].uid), {
      hand:  newDeck.slice(24, 32),
    });

    // set(ref(database, 'game/hands/'), {
    //   SOUTH:  newDeck.slice(0, 8),
    //   WEST:   newDeck.slice(8, 16),
    //   NORTH:  newDeck.slice(16, 24),
    //   EAST:   newDeck.slice(24, 32),
    // });

    if(endOfSeven) setEndOfSeven(false);
  }

  const orderPlayers = (playz) => {
    console.log("BOARDGAME // orderPlayers()");

    let goodPlayz = [];

    for (let i=1; i<5; i++) {
      for (let j=0; j<playz.length; j++) {

        if(playz[j].rank === i) {
          players.push(playz[j]);
        }
      }
    }

    //return goodPlayz;
  }

  const sortPlayz = (playerz) => {

    let nb=1;
    let playaz = [];

    while(playaz.length !== 4) {
      for(let i=0; i<playerz.length; i++) {

        if(playerz[i].uid === user.uid) setMyRank(playerz[i].rank);
        
        if(playerz[i].rank === nb) {
          playaz.push(playerz[i]);
          nb++; break;
        }
      }
    }
    return playaz;

  }

  const sortHand = (hand) => {

    if(!hand) return [];

    let old_hand = hand;
    let new_hand = [];
    let colors = ['s', 'h', 'c', 'd'];
    let colored_hand = [];
    let iColor = 0;
    
    // sort values
    while(old_hand.length > 0) {
      
      let bigger = 0;
      for (let i=1; i < old_hand.length; i++) {
        if(cardValues.indexOf(old_hand[i].charAt(0)) > cardValues.indexOf(old_hand[bigger].charAt(0))) {
          bigger = i;
        }
      }

      new_hand.push(old_hand[bigger]);
      old_hand.splice(bigger, 1);
    }

    while(iColor < 4) {
      for (let j = 0; j < new_hand.length; j++) {
        if(new_hand[j].charAt(1) === colors[iColor]) {
          colored_hand.push(new_hand[j]);
        }
      }
      iColor++;
    }

    return colored_hand;
  }

  const getHandByRank = (cardinal) => {

    switch(myRank) {

      case 1 : 
        switch(cardinal) {
          case "SOUTH"  : return hand1;
          case "WEST"   : return hand2;
          case "NORTH"  : return hand3;
          case "EAST"   : return hand4;
          default : break;
        }

      case 2 : 
        switch(cardinal) {
          case "SOUTH"  : return hand2;
          case "WEST"   : return hand3;
          case "NORTH"  : return hand4;
          case "EAST"   : return hand1;
          default : break;
        }

      case 3 :
        switch(cardinal) {
          case "SOUTH"  : return hand3;
          case "WEST"   : return hand4;
          case "NORTH"  : return hand1;
          case "EAST"   : return hand2;
          default : break;
        }

      case 4 :
        switch(cardinal) {
          case "SOUTH"  : return hand4;
          case "WEST"   : return hand1;
          case "NORTH"  : return hand2;
          case "EAST"   : return hand3;
          default : break;
        }

      default : break;
    }

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

  const getRata = () => {

         if (southPlis.length === 8) {southScore = 185; return true;}
    else if (westPlis.length  === 8) {westScore = 185;  return true;}
    else if (northPlis.length === 8) {northScore = 185; return true;}
    else if (eastPlis.length  === 8) {eastScore = 185;  return true;}
    else return false;

  }

  const getBarbu = (plis) => {
    
    for (let i = 0; i < plis.length; i++) {
      if(plis[i].includes('kh')) return -40;
    }

    return 0;
  }

  const getNbHearts = (plis) => {
    let number = 0;

    for (let i = 0; i < plis.length; i++) {
      for (let j = 0; j < plis[i].length; j++) {
        if(plis[i][j].charAt(1) === 'h') number++;
      }
    }

    if(number === 8) return -8;

    return number;
  }

  const getNbQueens = (plis) => {
    let number = 0;

    for (let i = 0; i < plis.length; i++) {
      for (let j = 0; j < plis[i].length; j++) {
        if(plis[i][j].charAt(0) === 'q') number++;
      }
    }

    if(number === 4) return -4;

    return number;
  }

  const getDomScore = (index) => {

    switch(index) {
      case 0 : return 50;
      case 1 : return 25;
      case 2 : return 0;
      //case 3 : return -25;
      default: break;
    }
  }

  // TO DO : Replace by real IDs
  const getNextPlayer = (place) => {

    switch(place) {
      case "SOUTH" : return "WEST";
      case "WEST"  : return "NORTH";
      case "NORTH" : return "EAST";
      case "EAST"  : return "SOUTH";
        default : break;
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

  const cleanContracts = () => {
    console.log("8. checkEndOf7() // cleanContracts()")

    update(ref(database, 'game/contracts/'), {
      barbu: false,
      coeurs: false,
      dames: false,
      domino: false,
      dp: false,
      plis: false,
      rata: false,
    });

    setContractsDone([]);
    setEndOfSeven(false);
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

  const handleRata = (player) => {

    if(!contractsDone.includes("RATA")) {
      console.log("2.2 BOARDGAME // handleRata()");

      if(!getRata()) {

        // 1. Handle Barbu
        southScore = getBarbu(southPlis);
        westScore  = getBarbu(westPlis);
        northScore = getBarbu(northPlis);
        eastScore  = getBarbu(eastPlis);

        // 2. Handle Dames
        southScore += getNbQueens(southPlis) * -10;
        westScore  += getNbQueens(westPlis)  * -10;
        northScore += getNbQueens(northPlis) * -10;
        eastScore  += getNbQueens(eastPlis)  * -10;

        // 3. Handle Coeurs
        southScore += getNbHearts(southPlis) * -5;
        westScore  += getNbHearts(westPlis)  * -5;
        northScore += getNbHearts(northPlis) * -5;
        eastScore  += getNbHearts(eastPlis)  * -5;

        // 4. Handle Plis
        southScore += southPlis.length * -5;
        westScore  += westPlis.length  * -5;
        northScore += northPlis.length * -5;
        eastScore  += eastPlis.length  * -5;

        // 5. Handle DP
        switch(player) {
          case "SOUTH" : southScore += -25; break;
          case "WEST"  : westScore  += -25; break;
          case "NORTH" : northScore += -25; break;
          case "EAST"  : eastScore  += -25; break;
          default : break;
        }
      }

      console.log("2.2 BOARDGAME // handleRata() - southScore : ", southScore);
      console.log("2.2 BOARDGAME // handleRata() - westScore : ", westScore);
      console.log("2.2 BOARDGAME // handleRata() - northScore : ", northScore);
      console.log("2.2 BOARDGAME // handleRata() - eastScore : ", eastScore);
  
      // UPDATE GLOBAL
      southGlobalScore += southScore; // setSouthGlobalScore(southGlobalScore);
      westGlobalScore += westScore;   // setWestGlobalScore(westGlobalScore);
      northGlobalScore += northScore; // setNorthGlobalScore(northGlobalScore);
      eastGlobalScore += eastScore;   // setEastGlobalScore(eastGlobalScore);

      console.log("2.2 BOARDGAME // handleRata() - southGlobalScore : ", southGlobalScore);
      console.log("2.2 BOARDGAME // handleRata() - westGlobalScore : ", westGlobalScore);
      console.log("2.2 BOARDGAME // handleRata() - northGlobalScore : ", northGlobalScore);
      console.log("2.2 BOARDGAME // handleRata() - eastGlobalScore : ", eastGlobalScore);

      // RECORD CONTRACT ON BASE.
      recordContract(contracts[0]);
    }
  }

  const handleBarbu = () => {

    if(!contractsDone.includes("Barbu")) {
      console.log("2.2 BOARDGAME // handleBarbu()");

      southScore = getBarbu(southPlis);
      westScore  = getBarbu(westPlis);
      northScore = getBarbu(northPlis);
      eastScore  = getBarbu(eastPlis);

      console.log("2.2 BOARDGAME // handleBarbu() - southScore : ", southScore);
      console.log("2.2 BOARDGAME // handleBarbu() - westScore : ", westScore);
      console.log("2.2 BOARDGAME // handleBarbu() - northScore : ", northScore);
      console.log("2.2 BOARDGAME // handleBarbu() - eastScore : ", eastScore);
  
      // UPDATE GLOBAL
      southGlobalScore += southScore; setSouthGlobalScore(southGlobalScore);
      westGlobalScore += westScore;   setWestGlobalScore(westGlobalScore);
      northGlobalScore += northScore; setNorthGlobalScore(northGlobalScore);
      eastGlobalScore += eastScore;   setEastGlobalScore(eastGlobalScore);

      console.log("2.2 BOARDGAME // handleBarbu() - southGlobalScore : ", southGlobalScore);
      console.log("2.2 BOARDGAME // handleBarbu() - westGlobalScore : ", westGlobalScore);
      console.log("2.2 BOARDGAME // handleBarbu() - northGlobalScore : ", northGlobalScore);
      console.log("2.2 BOARDGAME // handleBarbu() - eastGlobalScore : ", eastGlobalScore);

      // RECORD CONTRACT ON BASE.
      recordContract(contracts[1]);

      console.log("6. BOARDGAME // END OF CONTRACT ||");
      alert('6. BOARDGAME // END OF CONTRACT || ');

      setTimeout(() => {
        initHands();
      }, 1000);
    }
  }

  const handleDomino = () => {
    console.log("2.2 BOARDGAME // handleDomino()");

    if(!contractsDone.includes("Domino")) {

      if(!dominoDone.includes("SOUTH")) southScore += -25;
      if(!dominoDone.includes("WEST"))  westScore  += -25;
      if(!dominoDone.includes("NORTH")) northScore += -25;
      if(!dominoDone.includes("EAST"))  eastScore  += -25;

      for (let i = 0; i < dominoDone.length; i++) {

        switch(dominoDone[i]) {
          case "SOUTH" : southScore += getDomScore(i); break;
          case "WEST"  : westScore  += getDomScore(i); break;
          case "NORTH" : northScore += getDomScore(i); break;
          case "EAST"  : eastScore  += getDomScore(i); break;
               default :  break;
        }
        
      }

      console.log("2.2 BOARDGAME // handleDomino() - southScore : ", southScore);
      console.log("2.2 BOARDGAME // handleDomino() - westScore : ", westScore);
      console.log("2.2 BOARDGAME // handleDomino() - northScore : ", northScore);
      console.log("2.2 BOARDGAME // handleDomino() - eastScore : ", eastScore);
  
      // UPDATE GLOBAL
      southGlobalScore += southScore; setSouthGlobalScore(southGlobalScore);
      westGlobalScore += westScore;   setWestGlobalScore(westGlobalScore);
      northGlobalScore += northScore; setNorthGlobalScore(northGlobalScore);
      eastGlobalScore += eastScore;   setEastGlobalScore(eastGlobalScore);

      console.log("2.2 BOARDGAME // handleDomino() - southGlobalScore : ", southGlobalScore);
      console.log("2.2 BOARDGAME // handleDomino() - westGlobalScore : ", westGlobalScore);
      console.log("2.2 BOARDGAME // handleDomino() - northGlobalScore : ", northGlobalScore);
      console.log("2.2 BOARDGAME // handleDomino() - eastGlobalScore : ", eastGlobalScore);

      // RECORD CONTRACT ON BASE.
      recordContract(contracts[2]);

      // INIT Hands Domino
      update(ref(database, 'game/boardDomino/'), {
        SPIDES:   [],
        HEARTS:   [],
        CLOVES:   [],
        DIAMONDS: [],   
      });

      update(ref(database, 'game/current/'), { 
        hasToPlay: getPlaceByUid(contractor), 
      });
    }
  }

  const handleHearts = () => {
    console.log("2.2 BOARDGAME // handleHearts()");

    if(!contractsDone.includes("Coeurs")) {

      southScore = getNbHearts(southPlis) * -5;
      westScore  = getNbHearts(westPlis) * -5;
      northScore = getNbHearts(northPlis) * -5;
      eastScore  = getNbHearts(eastPlis) * -5;

      console.log("2.2 BOARDGAME // handleHearts() - southScore : ", southScore);
      console.log("2.2 BOARDGAME // handleHearts() - westScore : ", westScore);
      console.log("2.2 BOARDGAME // handleHearts() - northScore : ", northScore);
      console.log("2.2 BOARDGAME // handleHearts() - eastScore : ", eastScore);
  
      // UPDATE GLOBAL
      southGlobalScore += southScore; setSouthGlobalScore(southGlobalScore);
      westGlobalScore += westScore;   setWestGlobalScore(westGlobalScore);
      northGlobalScore += northScore; setNorthGlobalScore(northGlobalScore);
      eastGlobalScore += eastScore;   setEastGlobalScore(eastGlobalScore);

      console.log("2.2 BOARDGAME // handleHearts() - southGlobalScore : ", southGlobalScore);
      console.log("2.2 BOARDGAME // handleHearts() - westGlobalScore : ", westGlobalScore);
      console.log("2.2 BOARDGAME // handleHearts() - northGlobalScore : ", northGlobalScore);
      console.log("2.2 BOARDGAME // handleHearts() - eastGlobalScore : ", eastGlobalScore);

      // RECORD CONTRACT ON BASE.
      recordContract(contracts[3]);

      console.log("6. BOARDGAME // END OF CONTRACT ||");
      alert('6. BOARDGAME // END OF CONTRACT || ');

      setTimeout(() => {
        initHands();
      }, 1000);
    }
  }

  const handleQueens = () => {
    console.log("2.2 BOARDGAME // handleQueens()");

    if(!contractsDone.includes("Dames")) {

      southScore = getNbQueens(southPlis) * -10;
      westScore  = getNbQueens(westPlis) * -10;
      northScore = getNbQueens(northPlis) * -10;
      eastScore  = getNbQueens(eastPlis) * -10;

      console.log("2.2 BOARDGAME // handleQueens() - southScore : ", southScore);
      console.log("2.2 BOARDGAME // handleQueens() - westScore : ", westScore);
      console.log("2.2 BOARDGAME // handleQueens() - northScore : ", northScore);
      console.log("2.2 BOARDGAME // handleQueens() - eastScore : ", eastScore);
  
      // UPDATE GLOBAL
      southGlobalScore += southScore; setSouthGlobalScore(southGlobalScore);
      westGlobalScore += westScore;   setWestGlobalScore(westGlobalScore);
      northGlobalScore += northScore; setNorthGlobalScore(northGlobalScore);
      eastGlobalScore += eastScore;   setEastGlobalScore(eastGlobalScore);

      console.log("2.2 BOARDGAME // handleQueens() - southGlobalScore : ", southGlobalScore);
      console.log("2.2 BOARDGAME // handleQueens() - westGlobalScore : ", westGlobalScore);
      console.log("2.2 BOARDGAME // handleQueens() - northGlobalScore : ", northGlobalScore);
      console.log("2.2 BOARDGAME // handleQueens() - eastGlobalScore : ", eastGlobalScore);

      // RECORD CONTRACT ON BASE.
      recordContract(contracts[4]);

      console.log("6. BOARDGAME // END OF CONTRACT ||");
      alert('6. BOARDGAME // END OF CONTRACT || ');

      setTimeout(() => {
        initHands();
      }, 1000);
    }
  }

  const handlePlis = () => {
    console.log("2.2 BOARDGAME // handlePlis()");

    if(!contractsDone.includes("Plis")) {

      southScore = southPlis.length * -5;
      westScore  = westPlis.length * -5;
      northScore = northPlis.length * -5;
      eastScore  = eastPlis.length * -5;
  
      console.log("2.2 BOARDGAME // handlePlis() - southScore : ", southScore);
      console.log("2.2 BOARDGAME // handlePlis() - westScore : ", westScore);
      console.log("2.2 BOARDGAME // handlePlis() - northScore : ", northScore);
      console.log("2.2 BOARDGAME // handlePlis() - eastScore : ", eastScore);
  
      // UPDATE GLOBAL
      southGlobalScore += southScore; // setSouthGlobalScore(southGlobalScore);
      westGlobalScore += westScore;   // setWestGlobalScore(westGlobalScore);
      northGlobalScore += northScore; // setNorthGlobalScore(northGlobalScore);
      eastGlobalScore += eastScore;   // setEastGlobalScore(eastGlobalScore);

      console.log("2.2 BOARDGAME // handlePlis() - southGlobalScore : ", southGlobalScore);
      console.log("2.2 BOARDGAME // handlePlis() - westGlobalScore : ", westGlobalScore);
      console.log("2.2 BOARDGAME // handlePlis() - northGlobalScore : ", northGlobalScore);
      console.log("2.2 BOARDGAME // handlePlis() - eastGlobalScore : ", eastGlobalScore);

      // RECORD CONTRACT ON BASE.
      recordContract(contracts[5]);
    }
  }

  const handleDP = (player) => {

    if(!contractsDone.includes("Dernier Pli")) {
      console.log("2.3 BOARDGAME // handleDP - Dernier Pli pour ", player);

      // UPDATE GLOBAL
      switch(player) {
        case "SOUTH" : 
          southScore = -25; console.log("2.3 BOARDGAME // handleDP() - southScore : ", southScore);
          southGlobalScore += southScore; //setSouthGlobalScore(southGlobalScore);
          console.log("2.3 BOARDGAME // handleDP() - southGlobalScore : ", southGlobalScore);
          break;
        case "WEST"  : 
          westScore = -25; console.log("2.3 BOARDGAME // handleDP() - westScore : ", westScore);
          westGlobalScore += westScore; //setWestGlobalScore(westGlobalScore);
          console.log("2.3 BOARDGAME // handleDP() - westGlobalScore : ", westGlobalScore);
          break;
        case "NORTH" : 
          northScore = -25; console.log("2.3 BOARDGAME // handleDP() - northScore : ", northScore);
          northGlobalScore += northScore; //setNorthGlobalScore(northGlobalScore);
          console.log("2.3 BOARDGAME // handleDP() - northGlobalScore : ", northGlobalScore);
          break;
        case "EAST"  : 
          eastScore = -25; console.log("2.3 BOARDGAME // handleDP() - eastScore : ", eastScore);
          eastGlobalScore += eastScore; //setEastGlobalScore(eastGlobalScore);
          console.log("2.3 BOARDGAME // handleDP() - eastGlobalScore : ", eastGlobalScore);
          break;
        default : break;
      }

      // RECORD CONTRACT ON BASE.
      recordContract(contracts[6]);
    }
  }

  const handleContract = (p, c) => {

    let allPlis = southPlis.length + westPlis.length + northPlis.length + eastPlis.length;
    console.log("2.2 BOARDGAME // handleContract() - place : ", p);
    console.log("2.2 BOARDGAME // handleContract() - contract : ", c);
    console.log("2.2 BOARDGAME // handleContract() - allPlis : ", allPlis);

    if(   (nbClic === 31  && allPlis === 8)
      ||  (c === "Barbu"  && presenceIn('kh')) 
      ||  (c === "Coeurs" && presenceIn('ah') && presenceIn('kh') && presenceIn('qh') && presenceIn('jh') && presenceIn('th') && presenceIn('9h') && presenceIn('8h') && presenceIn('7h'))
      ||  (c === "Dames"  && presenceIn('qs') && presenceIn('qh') && presenceIn('qc') && presenceIn('qd')) ) {
      
      switch(c) {
        case "RATA"        : handleRata(p);   break;
        case "Barbu"       : handleBarbu();  break;
        case "Coeurs"      : handleHearts(); break;
        case "Dames"       : handleQueens(); break;
        case "Plis"        : handlePlis();   break;
        case "Dernier Pli" : handleDP(p);    break;
          default : break;
      }

      console.log("2.2 BOARDGAME // handleContract() - contractsDone : ", contractsDone);
      console.log("2.2 BOARDGAME // handleContract() - southPlis : ", southPlis);
      console.log("2.2 BOARDGAME // handleContract() - westPlis : ", westPlis);
      console.log("2.2 BOARDGAME // handleContract() - northPlis : ", northPlis);
      console.log("2.2 BOARDGAME // handleContract() - eastPlis : ", eastPlis);

      update(ref(database, 'game/current/'), { 
        hasToPlay: getPlaceByUid(contractor), 
      });

      return getPlaceByUid(contractor);
    }
    return p;
  }

  const checkEndOf7 = () => {
    console.log("7. BOARDGAME // onClickBoard // checkEndOf7() - nb ContractsDone :", contractsDone.length);

    let nextPlayer = "";
    if(contractsDone.length === 7) {

      setEndOfSeven(true);
      playersDone.push(contractor);
      setPlayersDone(playersDone);

      // CLEAN CONTRACTS
      cleanContracts();

      if(playersDone.length === 4) {

        setEndOfGame(true);
        alert("End of whole GAME !");
      } else {
        nextPlayer = getNextPlayer(getPlaceByUid(contractor));
        //setContractor(nextPlayerUID);

        update(ref(database, 'game/current/'), { 
          hasToPlay: nextPlayer,
        });

        // TODO : update contractor in base
      }
    } 

  }

  const presenceIn = (temp) => {

    for (let i = 0; i < southPlis.length; i++) {
      if(southPlis[i].includes(temp)) {
        console.log("2.2 BOARDGAME // presenceIn() - ", temp," IS IN SOUTH");
        return true;
      }
    }
    for (let i = 0; i < westPlis.length; i++) {
      if(westPlis[i].includes(temp)) {
        console.log("2.2 BOARDGAME // presenceIn() - ", temp," IS IN WEST");
        return true;
      }
    }
    for (let i = 0; i < northPlis.length; i++) {
      if(northPlis[i].includes(temp)) {
        console.log("2.2 BOARDGAME // presenceIn() - ", temp," IS IN NORTH");
        return true;
      }
    }
    for (let i = 0; i < eastPlis.length; i++) {
      if(eastPlis[i].includes(temp)) {
        console.log("2.2 BOARDGAME // presenceIn() - ", temp," IS IN EAST");
        return true;
      }
    }
    return false;
  }

  const recordContract = (c) => {
    console.log(" ----------------------------------------------> RECORD CONTRACT & SCORES IN");

    contractsDone.push(c);
    setContractsDone(contractsDone);

    nbContractsDone = contractsDone.length;
    setNbContractsDone(nbContractsDone);

    switch(c) {
      case "RATA" : 
        update(ref(database, 'game/contracts/'), {
          rata: true,
        }); console.log(" Update RATA Done !"); break;
      case "Barbu" : 
        update(ref(database, 'game/contracts/'), {
          barbu: true,
        }); console.log(" Update Barbu Done !"); break;
      case "Domino" : 
        update(ref(database, 'game/contracts/'), {
          domino: true,
        }); console.log(" Update Domino Done !"); break;
      case "Coeurs" : 
        update(ref(database, 'game/contracts/'), {
          coeurs: true,
        }); console.log(" Update Coeurs Done !"); break;
      case "Dames" : 
        update(ref(database, 'game/contracts/'), {
          dames: true,
        }); console.log(" Update Dames Done !"); break;
      case "Plis" : 
        update(ref(database, 'game/contracts/'), {
          plis: true,
        }); console.log(" Update Plis Done !"); break;
      case "Dernier Pli" :
        update(ref(database, 'game/contracts/'), {
          dp: true,
        }); console.log(" Update DernierPli Done !"); break;
        default : break;
    }

    // TODO : Switch to real UIDs
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

    console.log(" ----------------------------------------------> RECORD CONTRACT & SCORES OUT");
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

  const verifyColor = (boarder) => {

    for (let i = 0; i < boarder.length; i++) {
      if(boarder[i].rank === 0) return boarder[i].value.charAt(1);
    }

  }

  const whoIsTheMaster = (daBoard) => {

    let color = verifyColor(daBoard);
    console.log("2.1 BOARDGAME // whoIsTheMaster() // daBoard = ", daBoard, " // color = ", color);

    if(daBoard.length === 4 && color !== "") {

      let masterKey = 0;
      let tempoMaster = [];
      let masterPlace = "";

      for(let j=0; j<daBoard.length; j++) {
        if(daBoard[j].value.charAt(1) === color) {
          tempoMaster.push(daBoard[j]);
        }
      }
      console.log("2.1 BOARDGAME // whoIsTheMaster() // tempoMaster = ", tempoMaster);
      if(tempoMaster.length>0) masterPlace = tempoMaster[masterKey].place;

      for(let i=1; i<tempoMaster.length; i++) {
        if(cardValues.indexOf(tempoMaster[i].value.charAt(0)) > cardValues.indexOf(tempoMaster[masterKey].value.charAt(0))) {
          // console.log("cardValues.indexOf(tempoMaster[i].value.charAt(0))", cardValues.indexOf(tempoMaster[i].value.charAt(0)), " > ", cardValues.indexOf(tempoMaster[masterKey].value.charAt(0)) ,"cardValues.indexOf(tempoMaster[masterKey].value.charAt(0))");
          masterKey = i;
          masterPlace = tempoMaster[masterKey].place;
        }
      }

      if(masterPlace !== "") {

        setMaster(masterPlace);

        update(ref(database, 'game/current/'), { 
          hasToPlay: masterPlace, 
        });

        // RECORD EACH PLI FOR EACH PLAYER.
        recordBoard(masterPlace, daBoard);

        // CHECK EVOLUTION OF CONTRACT.
        masterPlace = handleContract(masterPlace, contract);

        console.log("2.2 BOARDGAME // handleContract() - southPlis : ", southPlis);
        console.log("2.2 BOARDGAME // handleContract() - westPlis : ", westPlis);
        console.log("2.2 BOARDGAME // handleContract() - northPlis : ", northPlis);
        console.log("2.2 BOARDGAME // handleContract() - eastPlis : ", eastPlis);

        console.log("2.1 BOARDGAME // whoIsTheMaster() = ", masterPlace, " // END");
      }

      return(masterPlace);
    }
  }

  const getDomHand = (abbr) => {

    switch(abbr) {
      case 's' : return handSpides;
      case 'h' : return handHearts;
      case 'c' : return handCloves;
      case 'd' : return handDiamonds;
       default : break;
    }
  }

  const isPlayableDominoCard = (card, hand) => {

    console.log("1. BOARDGAME // hand = ", hand);

    switch(card.charAt(0)) {

      case "a" : 
        if(hand.includes('k'+card.charAt(1))) return true
        else return false;

      case "k" : 
        if(hand.includes('q'+card.charAt(1))) return true
        else return false;

      case "q" : 
        if(hand.includes('j'+card.charAt(1))) return true
        else return false;

      case "j" : 
        if(hand.length === 0) return true
        else return false;

      case "t" : 
        if(hand.includes('j'+card.charAt(1))) return true
        else return false;

      case "9" : 
        if(hand.includes('t'+card.charAt(1))) return true
        else return false;

      case "8" : 
        if(hand.includes('9'+card.charAt(1))) return true
        else return false;

      case "7" : 
        if(hand.includes('8'+card.charAt(1))) return true
        else return false;

       default : break;
    }

  }

  const handleDominoCard = (card) => {

    // Check Hands
    switch(card.charAt(1)) {

      case "s" : if(isPlayableDominoCard(card, handSpides))   return true;
      case "h" : if(isPlayableDominoCard(card, handHearts))   return true;
      case "c" : if(isPlayableDominoCard(card, handCloves))   return true;
      case "d" : if(isPlayableDominoCard(card, handDiamonds)) return true;
      default  : break;
    }

    return false;
  }

  const whoCanPlay = (player) => {
    console.log("3. BOARDGAME // onClickBoard // whoCanPlay() DOMINO from ", player);
    // Check les cartes du joueur suivant en fonction du joueur actuel.

    switch(player) {
      
      case "SOUTH" : 
        if(westHand) {
          for (let i = 0; i < westHand.length; i++) {
            if(isPlayableDominoCard(westHand[i], getDomHand(westHand[i].charAt(1)))) return "WEST";
          }
        }
        if(northHand) {
          for (let i = 0; i < northHand.length; i++) {
            if(isPlayableDominoCard(northHand[i], getDomHand(northHand[i].charAt(1)))) return "NORTH";
          }
        }
        if(eastHand) {
          for (let i = 0; i < eastHand.length; i++) {
            if(isPlayableDominoCard(eastHand[i], getDomHand(eastHand[i].charAt(1)))) return "EAST";
          }
        }
      return "SOUTH";
      
      case "WEST" :
        if(northHand) { 
          for (let i = 0; i < northHand.length; i++) {
            if(isPlayableDominoCard(northHand[i], getDomHand(northHand[i].charAt(1)))) return "NORTH";
          }
        }
        if(eastHand) {
          for (let i = 0; i < eastHand.length; i++) {
            if(isPlayableDominoCard(eastHand[i], getDomHand(eastHand[i].charAt(1)))) return "EAST";
          }
        }
        if(southHand) {
          for (let i = 0; i < southHand.length; i++) {
            if(isPlayableDominoCard(southHand[i], getDomHand(southHand[i].charAt(1)))) return "SOUTH";
          }
        }
        return "WEST";
       
      case "NORTH" : 
        if(eastHand) {
          for (let i = 0; i < eastHand.length; i++) {
            if(isPlayableDominoCard(eastHand[i], getDomHand(eastHand[i].charAt(1)))) return "EAST";
          }
        }
        if(southHand) {
          for (let i = 0; i < southHand.length; i++) {
            if(isPlayableDominoCard(southHand[i], getDomHand(southHand[i].charAt(1)))) return "SOUTH";
          }
        }
        if(westHand) {
          for (let i = 0; i < westHand.length; i++) {
            if(isPlayableDominoCard(westHand[i], getDomHand(westHand[i].charAt(1)))) return "WEST";
          }
        }
        return "NORTH";
       
      case "EAST" : 
        
      console.log("1. BOARDGAME // handSpides = ", handSpides);
      console.log("1. BOARDGAME // handHearts = ", handHearts);
      console.log("1. BOARDGAME // handCloves = ", handCloves);
      console.log("1. BOARDGAME // handDiamonds = ", handDiamonds);

        if(southHand) {
          for (let i = 0; i < southHand.length; i++) {
            if(isPlayableDominoCard(southHand[i], getDomHand(southHand[i].charAt(1)))) return "SOUTH";
          }
        }
        if(westHand) {
          for (let i = 0; i < westHand.length; i++) {
            if(isPlayableDominoCard(westHand[i], getDomHand(westHand[i].charAt(1)))) return "WEST";
          }
        }
        if(northHand) { 
          for (let i = 0; i < northHand.length; i++) {
            if(isPlayableDominoCard(northHand[i], getDomHand(northHand[i].charAt(1)))) return "NORTH";
          }
        }
        return "EAST";
           
      default : break;
    }

  }

  const onClickBoard = async (click) => {

    if(contract === "Domino") {
      console.log("1. BOARDGAME // onClickDomino(", click,")");
      console.log("1. BOARDGAME // handSpides = ", handSpides);
      console.log("1. BOARDGAME // handHearts = ", handHearts);
      console.log("1. BOARDGAME // handCloves = ", handCloves);
      console.log("1. BOARDGAME // handDiamonds = ", handDiamonds);

      // CHECK IF PLAYER HAS TO PLAY.
      if(click[0] !== hasToPlay) { 
        alert(hasToPlay+" has to play !"); 
        return; 
      }

      // CHECK IF CARD IS THE GOOD ONE.
      if(!handleDominoCard(click[1])) {
        alert("Wrong Card !");
        return;
      }
      
      // Save clicked card in Database table "HANDX".
      console.log("2. BOARDGAME // onClickBoard // ", click[0]," ADDED ", click[1]," TO BOARD DOMINO.");
      switch(click[1].charAt(1)) {

        case "s" : 
          setHandSpides(handSpides.push(click[1]));
          await update(ref(database, 'game/boardDomino/'), {
            SPIDES: handSpides,
          }); break;

        case "h" : 
          setHandHearts(handHearts.push(click[1]));
          await update(ref(database, 'game/boardDomino/'), {
            HEARTS: handHearts,
          }); break;

        case "c" : 
          setHandCloves(handCloves.push(click[1]));
          await update(ref(database, 'game/boardDomino/'), {
            CLOVES: handCloves,
          }); break;

        case "d" : 
          setHandDiamonds(handDiamonds.push(click[1]));
          await update(ref(database, 'game/boardDomino/'), {
            DIAMONDS: handDiamonds,
          }); break;

        default : break;
      }
      
      // WHO CAN PLAY NEXT.
      console.log("3. BOARDGAME // onClickBoard // BOARD DOMINO // switch() from ", hasToPlay);

      await update(ref(database, 'game/current/'), { 
        hasToPlay: whoCanPlay(hasToPlay),
      });

      // Remove from HANDS in Database table "Hands".
      // TODO PROD : ONLY "SOUTH" updating with uid.
      console.log("4. BOARDGAME // onClickBoard // SPLICE // UPDATE HANDS on DOMINO");
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

      // UPDATE NB CLIC INCREMENT.
      update(ref(database, 'game/current/'), { 
        nbClic: nbClic+1 
      });

      if(southHand.length === 0 && !dominoDone.includes("SOUTH")) dominoDone.push("SOUTH");
      if(westHand.length  === 0 && !dominoDone.includes("WEST"))  dominoDone.push("WEST");
      if(northHand.length === 0 && !dominoDone.includes("NORTH")) dominoDone.push("NORTH");
      if(eastHand.length  === 0 && !dominoDone.includes("EAST"))  dominoDone.push("EAST");
    
      // HANDLE CHOOSEN CONTRACT.
      console.log("5. BOARDGAME // CONTRACT // HANDLE CHOOSEN || Done : ", dominoDone);

      // MAYBE CHECK ON TEMPO PLI SIZE
      // CHECK HANDS SIZES TO KNOW IF END OF CONTRACT
      if(amIContractor && dominoDone.length === 3) {
        console.log("6. BOARDGAME // onClickBoard // END OF DOMINO || Done : ", dominoDone);
        handleDomino();
        checkEndOf7();
        
        alert('6. BOARDGAME // onClickBoard // END OF DOMINO || ');
        initHands();
      }

    } else {
      console.log("1. BOARDGAME // onClickBoard(", click,") // board : ", board, " // colorAsked = ", colorAsked);

      // CHECK IF PLAYER HAS TO PLAY.
      if(click[0] !== hasToPlay) { 
        alert(hasToPlay+" has to play !"); 
        return; 
      }

      if(board.length === 0) {
        update(ref(database, 'game/current/'), { 
          colorAsk: click[1].charAt(1)
        });
  
        // colorAsked = click[1].charAt(1);
        // setColorAsked(colorAsked);
        // setPlaceAsked(click[0]);
        console.log("1.1 BOARDGAME // onClickBoard // Updated colorAsked !");
      }
  
      // CHECK IF CARD IS THE GOOD ONE.
      if(board.length > 0 && (click[1].charAt(1) !== colorAsked)) {
        if(hasColorAsked(click[0])) {
          alert("Wrong Color !");
          return;
        }
      }
  
      // Save clicked card in Database table "Board".
      console.log("2. BOARDGAME // onClickBoard // ", click[0]," ADDED ", click[1]," TO BOARD.");
      await set(ref(database, 'game/board/'+click[0]), {
        value: click[1],
        place: click[0],
        rank: board.length,
      });
          
      console.log("3. BOARDGAME // onClickBoard // BOARD (", board.length ,") // switch() from ", hasToPlay);
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
      console.log("4. BOARDGAME // onClickBoard // SPLICE // UPDATE HANDS");
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
      if(amIContractor && nbClic === 31) {
        console.log("6. BOARDGAME // onClickBoard // END OF CONTRACT ||");
        checkEndOf7();

        alert('6. BOARDGAME // onClickBoard // END OF CONTRACT || ');
        initHands();
      }  
    }

  }

  useEffect(() => {
    // TODO Prod change place to UID.
    onValue(
      ref(database, 'game/contractor/uid' ), (snapshot) => {
        setContractor(snapshot.val());
        //setAmIContractor(snapshot.val() === user.uid);
        //setHasToPlay(getPlaceByUid(snapshot.val()));
      }
    );

    onValue(
      ref(database, 'game/current/colorAsk' ), (snapshot) => {
          setColorAsked(snapshot.val());
      }
    );

    onValue(
      ref(database, 'game/current/hasToPlay' ), (snapshot) => {
          setHasToPlay(snapshot.val());
      }
    );

    // onValue(
    //   ref(database, 'game/players/' ), (snapshot) => {
    //     let playz = [];
    //       snapshot.forEach((doc) => {
    //         playz.push({...doc.val()});
    //       });
    //       setPlayers(playz);
    //   }
    // );

    onValue(
      ref(database, 'game/board' ), (snapshot) => {
        let theBoard = [];
        snapshot.forEach((doc) => {
          theBoard.push(doc.val());
        });
        setBoard(theBoard);

        //alert('colorAsked : '+colorAsked);
        if(amIContractor && theBoard.length === 4 && colorAsked !== "") {
          setHasToPlay(whoIsTheMaster(theBoard));
          cleanBoard(theBoard);
        }
      }
    );

    onValue(
      ref(database, 'game/players/'+players[0].uid+'/hand' ), (snapshot) => {
        setHand1(sortHand(snapshot.val()));
      }
    );

    onValue(
      ref(database, 'game/players/'+players[1].uid+'/hand' ), (snapshot) => {
        setHand2(sortHand(snapshot.val()));
      }
    );

    onValue(
      ref(database, 'game/players/'+players[2].uid+'/hand' ), (snapshot) => {
        setHand3(sortHand(snapshot.val()));
      }
    );

    onValue(
      ref(database, 'game/players/'+players[3].uid+'/hand' ), (snapshot) => {
        setHand4(sortHand(snapshot.val()));
      }
    );

    // onValue(
    //   ref(database, 'game/hands/SOUTH' ), (snapshot) => {
    //     setSouthHand(sortHand(snapshot.val()));
    //   }
    // );

    // onValue(
    //   ref(database, 'game/hands/WEST' ), (snapshot) => {
    //     setWestHand(sortHand(snapshot.val()));
    //   }
    // );

    // onValue(
    //   ref(database, 'game/hands/NORTH' ), (snapshot) => {
    //     setNorthHand(sortHand(snapshot.val()));
    //   }
    // );

    // onValue(
    //   ref(database, 'game/hands/EAST' ), (snapshot) => {
    //     setEastHand(sortHand(snapshot.val()));
    //   }
    // );

    onValue(
      ref(database, 'game/boardDomino/SPIDES' ), (snapshot) => {
        let hand_s = [];
        snapshot.forEach((doc) => {
          hand_s.push(doc.val());
        });
        setHandSpides(sortHand(hand_s));
      }
    );

    onValue(
      ref(database, 'game/boardDomino/HEARTS' ), (snapshot) => {
        let hand_h = [];
        snapshot.forEach((doc) => {
          hand_h.push(doc.val());
        });
        setHandHearts(sortHand(hand_h));
      }
    );

    onValue(
      ref(database, 'game/boardDomino/CLOVES' ), (snapshot) => {
        let hand_c = [];
        snapshot.forEach((doc) => {
          hand_c.push(doc.val());
        });
        setHandCloves(sortHand(hand_c));
      }
    );

    onValue(
      ref(database, 'game/boardDomino/DIAMONDS' ), (snapshot) => {
        let hand_d = [];
        snapshot.forEach((doc) => {
          hand_d.push(doc.val());
        });
        setHandDiamonds(sortHand(hand_d));
      }
    );

    // TODO : No dur
    onValue(
      ref(database, 'game/players/n3gYoJQyeHhCKzr3WGFybc8nIdb2/score' ), (snapshot) => {
        setSouthGlobalScore(snapshot.val());
      }
    );

    onValue(
      ref(database, 'game/players/n3gYoJQyeHhCKzr3WGFybc8nIdb3/score' ), (snapshot) => {
        setWestGlobalScore(snapshot.val());
      }
    );

    onValue(
      ref(database, 'game/players/n3gYoJQyeHhCKzr3WGFybc8nIdb4/score' ), (snapshot) => {
        setNorthGlobalScore(snapshot.val());
      }
    );

    onValue(
      ref(database, 'game/players/n3gYoJQyeHhCKzr3WGFybc8nIdb5/score' ), (snapshot) => {
        setEastGlobalScore(snapshot.val());
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

  }, []);
  //}, [hasToPlay, colorAsked]);

  console.log("BOARDGAME _--------------------_");
  console.log("BOARDGAME // PROPS playerz = ", props.playerz);
  console.log("BOARDGAME // PROPS rank = ", props.rank);
  console.log("BOARDGAME // PROPS amiii = ", props.rank === 1);
  console.log("BOARDGAME _--------------------_");

  if(props.rank !== 0) {

    setPlayers(props.playerz);
    console.log("BOARDGAME // Players = ", players);

    setContractor(players[0].uid);
    if(props.rank === 1 && props.playerz.length === 4) initHands();

  }

  // console.log("BOARDGAME _--------------------_");
  // console.log("BOARDGAME // PROPS playaz = ", props.playaz);
  // console.log("BOARDGAME // PROPS persoRank = ", props.persoRank);
  // console.log("BOARDGAME // PROPS ami = ", props.ami);
  //console.log("BOARDGAME _--------------------_");
  console.log("BOARDGAME // players = ", players);
  console.log("BOARDGAME // myRank = ", myRank);
  console.log("BOARDGAME // amIContractor = ", amIContractor);
  console.log("BOARDGAME // board = ", board.length);
  console.log("BOARDGAME // master = ", master);
  console.log("BOARDGAME // nbClic = ", nbClic);
  console.log("BOARDGAME // contract = ", contract);
  console.log("BOARDGAME // hasToPlay = ", hasToPlay);
  console.log("BOARDGAME // colorAsked = ", colorAsked);
  console.log("BOARDGAME // contractor = ", contractor);
  console.log("BOARDGAME // contractor place = ", getPlaceByUid(contractor));
  console.log("BOARDGAME // endOfContract = ", endOfContract);
  console.log("BOARDGAME // ContractsDone = ", contractsDone);
  console.log("BOARDGAME // NB ContractsDone = ", contractsDone.length);
  console.log("BOARDGAME // playersDone = ", playersDone);
  console.log("BOARDGAME // endOfSeven = ", endOfSeven);
  console.log("BOARDGAME -____________________-");

  return (

    <div>

      {
        contract === "Domino"
          ?
        <BoardDomino
          cardSpides={handSpides}
          cardHearts={handHearts}
          cardCloves={handCloves}
          cardDiamonds={handDiamonds}
        />
          :
        <Board
          oneBoard={board}
        />
      }

      <PlayerBox
        id="EAST"
        board={board}
        player={players[getPlaceByMyRank("EAST")]}
        myCards={getHandByRank("EAST")}
        hasToPlay={hasToPlay}
        contractor={contractor}
        getBoxClass={(e) => getBoxClass(e)}
        nameOfClass={`${positions[3]}`}
      />

      <PlayerBox
        id="NORTH"
        board={board}
        player={players[getPlaceByMyRank("NORTH")]}
        myCards={getHandByRank("NORTH")}
        hasToPlay={hasToPlay}
        contractor={contractor}
        getBoxClass={(e) => getBoxClass(e)}
        nameOfClass={`${positions[2]}`}
      />

      <PlayerBox
        id="WEST"
        board={board}
        player={players[getPlaceByMyRank("WEST")]}
        myCards={getHandByRank("WEST")}
        hasToPlay={hasToPlay}
        contractor={contractor}
        getBoxClass={(e) => getBoxClass(e)}
        nameOfClass={`${positions[1]}`}
      />

      <PlayerBox
        id="SOUTH"
        board={board}
        player={players[getPlaceByMyRank("SOUTH")]}
        myCards={getHandByRank("SOUTH")}
        hasToPlay={hasToPlay}
        contractor={contractor}
        getBoxClass={(e) => getBoxClass(e)}
        clickBoard={(key) => onClickBoard(key)}
        nameOfClass={`${positions[0]}`}
      />

        {
          !endOfContract 
              ?
          <ContractName value={contract} />
              :
              props.ami
                ?
            <Panel 
              whoCanPlayDom={(p) => whoCanPlay(p)}
            />
                :
            <div className="flex w-1/5 pt-10 flex-col right-10">
                <Image 
                    className='home-logo top-20'
                    src={LoadCard}
                    width={175}
                    alt="AldoIcon"
                    priority
                />
            </div>
        }
 
    </div>

  )
}

export default BoardGame;
