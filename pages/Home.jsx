
import React from 'react';
import { useAuthContext } from '@/context/AuthContext';
import { useLogout } from '../hooks/useLogout';
import Image from 'next/image';
import Navbar from '@/pages/Navbar';

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
                <h1 className="text-white font-mono font-bold">Hello World!</h1>

            </div>

    </div>
  )};

export default Home;