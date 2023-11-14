
import React from 'react';
import barbuWS from './api/socket';
import SocketIO from 'socket.io-client';

import { useAuthContext } from '@/context/AuthContext';
import { useToast } from '@chakra-ui/react';
import { useEffect } from 'react';

import Chat from './Chat';
import Welcome from './Welcome';
import Navbar from '@/pages/Navbar';


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

    /**
     * @function connect
     * This function establishes the connection with the websocket
     * and also ensures constant reconnection if connection lost
     */
    // const connect = () => {
    //   // WebSocket Definition

    //   // WS on "connect" Event Listener
    //   barbuWS.on("connect", () => {

    //     barbuWS.emit("username", user?.displayName);
    //     console.log('01 - GAME - connect() | barbuser : ', user?.displayName);
    //   });

    //   // ...

    // }

    // barbuWS.connect();

  return (
    <div className="utility__page">

        <Navbar />
        <Chat />    
        <Welcome />
            
    </div>
  )};

export default Home;