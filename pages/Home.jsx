
import React from 'react';

import { useAuthContext } from '@/context/AuthContext';
import { useState, useEffect } from 'react';

import Chat from './Chat';
import Welcome from './Welcome';
import Navbar from '@/pages/Navbar';
import { onValue, ref } from 'firebase/database';
import { database } from '@/firebase/config';

const Home = () => {

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

  // className="h-full w-full flex flex-col text-white bg-[#121212] inset-y-0"
  // className="h-full flex flex-col bg-[#121212] container justify-center items-center"

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