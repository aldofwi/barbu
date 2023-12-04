
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

  return (
    <div className="utility__page">

        <Navbar users={connected} />
        <Chat users={connected} />    
        <Welcome users={connected} />
            
    </div>
  )};

export default Home;