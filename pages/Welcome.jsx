import { onValue, push, ref, remove, serverTimestamp, set, update } from 'firebase/database';
import { useAuthContext } from '@/context/AuthContext';
import React, { useEffect, useState } from 'react';
import { IoPlayCircle } from 'react-icons/io5';
import { database } from '@/firebase/config';
import { Button } from '@chakra-ui/react';

import LoadCard from '/public/images/loadCard.png';
import BoardGame from './BoardGame';
import Image from 'next/image';

const values = {
  7: 0,
  8: 1,
  9: 2,
  t: 3,
  j: 4,
  q: 5,
  k: 6,
  a: 7,
}

const cardValues = ["7", "8", "9", "t", "j", "q", "k", "a"];

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
      n--;
  }

  return newTab;
}

const Welcome = () => {

  const { user } = useAuthContext();

  const [myRank, setMyRank] = useState(0);
  const [number, setNumber] = useState(0);
  const [players, setPlayers] = useState([]);

  const [clickPlay, setClickPlay] = useState(false);
  const [isPartyFull, setIsPartyFull] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);

  const createPlayer = (r) => {
    console.log("WELCOME // createPlayer() with rank : ", r);

    // On ajoute le player qui a clické.
    set(ref(database, '/game/players/' + user.uid), {
      picture: user.photoURL,
      rank: r,
      score: 0,
      uid: user.uid,
      username: user.displayName,
    });
  }

  const handlePlay = () => {
    console.log("WELCOME // handlePlay() // players.length : ", players.length);
    console.log("WELCOME // handlePlay() // players : ", players);

    let oldTab = [1, 2, 3, 4];
    let newTab = [];

    if(players.length === 1) {

      oldTab.splice(oldTab.indexOf(players[0].rank), 1);

    } else if(players.length === 2) {

      oldTab.splice(oldTab.indexOf(players[0].rank), 1);
      oldTab.splice(oldTab.indexOf(players[1].rank), 1);
      
    } else if(players.length === 3) {

      oldTab.splice(oldTab.indexOf(players[0].rank), 1);
      oldTab.splice(oldTab.indexOf(players[1].rank), 1);
      oldTab.splice(oldTab.indexOf(players[2].rank), 1);
    }

    newTab = shuffle(oldTab);
    createPlayer(newTab[0]);
    setClickPlay(true);
  }
 
  const orderPlayers = (playaz) => {
    console.log("WELCOME // orderPlayers()");

    let goodPlayz = [];

    for (let i=1; i<5; i++) {
      for (let j=0; j<playaz.length; j++) {

        if(playaz[j].rank === i) {
          goodPlayz.push(playaz[j]);
        }
      }
    }

    goodPlayz.forEach(element => {
      if(element.uid === user.uid) setMyRank(element.rank);
    });

    return goodPlayz;
  }

  const shufflePlayers = (listPlay) => {
    console.log("WELCOME // shufflePlayers()");

    let newList = listPlay;
    let shuffleList = shuffle([1, 2, 3, 4]);

    for (let i=0; i<listPlay.length; i++) {
      newList[i].rank = shuffleList[i];
    }

    return orderPlayers(newList);
  }
 
  const updatePlayers = () => {
    console.log("WELCOME // updatePlayers()");

    update(ref(database, 'game/players/'+players[0].uid), {
      rank: players[0].rank,
    });

    update(ref(database, 'game/players/'+players[1].uid), {
      rank: players[1].rank,
    });
    
    update(ref(database, 'game/players/'+players[2].uid), {
      rank: players[2].rank,
    });
    
    update(ref(database, 'game/players/'+players[3].uid), {
      rank: players[3].rank,
    });
    
  }

  useEffect(() => {

    onValue(
      ref(database, 'game/players/' ), (snapshot) => {
        let playz = [];
          snapshot.forEach((doc) => {
            playz.push({...doc.val()});
          });
          setNumber(playz.length);
          setPlayers(orderPlayers(playz));

          if(playz.length === 4) {
            //setPlayers(orderPlayers(playz));
            setGameStarted(true);
          }
        }
    );

  }, []);


  return (

    !gameStarted
        
        ?

    <div className="absolute top-40  justify-center">
        <div className="home-title text-white font-mono font-bold">Hello World! {number}/4</div>
        <div className="flex w-1/5 pt-10 flex-col right-10">
            <Image 
                className='home-logo top-30'
                src={LoadCard}
                width={175}
                alt="AldoIcon"
                priority
            />
        </div>

      {
        !clickPlay && number < 4 
            ?
        <Button
          leftIcon={<IoPlayCircle />}
          colorScheme='teal'
          variant='solid'
          className='home-button'
          isActive={isPartyFull}
          onClick={handlePlay}
        >
        Play
        </Button>
            :
          null
      }

    </div>

        :

    <BoardGame
      rank={myRank}
      playerz={players}
    />

  )
}

export default Welcome;
