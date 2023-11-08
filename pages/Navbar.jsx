"use client";

import React, { useState } from 'react';
import { useAuthContext } from '@/context/AuthContext';
import { useLogout } from '../hooks/useLogout';
import { Button, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, useDisclosure } from '@chakra-ui/react';
import { Box, Stack, Img, Tooltip } from '@chakra-ui/react';
import Image from 'next/image';
import ALogo from '/public/images/logoA_trans.png';


const Navbar = () => {

    const { user } = useAuthContext();
    const { logout } = useLogout();
    const myLoader = ({ src }) => {
        return user.photoURL;
    }
    // Modal settings.
    const { isOpen, onOpen, onClose } = useDisclosure();
    const handleModal = () => {
        onOpen();
    }
    
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
                        <button onClick={() => handleModal()} className="text-blue-500 hover:text-white font-bold">Rules</button>
                    </li>
                    <li className='px-6 py-4'>
                        <button className="text-blue-500 hover:text-white font-bold">Score</button>
                    </li>
                    <li className='px-6 py-4'>
                        <button className="text-blue-500 hover:text-white font-bold">Online</button>
                    </li>
                    <li className='px-6 py-2'>
                        <Tooltip label={user?.displayName} bg='burlywood' textColor="black">
                            <Image
                                className="profile_img"
                                src={user?.photoURL}
                                borderRadius='full'
                                boxSize='40px'
                                loader={myLoader}
                                width={30}
                                height={30}
                                alt="pp" />
                        </Tooltip>
                    </li>
                    <li className="px-6 py-3">
                    <Tooltip hasArrow label='Log Out' bg='white' textColor="black">
                        <button 
                            type="button"
                            className="px-5 py-4 font-medium rounded-full text-center text-white inline-flex items-center bg-[#d05454] hover:bg-[#d05454]/90" 
                            data-tooltip-target="tooltip-bottom" 
                            data-tooltip-placement="bottom"
                            onClick={() => { if(confirm("Are you sure you want to log out ?") == true) logout}}>
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
        
        <>
            <Modal onClose={onClose} size={'full'} isOpen={isOpen}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader align='center'>Les Règles du Barbu</ModalHeader>
                    <ModalCloseButton />

                    <ModalBody>
                        <React.Fragment>
                            <span align="center" className="textrules"><dd>
                            Chacun des 4 joueurs doit effectuer <b>7 contrats</b>.<br></br>
                            Celui qui démarre est désigné par le tirage au sort.<br></br>
                            La carte la plus forte commence à faire ses contrats.<br></br>
                            Celui qui effectue ses contrats apparaît en <span className="text-red-500">ROUGE</span>.<br></br>
                            </dd></span><br></br>
                        </React.Fragment>

                        <table>
                        <tbody>
                        <tr>
                            <React.Fragment>
                
                            <th align='center' className='px-72'>
                                <span className="tit4"><h5>DERNIER PLI 🎖</h5></span>
                                <span className="textrules">
                                Celui qui récupère le <b>DERNIER PLI</b> perd <b><span className="crr">25 points</span></b>.<br></br><br></br>
                                </span>
                
                                <span className="tit4"><h5>PLIS 🀄️</h5></span>
                                <span className="textrules">
                                Vous perdrez <b><span className="crr">5 points</span></b> pour chaque pli récupéré.<br></br>
                                Celui qui récupère <b>TOUS LES PLIS</b> gagne <b><span className="cg">+40 points</span></b>.<br></br><br></br>
                                </span>
                
                                <span className="tit4"><h5>COEURS ♥️</h5></span>
                                <span className="textrules">
                                Vous perdrez <b><span className="crr">5 points</span></b> pour chaque ♥️ contenu dans vos plis.<br></br>
                                Celui qui récupère <b>TOUS LES COEURS</b> gagne <b><span className="cg">+40 points</span></b>.<br></br><br></br>
                                </span>
                
                                <span className="tit4"><h5>DAMES 👸🏽</h5></span>
                
                                <span className="textrules">
                                Vous perdrez <b><span className="crr">10 points</span></b> par dame contenue dans vos plis.<br></br>
                                Celui qui récupère <b>TOUTES LES DAMES</b> gagne <b><span className="cg">+40 points</span></b>.<br></br><br></br>
                                </span>
                                
                            </th>
                
                            <th align='center' className='px-4'>
                
                                <span className="tit4"><h5>BARBU 🎅🏾</h5></span>
                                <span className="textrules">Celui qui récupère le Barbu (<b>Roi de ♥️</b>) perd <b><span className="crr">40 points</span></b>.<br></br><br></br></span>
                                
                                <span className="tit4"><h5>DOMINO 🎲</h5></span>
                                <span className="textrules">
                
                                C&apos;est le même principe que le jeu du Domino classic.<br></br>
                                On commence <b>OBLIGATOIREMENT</b> par un <b>Valet</b>.<br></br>
                                Il va falloir poser les cartes <b>dans l&apos;ordre de leur valeur</b>.<br></br>
                                <i>Exemple</i> : (A.R.D.<span className="cb">V</span>.10.9.8.7)<br></br>
                                Celui qui n&apos;a plus de cartes en main gagne le Domino.<br></br>
                                <b>1er : <span className="cg">+50 points</span> | 2e : <span className="cg">+25 points</span> | 3e : 0 | 4e : <span className="crr">-25 points</span></b><br></br><br></br>
                                
                                </span>
                                
                                <span className="tit4"><h5>RATA 🔥</h5></span>
                                <span className="textrules">
                
                                La RATA rassemble <b>TOUS LES CONTRATS</b> sauf le Domino.<br></br>
                                Celui qui récupère <b>TOUS LES PLIS</b> de la RATA<br></br>
                                gagne <b><span className="cg">+185 points</span></b>.<br></br><br></br>
                                </span>
                
                            </th>
                                
                            </React.Fragment>
                        </tr>
                        </tbody>
                        </table>
                

                        <React.Fragment>
                            <span align="center" className="textrules">
                                <dd>Au bout des <b>28 contrats</b>, le score <b>le plus élevé</b> gagne la partie!</dd>
                            </span>    
                        </React.Fragment>
                        
                    </ModalBody>

                    <ModalFooter>
                        <Button onClick={onClose}>Close</Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>

    </nav>

  )
}

export default Navbar;