import { onValue, push, ref, remove, serverTimestamp, set, update } from 'firebase/database';
import { useAuthContext } from '@/context/AuthContext';
import React, { useEffect, useState } from 'react';
import { IoPlayCircle } from 'react-icons/io5';
import { database } from '@/firebase/config';
import { Button } from '@chakra-ui/react';

import LoadCard from '/public/images/loadCard.png';
import BoardGame from './BoardGame';
import Image from 'next/image';

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

  const [myRank,  setMyRank] = useState(0);
  const [number,  setNumber] = useState(0);
  const [players, setPlayers] = useState([]);

  const [clickPlay,   setClickPlay] = useState(false);
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

    if(r === 1) {
      // On met à jour le contractor en base.
      set(ref(database, '/game/contractor'), {
        name: user.displayName,
        uid: user.uid,
      });
    }
  }

  const handlePlay = () => {
    console.log("WELCOME // handlePlay() // players.length : ", players.length);

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
 

  useEffect(() => {

    const orderPlayers = (playaz) => {
      console.log("WELCOME // orderPlayers(", playaz.length,") // GameStarted ? ", gameStarted);

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

    onValue(
      ref(database, 'game/players/' ), (snapshot) => {
        let playz = [];
          snapshot.forEach((doc) => {
            playz.push({...doc.val()});
          });
          setNumber(playz.length);
          setPlayers(playz);

          if(playz.length === 4 && !gameStarted) {
            setPlayers(orderPlayers(playz));
            setGameStarted(true);
          }
          else if(playz.length === 0) {
            setGameStarted(false);
            setClickPlay(false);
          }
        }
    );

  }, [gameStarted] );
//   }, [gameStarted, orderPlayers, user.uid]);

  //console.log("WELCOME // gameStarted =", gameStarted);

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

      players
        ?
    <BoardGame
      rank={myRank}
      playerz={players}
    />
        :
      null

  )
}

export default Welcome;