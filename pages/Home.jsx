
import React from 'react';
import { useAuthContext } from '@/context/AuthContext';
import { useLogout } from './hooks/useLogout';
import Image from 'next/image';

const Home = () => {

    const { user } = useAuthContext();
    const { logout } = useLogout();

    const myLoader = ({ src }) => {
        return user.photoURL;
    }

  return (
    <div className="utility__page">

            <div className="h-screen flex flex-col bg-[#121212] container justify-center items-center">
                <h1 className="text-white font-mono font-bold">Hello World !</h1>

                {user && (
                    <>
                    <div className="user">
                        <p>You&apos;re logged in as :</p>
    
                        <span className='text-blue-300'>{ user.displayName }</span>
                        <Image 
                            loader={myLoader}
                            src={ user.photoURL } 
                            className="profile_img"
                            width={3}
                            height={3}
                            alt="pp" /> 
                    </div>
                    <button className="logout bg-[#d05454] hover:bg-[#d05454]/90" onClick={logout}>
                        Log out
                    </button>
                    </>
                )}
            </div>

    </div>
  )};

export default Home;