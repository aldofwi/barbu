import React from 'react';
import Image from 'next/image';
import LoadCard from '/public/images/loadCard.png';

const Welcome = () => {

  return (

    <div className="h-screen flex flex-col bg-[#121212] container justify-center items-center">
        <div className="home-title right-40 text-white font-mono font-bold">Hello World!</div>
        
            <Image 
                className='home-logo'
                src={LoadCard}
                width={175}
                alt="AldoIcon"
            />
    </div>

  )
}

export default Welcome;