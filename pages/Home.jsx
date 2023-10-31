
import React from 'react';
import { useAuthContext } from '@/context/AuthContext';
import Image from 'next/image';

const Home = () => {

    const { user } = useAuthContext();

    const myLoader = ({ src }) => {
        return user.photoURL;
    }

    // console.log(user.photoURL);

  return (
    <div className="utility__page">

            <div className="h-screen flex flex-col bg-[#121212] container justify-center items-center">
                <h1 className="text-white font-mono font-bold">Hello World !</h1>

                {user && (
                    <div className="user">
                        <p>You&apos;re logged in as :</p>
    
                        <span>{ user.displayName }</span>
                        <Image 
                            loader={myLoader}
                            src={ user.photoURL } 
                            className="profile_img"
                            width={3}
                            height={3}
                            alt="pp" />
                    </div>
                )}
            </div>

    </div>
  )
};

export default Home;