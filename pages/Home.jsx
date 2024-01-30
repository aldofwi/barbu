
import React from 'react';

import { useAuthContext } from '@/context/AuthContext';
import { useState, useEffect } from 'react';
import { useToast } from "@chakra-ui/react";

import Chat from './Chat';
import Welcome from './Welcome';
import Navbar from '@/pages/Navbar';
import { onValue, ref, set } from 'firebase/database';
import { database } from '@/firebase/config';
import { getAuth } from 'firebase/auth';

const Home = () => {

    const auth = getAuth();
    const toast = useToast();

    const { user }                  = useAuthContext();
    const [connected, setConnected] = useState([]);

    useEffect(() => {
  
      onValue(
        ref(database, 'users/' ), (snapshot) => {
          let users = [];
            snapshot.forEach((doc) => {
              users.push({...doc.val() });
            });
            setConnected(users);
        }
      );
  
    }, []);

  return (
    <div className="utility__page">

        <Navbar users={connected} />
        <Chat users={connected} />

        <div className="absolute bg-[#121212] text-white bottom-0 top-28 left-0 right-96">
          <Welcome users={connected} />
        </div>
    </div>
  )};

export default Home;