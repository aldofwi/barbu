
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

  const { user }                      = useAuthContext();
  const [connected, setConnected]     = useState([]);
  const [playersHome, setPlayersHome] = useState([]);

  const orderHPlayers = (playaz) => {
    console.log("HOME // orderPlayers(", playaz?.length,")");

    let goodPlayz = [];

    for (let i=1; i<5; i++) {
      for (let j=0; j<playaz?.length; j++) {

        if(playaz[j].rank === i) {
          goodPlayz.push(playaz[j]);
        }
      }
    }

    return goodPlayz;
  }

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

      onValue(
        ref(database, 'game/players/' ), (snapshot) => {
          let playz = [];
            snapshot.forEach((doc) => {
              playz.push({...doc.val()});
            });

            if(playz?.length === 4) {
              setPlayersHome(orderHPlayers(playz));
            }
          }
      );

      if(user.displayName === null) {

        user.displayName = user.email.slice(0, user.email.indexOf('@'));
        user.photoURL = "https://e7.pngegg.com/pngimages/416/62/png-clipart-anonymous-person-login-google-account-computer-icons-user-activity-miscellaneous-computer-thumbnail.png";
      }
  
    }, [user]);

  return (
    <div className="utility__page">

        <Navbar users={connected} playersNav={playersHome} />
        <Chat users={connected} />

        <div className="absolute bg-[#121212] text-white bottom-0 top-28 left-0 right-96">
          <Welcome users={connected} />
        </div>
    </div>
  )};

export default Home;