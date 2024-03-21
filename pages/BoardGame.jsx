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

  const [myRank, setMyRank] = useState(props.rank);
  const [players, setPlayers] = useState(props.playerz);
  const [amIContractor, setAmIContractor] = useState(props.rank === 1);
  const [contractor, setContractor] = useState(props.playerz[0].uid);
  const [hasToPlay, setHasToPlay] = useState(props.playerz[0].uid);

  const [newDeck, setNewDeck] = useState([]);
  const [initFirst, setInitFirst] = useState(false);

  const [hand1, setHand1] = useState([]);
  const [hand2, setHand2] = useState([]);
  const [hand3, setHand3] = useState([]);
  const [hand4, setHand4] = useState([]);

  const [handSpides,   setHandSpides]   = useState([]);
  const [handHearts,   setHandHearts]   = useState([]);
  const [handCloves,   setHandCloves]   = useState([]);
  const [handDiamonds, setHandDiamonds] = useState([]);

  const [plis1, setPlis1] = useState([]);
  const [plis2, setPlis2] = useState([]);
  const [plis3, setPlis3] = useState([]);
  const [plis4, setPlis4] = useState([]);

  let [score1, setScore1] = useState(0);
  let [score2, setScore2] = useState(0);
  let [score3, setScore3] = useState(0);
  let [score4, setScore4] = useState(0);

  let [globalScore1, setGlobalScore1] = useState(0);
  let [globalScore2, setGlobalScore2] = useState(0);
  let [globalScore3, setGlobalScore3] = useState(0);
  let [globalScore4, setGlobalScore4] = useState(0);

  const [board, setBoard] = useState([]);
  const [contract, setContract] = useState("");
  const [colorAsked, setColorAsked] = useState("");

  const [dominoDone, setDominoDone] = useState([]);
  const [displayLoading, setDisplayLoading] = useState(false);

  const [master, setMaster] = useState("");
  let [nbClic, setNbClic] = useState(0);

  let [contractsDone, setContractsDone] = useState([]);
  let [nbContractsDone, setNbContractsDone] = useState(0); // Max is 28.
  const [playersDone, setPlayersDone] = useState([]); // Max length is 4.

  const [endOfContract, setEndOfContract] = useState(false);
  const [endOfSeven,    setEndOfSeven] = useState(false);
  const [endOfGame,     setEndOfGame] = useState(false);

  // INIT Game
  const initGame = () => {
    console.log("BOARDGAME //", user.displayName," déclenche le Game.");

    // TODO : Switch Update to Set
    update(ref(database, 'game/current/'), {
      colorAsk: "",
      contract: "",
      endOfContract: true,
      hasToPlay: user.uid, // contractor
      nbClic: 0,
      hand1:  [],
      hand2:  [],
      hand3:  [],
      hand4:  [],
      score1: 0,
      score2: 0,
      score3: 0,
      score4: 0,
    });

  }

  // INIT Hands
  const initHands = () => {
    console.log("BOARDGAME //", user.displayName," déclenche initHands();");

    // NEW PLIS
    setPlis1([]);
    setPlis2([]);
    setPlis3([]);
    setPlis4([]);

    // // NEW DOM HANDS
    setHandSpides([]);
    setHandHearts([]);
    setHandCloves([]);
    setHandDiamonds([]);

    // // NEW SCORE
    setScore1(0);
    setScore2(0);
    setScore3(0);
    setScore4(0);

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
      hasToPlay: user.uid, // contractor
      nbClic: 0,
      hand1:  newDeck.slice(0, 8),
      hand2:  newDeck.slice(8, 16),
      hand3:  newDeck.slice(16, 24),
      hand4:  newDeck.slice(24, 32),
    });

    if(newDeck.length !== 0) setInitFirst(true);

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

  const getPositionByPlace = (cardinal) => {

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

  const getNameByUID = (id) => {

    switch(id) {
      case players[0].uid : return players[0].username;
      case players[1].uid : return players[1].username;
      case players[2].uid : return players[2].username;
      case players[3].uid : return players[3].username;
      default: break;
    }
  }

  const getUIDByPlace = (place) => {

    switch(place) {
      case "SOUTH": return user.uid;
      case "WEST" :
        switch(myRank) {
          case 1 : return players[1].uid;
          case 2 : return players[2].uid;
          case 3 : return players[3].uid;
          case 4 : return players[0].uid;
          default: break;
        }
      case "NORTH":
        switch(myRank) {
          case 1 : return players[2].uid;
          case 2 : return players[3].uid;
          case 3 : return players[0].uid;
          case 4 : return players[1].uid;
          default: break;
        }
      case "EAST" :
        switch(myRank) {
          case 1 : return players[3].uid;
          case 2 : return players[0].uid;
          case 3 : return players[1].uid;
          case 4 : return players[2].uid;
          default: break;
        }
      default: break;
    }

  }

  const getBoxClass = (oneID) => {
    
    switch(oneID) {
      case "SOUTH":
        if(hasToPlay === getUIDByPlace(oneID)) return "image_S border border-2 rounded-full border-[red]"
        else return "image_S";

      case "NORTH": 
      if(hasToPlay === getUIDByPlace(oneID)) return "image_N border border-2 rounded-full border-[red]"
        else return "image_N";

      case "EAST" : 
      if(hasToPlay === getUIDByPlace(oneID)) return "image_E border border-2 rounded-full border-[red]"
        else return "image_E";

      case "WEST" : 
      if(hasToPlay === getUIDByPlace(oneID)) return "image_W border border-2 rounded-full border-[red]"
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

  const getNextPlayer = (placeID) => {

    switch(placeID) {
      case players[0].uid : return players[1].uid;
      case players[1].uid : return players[2].uid;
      case players[2].uid : return players[3].uid;
      case players[3].uid : return players[0].uid;
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

  const hasColorAsked = (id) => {

    let list = [];

    switch(id) {
      case players[0].uid :
        list = hand1; break;
      case players[1].uid : 
        list = hand2; break;
      case players[2].uid : 
        list = hand3; break;
      case players[3].uid : 
        list = hand4; break;
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

      score1 = getBarbu(plis1);
      score2 = getBarbu(plis2);
      score3 = getBarbu(plis3);
      score4 = getBarbu(plis4);

      console.log("2.2 BOARDGAME // handleBarbu() - score1 : ", score1);
      console.log("2.2 BOARDGAME // handleBarbu() - score2 : ", score2);
      console.log("2.2 BOARDGAME // handleBarbu() - score3 : ", score3);
      console.log("2.2 BOARDGAME // handleBarbu() - score4 : ", score4);
  
      // UPDATE GLOBAL
      globalScore1 += score1;     setGlobalScore1(globalScore1);
      globalScore2 += score2;     setGlobalScore2(globalScore2);
      globalScore3 += score3;     setGlobalScore3(globalScore3);
      globalScore4 += score4;     setGlobalScore4(globalScore4);

      console.log("2.2 BOARDGAME // handleBarbu() - globalScore1 : ", globalScore1);
      console.log("2.2 BOARDGAME // handleBarbu() - globalScore2 : ", globalScore2);
      console.log("2.2 BOARDGAME // handleBarbu() - globalScore3 : ", globalScore3);
      console.log("2.2 BOARDGAME // handleBarbu() - globalScore4 : ", globalScore4);

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

      if(!dominoDone.includes(players[0].uid)) score1 += -25;
      if(!dominoDone.includes(players[1].uid)) score2 += -25;
      if(!dominoDone.includes(players[2].uid)) score3 += -25;
      if(!dominoDone.includes(players[3].uid)) score4 += -25;

      for (let i = 0; i < dominoDone.length; i++) {

        switch(dominoDone[i]) {
          case players[0].uid : score1 += getDomScore(i); break;
          case players[1].uid : score2 += getDomScore(i); break;
          case players[2].uid : score3 += getDomScore(i); break;
          //case players[3].uid : score4 += getDomScore(i); break;
               default :  break;
        }
        
      }

      console.log("2.2 BOARDGAME // handleDomino() - score1 : ", score1);
      console.log("2.2 BOARDGAME // handleDomino() - score2 : ", score2);
      console.log("2.2 BOARDGAME // handleDomino() - score3 : ", score3);
      console.log("2.2 BOARDGAME // handleDomino() - score4 : ", score4);
  
      // UPDATE GLOBAL
      globalScore1 += score1;   setGlobalScore1(globalScore1);
      globalScore2 += score2;   setGlobalScore2(globalScore2);
      globalScore3 += score3;   setGlobalScore3(globalScore3);
      globalScore4 += score4;   setGlobalScore4(globalScore4);

      console.log("2.2 BOARDGAME // handleDomino() - globalScore1 : ", globalScore1);
      console.log("2.2 BOARDGAME // handleDomino() - globalScore2 : ", globalScore2);
      console.log("2.2 BOARDGAME // handleDomino() - globalScore3 : ", globalScore3);
      console.log("2.2 BOARDGAME // handleDomino() - globalScore4 : ", globalScore4);

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
        hasToPlay: contractor, 
      });
    }
  }

  const handleHearts = () => {
    console.log("2.2 BOARDGAME // handleHearts()");

    if(!contractsDone.includes("Coeurs")) {

      score1 = getNbHearts(plis1) * -5;
      score2 = getNbHearts(plis2) * -5;
      score3 = getNbHearts(plis3) * -5;
      score4 = getNbHearts(plis4) * -5;

      console.log("2.2 BOARDGAME // handleHearts() - score1 : ", score1);
      console.log("2.2 BOARDGAME // handleHearts() - score2 : ", score2);
      console.log("2.2 BOARDGAME // handleHearts() - score3 : ", score3);
      console.log("2.2 BOARDGAME // handleHearts() - score4 : ", score4);
  
      // UPDATE GLOBAL
      globalScore1 += score1;     setGlobalScore1(globalScore1);
      globalScore2 += score2;     setGlobalScore2(globalScore2);
      globalScore3 += score3;     setGlobalScore3(globalScore3);
      globalScore4 += score4;     setGlobalScore4(globalScore4);

      console.log("2.2 BOARDGAME // handleHearts() - globalScore1 : ", globalScore1);
      console.log("2.2 BOARDGAME // handleHearts() - globalScore2 : ", globalScore2);
      console.log("2.2 BOARDGAME // handleHearts() - globalScore3 : ", globalScore3);
      console.log("2.2 BOARDGAME // handleHearts() - globalScore4 : ", globalScore4);

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

      score1 = getNbQueens(plis1) * -10;
      score2 = getNbQueens(plis2) * -10;
      score3 = getNbQueens(plis3) * -10;
      score4 = getNbQueens(plis4) * -10;

      console.log("2.2 BOARDGAME // handleQueens() - score1 : ", score1);
      console.log("2.2 BOARDGAME // handleQueens() - score2 : ", score2);
      console.log("2.2 BOARDGAME // handleQueens() - score3 : ", score3);
      console.log("2.2 BOARDGAME // handleQueens() - score4 : ", score4);
  
      // UPDATE GLOBAL
      globalScore1 += score1;   setGlobalScore1(globalScore1);
      globalScore2 += score2;   setGlobalScore2(globalScore2);
      globalScore3 += score3;   setGlobalScore3(globalScore3);
      globalScore4 += score4;   setGlobalScore4(globalScore4);

      console.log("2.2 BOARDGAME // handleQueens() - globalScore1 : ", globalScore1);
      console.log("2.2 BOARDGAME // handleQueens() - globalScore2 : ", globalScore2);
      console.log("2.2 BOARDGAME // handleQueens() - globalScore3 : ", globalScore3);
      console.log("2.2 BOARDGAME // handleQueens() - globalScore4 : ", globalScore4);

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

      score1 = plis1.length * -5;
      score2 = plis2.length * -5;
      score3 = plis3.length * -5;
      score4 = plis4.length * -5;
  
      console.log("2.2 BOARDGAME // handlePlis() - score1 : ", score1);
      console.log("2.2 BOARDGAME // handlePlis() - score2 : ", score2);
      console.log("2.2 BOARDGAME // handlePlis() - score3 : ", score3);
      console.log("2.2 BOARDGAME // handlePlis() - score4 : ", score4);
  
      // UPDATE GLOBAL
      globalScore1 += score1;   // setGlobalScore1(globalScore1);
      globalScore2 += score2;   // setGlobalScore2(globalScore2);
      globalScore3 += score3;   // setGlobalScore3(globalScore3);
      globalScore4 += score4;   // setGlobalScore4(globalScore4);

      console.log("2.2 BOARDGAME // handlePlis() - globalScore1 : ", globalScore1);
      console.log("2.2 BOARDGAME // handlePlis() - globalScore2 : ", globalScore2);
      console.log("2.2 BOARDGAME // handlePlis() - globalScore3 : ", globalScore3);
      console.log("2.2 BOARDGAME // handlePlis() - globalScore4 : ", globalScore4);

      // RECORD CONTRACT ON BASE.
      recordContract(contracts[5]);
    }
  }

  const handleDP = (player) => {

    if(!contractsDone.includes("Dernier Pli")) {
      console.log("2.3 BOARDGAME // handleDP - Dernier Pli pour ", getNameByUID(player));

      // UPDATE GLOBAL
      switch(player) {

        case players[0].uid : 
          score1 = -25; console.log("2.3 BOARDGAME // handleDP() - score1 : ", score1);
          globalScore1 += score1; //setSouthGlobalScore(southGlobalScore);
          console.log("2.3 BOARDGAME // handleDP() - globalScore1 : ", globalScore1);
          break;

        case players[1].uid : 
          score2 = -25; console.log("2.3 BOARDGAME // handleDP() - score2 : ", score2);
          globalScore2 += score2; //setWestGlobalScore(westGlobalScore);
          console.log("2.3 BOARDGAME // handleDP() - globalScore2 : ", globalScore2);
          break;

        case players[2].uid : 
          score3 = -25; console.log("2.3 BOARDGAME // handleDP() - score3 : ", score3);
          globalScore3 += score3; //setNorthGlobalScore(northGlobalScore);
          console.log("2.3 BOARDGAME // handleDP() - globalScore3 : ", globalScore3);
          break;

        case players[3].uid : 
          score4 = -25; console.log("2.3 BOARDGAME // handleDP() - score4 : ", score4);
          globalScore4 += score4; //setEastGlobalScore(eastGlobalScore);
          console.log("2.3 BOARDGAME // handleDP() - globalScore4 : ", globalScore4);
          break;

        default : break;
      }

      // RECORD CONTRACT ON BASE.
      recordContract(contracts[6]);
    }
  }

  const handleContract = (p, c) => {

    let allPlis = plis1.length + plis2.length + plis3.length + plis4.length;
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
      console.log("2.2 BOARDGAME // handleContract() - plis1 : ", plis1);
      console.log("2.2 BOARDGAME // handleContract() - plis2 : ", plis2);
      console.log("2.2 BOARDGAME // handleContract() - plis3 : ", plis3);
      console.log("2.2 BOARDGAME // handleContract() - plis4 : ", plis4);

      update(ref(database, 'game/current/'), { 
        hasToPlay: contractor, 
      });

      return contractor;
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
        nextPlayer = getNextPlayer(contractor);
        //setContractor(nextPlayerUID);

        update(ref(database, 'game/current/'), { 
          hasToPlay: nextPlayer,
        });

        update(ref(database, 'game/contractor/'), { 
          name: getNameByUID(nextPlayer),
          uid: nextPlayer,
        });
      }
    } 

  }

  const presenceIn = (temp) => {

    for (let i = 0; i < plis1.length; i++) {
      if(plis1[i].includes(temp)) {
        console.log("2.2 BOARDGAME // presenceIn() - ", temp," IS IN P1");
        return true;
      }
    }
    for (let i = 0; i < plis2.length; i++) {
      if(plis2[i].includes(temp)) {
        console.log("2.2 BOARDGAME // presenceIn() - ", temp," IS IN P2");
        return true;
      }
    }
    for (let i = 0; i < plis3.length; i++) {
      if(plis3[i].includes(temp)) {
        console.log("2.2 BOARDGAME // presenceIn() - ", temp," IS IN P3");
        return true;
      }
    }
    for (let i = 0; i < plis4.length; i++) {
      if(plis4[i].includes(temp)) {
        console.log("2.2 BOARDGAME // presenceIn() - ", temp," IS IN P4");
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

    // UPDATE PLAYER --> SCORE
    update(ref(database, 'game/current/'), {
      score1: globalScore1,
      score2: globalScore2,
      score3: globalScore3,
      score4: globalScore4,
    });

    console.log(" ----------------------------------------------> RECORD CONTRACT & SCORES OUT");
  }

  const recordBoard = (placeID, board) => {

    if(placeID === "") return;

    console.log("recordBoard _--------------------------------------------_");
    console.log("2.2 BOARDGAME // RecordBoard = ", board, " - placeID = ", getPlaceByUid(placeID));

    let tempoPli = [];

    for(let i=0; i<board.length; i++) {
      tempoPli.push(board[i].value);
    }

    if(!presenceIn(tempoPli[0])) {

      switch(placeID) {
        case players[0].uid : 
          plis1.push(tempoPli);
          break;

        case players[1].uid : 
          plis2.push(tempoPli);
          break;

        case players[2].uid : 
          plis3.push(tempoPli);
          break;

        case players[3].uid : 
          plis4.push(tempoPli);
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
  // PLACE became now an ID.

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

        console.log("2.2 BOARDGAME // handleContract() - plis1 : ", plis1);
        console.log("2.2 BOARDGAME // handleContract() - plis2 : ", plis2);
        console.log("2.2 BOARDGAME // handleContract() - plis3 : ", plis3);
        console.log("2.2 BOARDGAME // handleContract() - plis4 : ", plis4);

        console.log("2.1 BOARDGAME // whoIsTheMaster() = ", getNameByUID(masterPlace), " // END");
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
      
      case players[0].uid : 
        if(hand2) {
          for (let i = 0; i < hand2.length; i++) {
            if(isPlayableDominoCard(hand2[i], getDomHand(hand2[i].charAt(1)))) return players[1].uid;
          }
        }
        if(hand3) {
          for (let i = 0; i < hand3.length; i++) {
            if(isPlayableDominoCard(hand3[i], getDomHand(hand3[i].charAt(1)))) return players[2].uid;
          }
        }
        if(hand4) {
          for (let i = 0; i < hand4.length; i++) {
            if(isPlayableDominoCard(hand4[i], getDomHand(hand4[i].charAt(1)))) return players[3].uid;
          }
        }
      return players[0].uid;
      
      case players[1].uid :
        if(hand3) { 
          for (let i = 0; i < hand3.length; i++) {
            if(isPlayableDominoCard(hand3[i], getDomHand(hand3[i].charAt(1)))) return players[2].uid;
          }
        }
        if(hand4) {
          for (let i = 0; i < hand4.length; i++) {
            if(isPlayableDominoCard(hand4[i], getDomHand(hand4[i].charAt(1)))) return players[3].uid;
          }
        }
        if(hand1) {
          for (let i = 0; i < hand1.length; i++) {
            if(isPlayableDominoCard(hand1[i], getDomHand(hand1[i].charAt(1)))) return players[0].uid;
          }
        }
        return players[1].uid;
       
      case players[2].uid : 
        if(hand4) {
          for (let i = 0; i < hand4.length; i++) {
            if(isPlayableDominoCard(hand4[i], getDomHand(hand4[i].charAt(1)))) return players[3].uid;
          }
        }
        if(hand1) {
          for (let i = 0; i < hand1.length; i++) {
            if(isPlayableDominoCard(hand1[i], getDomHand(hand1[i].charAt(1)))) return players[0].uid;
          }
        }
        if(hand2) {
          for (let i = 0; i < hand2.length; i++) {
            if(isPlayableDominoCard(hand2[i], getDomHand(hand2[i].charAt(1)))) return players[1].uid;
          }
        }
        return players[2].uid;
       
      case players[3].uid : 
        
      console.log("1. BOARDGAME // handSpides = ", handSpides);
      console.log("1. BOARDGAME // handHearts = ", handHearts);
      console.log("1. BOARDGAME // handCloves = ", handCloves);
      console.log("1. BOARDGAME // handDiamonds = ", handDiamonds);

        if(hand1) {
          for (let i = 0; i < hand1.length; i++) {
            if(isPlayableDominoCard(hand1[i], getDomHand(hand1[i].charAt(1)))) return players[0].uid;
          }
        }
        if(hand2) {
          for (let i = 0; i < hand2.length; i++) {
            if(isPlayableDominoCard(hand2[i], getDomHand(hand2[i].charAt(1)))) return players[1].uid;
          }
        }
        if(hand3) { 
          for (let i = 0; i < hand3.length; i++) {
            if(isPlayableDominoCard(hand3[i], getDomHand(hand3[i].charAt(1)))) return players[2].uid;
          }
        }
        return players[3].uid;
           
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
        alert(getNameByUID(hasToPlay)+" has to play !"); 
        return; 
      }

      // CHECK IF CARD IS THE GOOD ONE.
      if(!handleDominoCard(click[1])) {
        alert("Wrong Card !");
        return;
      }
      
      // Save clicked card in Database table "HANDX".
      console.log("2. BOARDGAME // onClickBoard // ", getNameByUID(click[0])," ADDED ", click[1]," TO BOARD DOMINO.");
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
      console.log("3. BOARDGAME // onClickBoard // BOARD DOMINO // switch() from ", getNameByUID(hasToPlay));

      await update(ref(database, 'game/current/'), { 
        hasToPlay: whoCanPlay(hasToPlay),
      });

      // Remove from HANDS in Database table "Hands".
      // TODO PROD : ONLY "SOUTH" updating with uid.
      console.log("4. BOARDGAME // onClickBoard // SPLICE // UPDATE HANDS on DOMINO");
      switch(click[0]) {
        case players[0].uid :
          setHand1(hand1.splice(hand1.indexOf(click[1]), 1));
          update(ref(database, 'game/current/'), {
            hand1: hand1,
            }); break;
        case players[1].uid :
          setHand2(hand2.splice(hand2.indexOf(click[1]), 1));  
          update(ref(database, 'game/current/'), {
            hand2: hand2,
            }); break;
        case players[2].uid :
          setHand3(hand3.splice(hand3.indexOf(click[1]), 1)); 
          update(ref(database, 'game/current/'), {
            hand3: hand3,
            }); break;
        case players[3].uid :
          setHand4(hand4.splice(hand4.indexOf(click[1]), 1));
          update(ref(database, 'game/current/'), {
            hand4: hand4,
            }); break;
  
        default: break;
      }

      // UPDATE NB CLIC INCREMENT.
      update(ref(database, 'game/current/'), { 
        nbClic: nbClic+1 
      });

      if(hand1.length === 0 && !dominoDone.includes(players[0].uid)) dominoDone.push(players[0].uid);
      if(hand2.length === 0 && !dominoDone.includes(players[1].uid)) dominoDone.push(players[1].uid);
      if(hand3.length === 0 && !dominoDone.includes(players[2].uid)) dominoDone.push(players[2].uid);
      if(hand4.length === 0 && !dominoDone.includes(players[3].uid)) dominoDone.push(players[3].uid);
    
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
      if(click[0] !== hasToPlay) { // PUT ID in ID
        alert(getNameByUID(hasToPlay)+" has to play !"); 
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
  
      // Save clicked card in Database table "Board". ID replace PLACE (click[0])
      console.log("2. BOARDGAME // onClickBoard // ", getNameByUID(click[0])," ADDED ", click[1]," TO BOARD.");
      await set(ref(database, 'game/board/'+click[0]), {
        value: click[1],
        place: click[0],
        rank: board.length,
      });
          
      console.log("3. BOARDGAME // onClickBoard // BOARD (", board.length ,") // switch() from ", getNameByUID(hasToPlay));
      if(board.length < 3) {
        switch(hasToPlay) {
          case players[0].uid : 
          update(ref(database, 'game/current/'), { 
            hasToPlay: players[1].uid
          }); break;
        case players[1].uid :  
          update(ref(database, 'game/current/'), { 
            hasToPlay: players[2].uid 
          }); break;
        case players[2].uid :  
          update(ref(database, 'game/current/'), { 
            hasToPlay: players[3].uid 
          }); break;
        case players[3].uid :
          update(ref(database, 'game/current/'), { 
            hasToPlay: players[0].uid
          }); break;
        default: break;
        }
      }
  
      // Remove from HANDS in Database table "Hands".
      // TODO PROD : ONLY "SOUTH" updating with uid.
      console.log("4. BOARDGAME // onClickBoard // SPLICE // UPDATE HANDS");
      switch(click[0]) {
        case players[0].uid :
          setHand1(hand1.splice(hand1.indexOf(click[1]), 1));
          update(ref(database, 'game/current/'), {
            hand1: hand1,
            }); break;
        case players[1].uid :
          setHand2(hand2.splice(hand2.indexOf(click[1]), 1));  
          update(ref(database, 'game/current/'), {
            hand2: hand2,
            }); break;
        case players[2].uid :
          setHand3(hand3.splice(hand3.indexOf(click[1]), 1)); 
          update(ref(database, 'game/current/'), {
            hand3: hand3,
            }); break;
        case players[4].uid :
          setHand4(hand4.splice(hand4.indexOf(click[1]), 1));
          update(ref(database, 'game/current/'), {
            hand4: hand4,
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
        setContractor(state => snapshot.val());
        //setAmIContractor(snapshot.val() === user.uid);
        //setHasToPlay(getPlaceByUid(snapshot.val()));
      }
    );

    onValue(
      ref(database, 'game/current/colorAsk' ), (snapshot) => {
          setColorAsked(state => snapshot.val());
      }
    );

    onValue(
      ref(database, 'game/current/hasToPlay' ), (snapshot) => {
          setHasToPlay(state => snapshot.val());
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
      ref(database, 'game/current/hand1' ), (snapshot) => {
        setHand1(state => sortHand(snapshot.val()));
      }
    );

    onValue(
      ref(database, 'game/current/hand2' ), (snapshot) => {
        setHand2(state => sortHand(snapshot.val()));
      }
    );

    onValue(
      ref(database, 'game/current/hand3' ), (snapshot) => {
        setHand3(state => sortHand(snapshot.val()));
      }
    );

    onValue(
      ref(database, 'game/current/hand4' ), (snapshot) => {
        setHand4(state => sortHand(snapshot.val()));
      }
    );

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
      ref(database, 'game/current/score1' ), (snapshot) => {
        setGlobalScore1(snapshot.val());
      }
    );

    onValue(
      ref(database, 'game/current/score2' ), (snapshot) => {
        setGlobalScore2(snapshot.val());
      }
    );

    onValue(
      ref(database, 'game/current/score3' ), (snapshot) => {
        setGlobalScore3(snapshot.val());
      }
    );

    onValue(
      ref(database, 'game/current/score4' ), (snapshot) => {
        setGlobalScore4(snapshot.val());
      }
    );

    onValue(
      ref(database, 'game/current/contract' ), (snapshot) => {
        setContract(state => snapshot.val());
      }
    );

    onValue(
      ref(database, 'game/current/nbClic' ), (snapshot) => {
        setNbClic(state => snapshot.val());
      }
    );

    onValue(
      ref(database, 'game/current/endOfContract' ), (snapshot) => {
        setEndOfContract(state => snapshot.val());
      }
    );

  //}, []);
  }, [hasToPlay, colorAsked]);

  console.log("BOARDGAME _--------------------_");
  console.log("BOARDGAME // PROPS playerz = ", props.playerz);
  console.log("BOARDGAME // PROPS rank = ", props.rank);
  console.log("BOARDGAME // PROPS Am I ? ", props.rank === 1);
  console.log("BOARDGAME _--------------------_");

  if(props.rank !== 0 && playersDone.length === 0 && contractsDone.length === 0) {

    //setPlayers(props.playerz);
    console.log("BOARDGAME // Players = ", players);

    //setContractor(players[0].uid);
    if(props.rank === 1 && !initFirst) {
      initGame();
      initHands();
    } 
  }

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
        id={getUIDByPlace("EAST")}
        board={board}
        player={players[getPositionByPlace("EAST")]}
        myCards={getHandByRank("EAST")}
        hasToPlay={hasToPlay}
        contractor={contractor}
        getBoxClass={(e) => getBoxClass(e)}
        nameOfClass={`${positions[3]}`}
      />

      <PlayerBox
        id={getUIDByPlace("NORTH")}
        board={board}
        player={players[getPositionByPlace("NORTH")]}
        myCards={getHandByRank("NORTH")}
        hasToPlay={hasToPlay}
        contractor={contractor}
        getBoxClass={(e) => getBoxClass(e)}
        nameOfClass={`${positions[2]}`}
      />

      <PlayerBox
        id={getUIDByPlace("WEST")}
        board={board}
        player={players[getPositionByPlace("WEST")]}
        myCards={getHandByRank("WEST")}
        hasToPlay={hasToPlay}
        contractor={contractor}
        getBoxClass={(e) => getBoxClass(e)}
        nameOfClass={`${positions[1]}`}
      />

      <PlayerBox
        id={getUIDByPlace("SOUTH")}
        board={board}
        player={players[getPositionByPlace("SOUTH")]}
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
              contractor === user.uid
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
