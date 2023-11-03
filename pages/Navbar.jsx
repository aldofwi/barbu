"use client";

import React, { useState } from 'react';
import { useAuthContext } from '@/context/AuthContext';
import { useLogout } from '../hooks/useLogout';
import { Box, Stack, Img, Tooltip } from '@chakra-ui/react';
import Image from 'next/image';
import ALogo from '/public/images/logoA_trans.png';

const Navbar = () => {

    const { user } = useAuthContext();
    const { logout } = useLogout();
    
  return (
        
    <nav className="fixed mx-auto border border-[#33353F] top-0 left-0 right-0 z-10 bg-[#121212] bg-opacity-100">
        <div className="flex container lg:px-24 lg:py-4 flex-wrap items-center justify-between mx-auto px-24 py-2">

                <Image 
                    src={ALogo}
                    width={50}
                    alt="AldoIcon"
                />
            <div>
            <Stack direction='row'>
                <ul className="font-[Stanley] flex">
                    <li className='px-6 py-4'>
                        <button className="text-blue-500 hover:text-white font-bold">Rules</button>
                    </li>
                    <li className='px-6 py-4'>
                        <button className="text-blue-500 hover:text-white font-bold">Scored</button>
                    </li>
                    <li className='px-6 py-4'>
                        <button className="text-blue-500 hover:text-white font-bold">Online</button>
                    </li>
                    <li className='px-6 py-2'>
                        <Img
                            src={user.photoURL}
                            borderRadius='full'
                            boxSize='40px'
                            alt="pp" />
                    </li>
                    <li className="px-6 py-3">
                    <Tooltip hasArrow label='Log Out' bg='white'>
                        <button 
                            type="button"
                            className="px-5 py-4 font-medium rounded-full text-center text-white inline-flex items-center bg-[#d05454] hover:bg-[#d05454]/90" 
                            data-tooltip-target="tooltip-bottom" 
                            data-tooltip-placement="bottom"
                            onClick={logout}>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M5.636 5.636a9 9 0 1012.728 0M12 3v9" />
                            </svg>
                        </button>
                    </Tooltip>
                    </li>
                    
                </ul>
                </Stack>
            </div>

        </div>                   
    </nav>

  )
}

export default Navbar;

/*
<Image
                            loader={myLoader}
                            unoptimized
                            src={ user.photoURL } 
                            className="profile_img"
                            objectFit='fill'
                            width="10"
                            height="10"
                            alt="pp" />

                        <Image
                            loader={myLoader}
                            unoptimized
                            src={ user.photoURL } 
                            className="profile_img"
                            width={1}
                            height={1}
                            alt="pp" />


                        <img 
                            src={user.photoURL} 
                            alt="pp" />
*/