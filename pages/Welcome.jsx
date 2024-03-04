import { onValue, push, ref, remove, serverTimestamp, set, update } from 'firebase/database';
import { useAuthContext } from '@/context/AuthContext';
import React, { useEffect, useState } from 'react';
import { IoPlayCircle } from 'react-icons/io5';
import { database } from '@/firebase/config';
import { Button } from '@chakra-ui/react';

import LoadCard from '/public/images/loadCard.png';
import BoardGame from './BoardGame';
import Image from 'next/image';
import DeckChoice from './DeckChoice';

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

const Welcome = () => {

  const { user } = useAuthContext();

  const [picked, setPicked] = useState([]);
  const [isOrderSet, setIsOrderSet]   = useState(false);
  const [isPartyFull, setIsPartyFull] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  // const [players, setPlayers] = useState([]);
  // const [users, setUsers] = useState([]);

  // getPositionByID when Order is setted.
  // pass positions to PlayerBox props.
  // Map players from database.

  const getRank = () => {
    console.log("WELCOME // getRank()");

    let numb=1;
    let myCard;
    let myValue;
    let otherCards = [];
    let players = picked;

    for(let i=0; i<players.length; i++) {
      if(players[i].username === user.displayName) {
        myCard = players[i].pick.charAt(0);
        for(let j=0; j<cardValues.length; j++) {
          if(myCard === cardValues[j]) myValue = j;
        }
      } 
      // else {
      //   otherCards.push(players[i].pick.charAt(0));
      // }
    }

    for(let k=0; k<players.length; k++) {
      if(players[k].username !== user.displayName) {
        
        // console.log("myValue = ", myValue);
        // console.log("k = ", k, "| players[k].pick.charAt(0) = ", players[k].pick.charAt(0));
        // console.log("values[players[k].pick.charAt(0)] = ", values[players[k].pick.charAt(0)]);
        // console.log("myValue < other --> ", myValue  < values[players[k].pick.charAt(0)]);

        if(myValue < values[players[k].pick.charAt(0)]) {
          numb++;
        }
      }
    }

    update(ref(database, '/game/players/' + user.uid), {
      rank: numb,
    });

    if(numb === 1) {
      set(ref(database, '/game/contractor'), {
        name: user.displayName,
        uid: user.uid,
      });
    }
    
    const msgRef = ref(database, 'messages/');
    const newItem = push(msgRef);

    set(newItem, 
      {
          createdAt: serverTimestamp(),
          msg: user.displayName+" is contractor N°"+numb,
          name: "[J@rvis]",
          uid: "basic101",
      });

    return numb;
  }
  
  const handlePlay = () => {

    setGameStarted(true);
  }

  useEffect(() => { 

    onValue(
      ref(database, 'game/players' ), (snapshot) => {
        let thePicked = [];
        snapshot.forEach((doc) => {
          thePicked.push(doc.val());
        });
        setPicked(thePicked);

        if(picked.length === 4) {
          getRank();
          setIsPartyFull(true);
          setIsOrderSet(true);
        }
      }
    );

  }, []);


  // useEffect(() => { 

  //   onValue(
  //     ref(database, 'users/' ), (snapshot) => {
  //       let userz = [];
  //         snapshot.forEach((doc) => {
  //           userz.push({...doc.val() });
  //         });
  //         setUsers(userz);
  //     }
  //   );

  // }, []);

  // console.log("WELCOME // users : ", users);
  // console.log("WELCOME // picked : ", picked);


  return (

    !gameStarted
        
        ?

    <div className="absolute top-40  justify-center">
        <div className="home-title text-white font-mono font-bold">Hello World!</div>
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
        picked.length < 4 
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

    !isOrderSet
        ?

    <DeckChoice 
      
    />
        
        :

    <BoardGame />

  )
}

export default Welcome;

// setPickers={(a) => setPicked(a)}

    // set(ref(database, 'game/contracts'), {
    //   rata: false,
    //   barbu: false,
    //   domino: false,
    //   coeurs: false,
    //   dames: false,
    //   plis: false,
    //   dp: false,
    // });

    // update(ref(database, 'game/players/n3gYoJQyeHhCKzr3WGFybc8nIdb2'), {
    //   score: 0,
    // });
    // update(ref(database, 'game/players/n3gYoJQyeHhCKzr3WGFybc8nIdb3'), {
    //   score: 0,
    // });
    // update(ref(database, 'game/players/n3gYoJQyeHhCKzr3WGFybc8nIdb4'), {
    //   score: 0,
    // });
    // update(ref(database, 'game/players/n3gYoJQyeHhCKzr3WGFybc8nIdb5'), {
    //   score: 0,
    // });

    // update(ref(database, 'game/current/'), {
    //   colorAsk: "",
    //   contract: "",
    //   endOfContract: true,
    //   hasToPlay: "SOUTH",
    //   nbClic: 0,
    // });

    // ------TEMP -------
    // console.log("Value Q = ", values['t']);
    // If Nb Game Players is less than 4 (FULL)
    //  className="h-full flex flex-col bg-[#121212] container justify-center items-center"
