
import React from 'react';
import { useAuthContext } from '@/context/AuthContext';
import { useLogout } from '../hooks/useLogout';
import { useToast } from '@chakra-ui/react';
import Image from 'next/image';
import Navbar from '@/pages/Navbar';
import LoadCard from '/public/images/loadCard.png';
import { useEffect } from 'react';
import Chat from './Chat';

const Home = () => {

    const { user } = useAuthContext();
    const name = user.displayName;
    const toast = useToast();

    useEffect(() => {
        toast({
            title: "You're logged in as "+name,
            status: "success",
            duration: 2000,
            position: "top",
        });
    }, [name, toast]);
    
    // useEffect(() => console.log(user), [user]);

  return (
    <div className="utility__page">
        <Navbar />
        <Chat />    
            <div className="h-screen flex flex-col bg-[#121212] container justify-center items-center">
                <div className="home-title right-40 text-white font-mono font-bold">Hello World!</div>
                
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

/*
    const myLoader = ({ src }) => {
        
        return user.photoURL;
    }
*/