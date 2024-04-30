"use client";

import React, { useState } from 'react';
import { useAuthContext } from '@/context/AuthContext';
import { useLogout } from '../hooks/useLogout';
import { Button, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, useDisclosure } from '@chakra-ui/react';
import { Box, Stack, Img, Tooltip } from '@chakra-ui/react';
import Image from 'next/image';
import ALogo from '/public/images/logoA_trans.png';
import Rules from './Modal/Rules';
import Score from './Modal/Score';
import Online from './Modal/Online';

const Navbar = ({ playersNav }) => {

    const { user } = useAuthContext();
    const { logout } = useLogout();

    const myLoader = ({ src }) => { return user.photoURL };
    
    // Modal settings.
    const { isOpen: isRulesOpen, onOpen: onRulesOpen, onClose: onRulesClose } = useDisclosure();
    const handleRulesModal = () => onRulesOpen();

    const { isOpen: isScoreOpen, onOpen: onScoreOpen, onClose: onScoreClose } = useDisclosure();
    const handleScoreModal = () => onScoreOpen();

    const { isOpen: isOnlineOpen, onOpen: onOnlineOpen, onClose: onOnlineClose } = useDisclosure();
    const handleOnlineModal = () => onOnlineOpen();
    
    
  return (
        
    <nav className="fixed mx-auto border border-[#33353F] top-0 left-0 right-80 z-10 bg-[#121212] bg-opacity-100">
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
                        <button onClick={() => handleRulesModal()} className="text-blue-500 hover:text-white font-bold">Rules</button>
                        <Modal onClose={onRulesClose} size={'5xl'} isOpen={isRulesOpen}>
                            <ModalOverlay />
                            <ModalContent>
                                <ModalHeader align='center'>📜 Règles du Barbu</ModalHeader>
                                <ModalCloseButton />

                                <ModalBody>
                                    <Rules />
                                </ModalBody>

                                <ModalFooter>
                                    <Button alignItems='center' onClick={onRulesClose}>Close</Button>
                                </ModalFooter>
                            </ModalContent>
                        </Modal>
                    </li>

                    {
                        playersNav?.length !== 0 
                            ?
                    <li className='px-6 py-4'>
                        <button onClick={() => handleScoreModal()} className="text-blue-500 hover:text-white font-bold">Score</button>
                        <Modal onClose={onScoreClose} size={'4xl'} isOpen={isScoreOpen}>
                            <ModalOverlay />
                            <ModalContent>
                                <ModalHeader align='center'>📊 Scores</ModalHeader>
                                <ModalCloseButton />

                                <ModalBody>
                                    <Score players={playersNav} />
                                </ModalBody>

                                <ModalFooter>
                                    <Button align='center' onClick={onScoreClose}>Close</Button>
                                </ModalFooter>
                            </ModalContent>
                        </Modal>
                    </li>
                            :
                            null
                    }

                    <li className='px-6 py-4'>
                        <button onClick={() => handleOnlineModal()} className="text-blue-500 hover:text-white font-bold">Online</button>
                        <Modal onClose={onOnlineClose} size={'xl'} isOpen={isOnlineOpen}>
                            <ModalOverlay />
                            <ModalContent>
                                <ModalHeader align='center'>📲 Users connected</ModalHeader>
                                <ModalCloseButton />

                                <ModalBody>
                                    <Online />
                                </ModalBody>

                                <ModalFooter>
                                    <Button onClick={onOnlineClose}>Close</Button>
                                </ModalFooter>
                            </ModalContent>
                        </Modal>
                    </li>
                    {user?.photoURL &&
                        <li className='px-6 py-2'>
                            <Tooltip label={user?.displayName} bg='burlywood' textColor="black">
    
                                    <Image
                                        className="profile_img"
                                        src={user?.photoURL}
                                        unoptimized
                                        loader={myLoader}
                                        width={30}
                                        height={30}
                                        alt="pp" />
                                
                            </Tooltip>
                        </li>
                    }
                    <li className="pl-8 pr-12 py-3">
                    <Tooltip hasArrow label='Log Out' bg='white' textColor="black">
                        <button 
                            type="button"
                            className="px-5 py-4 font-medium rounded-full text-center text-white inline-flex items-center bg-[#d05454] hover:bg-[#d05454]/90" 
                            data-tooltip-target="tooltip-bottom" 
                            data-tooltip-placement="bottom"
                            onClick={() => { if(confirm("Are you sure you want to log out ?") == true) logout() }}>
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