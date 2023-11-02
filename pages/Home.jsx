
import React from 'react';
import { useAuthContext } from '@/context/AuthContext';
import { useLogout } from '../hooks/useLogout';
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
                        <div className='w-20 h-20'>
                            <Image
                                loader={myLoader}
                                unoptimized
                                src={ user.photoURL } 
                                className="profile_img"
                                width={1}
                                height={1}
                                alt="pp" />
                        </div>
                    </div>
                    <button className="logout bg-[#d05454] hover:bg-[#d05454]/90" onClick={logout}>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5.636 5.636a9 9 0 1012.728 0M12 3v9" />
                        </svg>
                    </button>
                    </>
                )}
            </div>

    </div>
  )};

export default Home;