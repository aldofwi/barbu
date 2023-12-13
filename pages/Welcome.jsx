import React, { useState } from 'react';
import Image from 'next/image';
import LoadCard from '/public/images/loadCard.png';
import { Button } from '@chakra-ui/react';
import { IoPlayCircle } from 'react-icons/io5';
import FirstBoard from './FirstBoard';

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
    setGameStarted(true);
  }

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

    <FirstBoard />

  
  )
}

export default Welcome;