import React, { useState } from 'react';
import Image from 'next/image';
import LoadCard from '/public/images/loadCard.png';
import { Button } from '@chakra-ui/react';
import { IoPlayCircle } from 'react-icons/io5';
import BoardGame from './BoardGame';

const Welcome = (props) => {

  const [gameStarted, setGameStarted] = useState(false);

  const handlePlay = () => {
    setGameStarted(true);
  }

  return (

    !gameStarted 
        
        ?

    <div className="h-screen flex flex-col bg-[#121212] container justify-center items-center">
        <div className="home-title right-40 text-white font-mono font-bold">Hello World!</div>
        <div className="flex w-1/5 pt-10 flex-col right-10">
            <Image 
                className='home-logo top-30'
                src={LoadCard}
                width={175}
                alt="AldoIcon"
                priority
            />
        
            <Button
              leftIcon={<IoPlayCircle />}
              colorScheme='teal'
              variant='solid'
              className='right-40 -top-40'
              isActive={props.isPartyFull}
              onClick={handlePlay}
            >
            Play
            </Button>
        </div>
    </div>

        :

    <BoardGame />
  
  )
}

export default Welcome;