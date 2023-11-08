
import React from 'react';
import { useAuthContext } from '@/context/AuthContext';
import { useToast } from '@chakra-ui/react';
import Navbar from '@/pages/Navbar';
import { useEffect } from 'react';
import Chat from './Chat';
import Welcome from './Welcome';

const Home = () => {

    const { user } = useAuthContext();
    const toast = useToast();

    useEffect(() => {
        toast({
            title: "You are logged in as " + user?.displayName,
            status: "success",
            duration: 2000,
            position: "top",
        });
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

  return (
    <div className="utility__page">

        <Navbar />
        <Chat />    
        <Welcome />
            
    </div>
  )};

export default Home;