import { useAuthContext } from '@/context/AuthContext';
import { useState } from 'react';
import Board from './Board';
import DeckChoice from './DeckChoice';
import PlayerBox from './PlayerBox';

const BoardGame = () => {

    const { user } = useAuthContext();
    const [isOrderSet, setIsOrderSet] = useState(false);

    const positions = [
        'absolute bottom-10 justify-center',
        'absolute left-10   justify-center',
        'absolute top-10    justify-center',
        'absolute right-10  justify-center',
    ];

    // getPositionByID when Order is setted.
    // pass positions to PlayerBox props.

    // Map players from database.


  return (

    <div className="boardgame h-screen flex flex-col bg-[#121212] text-white container justify-center items-center">
    
    {
        isOrderSet
            ?
        <div>
            <div className={`${positions[getPositionByID()]}`}>
                <PlayerBox

                />
            </div>

            <Board />
        </div>
            :
        <DeckChoice />
    }


        
    </div>

  )
}

export default BoardGame;