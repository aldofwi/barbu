import { onValue, ref, remove, set, update } from 'firebase/database';
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

const Welcome = () => {

  const [isPartyFull, setIsPartyFull] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  
  const handlePlay = () => {

    set(ref(database, 'game/contracts'), {
      rata: false,
      barbu: false,
      domino: false,
      coeurs: false,
      dames: false,
      plis: false,
      dp: false,
    });

    update(ref(database, 'game/players/n3gYoJQyeHhCKzr3WGFybc8nIdb2'), {
      score: 0,
    });
    update(ref(database, 'game/players/n3gYoJQyeHhCKzr3WGFybc8nIdb3'), {
      score: 0,
    });
    update(ref(database, 'game/players/n3gYoJQyeHhCKzr3WGFybc8nIdb4'), {
      score: 0,
    });
    update(ref(database, 'game/players/n3gYoJQyeHhCKzr3WGFybc8nIdb5'), {
      score: 0,
    });

    update(ref(database, 'game/current/'), {
      colorAsk: "",
      contract: "",
      endOfContract: true,
      hasToPlay: "SOUTH",
      nbClic: 0,
    });

    setGameStarted(true);
  }

    // ------TEMP -------


  // console.log("Value Q = ", values['t']);
  // If Nb Game Players is less than 4 (FULL)
  //  className="h-full flex flex-col bg-[#121212] container justify-center items-center"

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
    </div>

        :

    <BoardGame

    />

  
  )
}

export default Welcome;