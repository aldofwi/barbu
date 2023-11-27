
import React from 'react';

import { useAuthContext } from '@/context/AuthContext';
import { useState, useEffect } from 'react';

import Chat from './Chat';
import Welcome from './Welcome';
import Navbar from '@/pages/Navbar';

const Home = () => {

    const { user } = useAuthContext();

  return (
    <div className="utility__page">

        <Navbar />
        <Chat />    
        <Welcome />
            
    </div>
  )};

export default Home;