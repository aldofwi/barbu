import { useAuthContext } from '@/context/AuthContext';
import React from 'react'

const BoardGame = () => {

    const { user } = useAuthContext();

  return (

    <div className="boardgame h-screen flex flex-col bg-[#121212] text-white container justify-center items-center">
    
        <div className="absolute right-10 justify-center">
            Player 4
        </div>
        <div className="absolute top-10 justify-center">
            Player 3
        </div>
        <div className="absolute left-10 justify-center">
            Player 2
        </div>
        <div className="absolute bottom-10 justify-center">
            Player 1
        </div>
        
    </div>

  )
}

export default BoardGame;