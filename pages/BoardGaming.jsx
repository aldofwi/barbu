import { useAuthContext } from '@/context/AuthContext';
import { database } from '@/firebase/config';
import { onValue, ref } from 'firebase/database';
import React, { useEffect, useState } from 'react'

const BoardGaming = () => {

    const { user } = useAuthContext();

    const [amIContractor, setAmIContractor] = useState(false);

    useEffect(() => {

        onValue(
          ref(database, 'game/contractor/uid' ), (snapshot) => {
            setAmIContractor(snapshot.val() === user.uid);
          }
        );

    }, []);
    
    console.log("Contractor : "+amIContractor);
    
  return (
    <div className='boardgame h-screen bg-[#121212] text-white container justify-center items-center'>
        
        <div className="choiceTitle">BoardGaming
        <p>Contractor : {amIContractor ? "True" : "False"} </p>
        </div>

    </div>
  )

}

export default BoardGaming;