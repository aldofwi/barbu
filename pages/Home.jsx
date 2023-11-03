
import React from 'react';
import { useAuthContext } from '@/context/AuthContext';
import { useLogout } from '../hooks/useLogout';
import Image from 'next/image';
import Navbar from '@/pages/Navbar';
import LoadCard from '/public/images/loadCard.png'
import { Box, Img } from '@chakra-ui/react';


const Home = () => {

    const { user } = useAuthContext();
    const { logout } = useLogout();

    const myLoader = ({ src }) => {
        return user.photoURL;
    }


  return (
    <div className="utility__page">
        <Navbar />

            <div className="h-screen flex flex-col bg-[#121212] container justify-center items-center">
                <div className="home-title text-white font-mono font-bold">Hello World!</div>
                
                    <Image 
                        className='home-logo'
                        src={LoadCard}
                        width={175}
                        alt="AldoIcon"
                    />
                
            </div>

    </div>
  )};

export default Home;