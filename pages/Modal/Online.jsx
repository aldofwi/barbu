import React, { useState, useEffect } from 'react';
import { useAuthContext } from '@/context/AuthContext';
import { onValue, ref } from 'firebase/database';
import { database } from '@/firebase/config';

const Online = ({ players }) => {

  const { user } = useAuthContext();
  // const [connected, setConnected] = useState([]);

  const [victories1, setVictories1] = useState(0);
  const [victories2, setVictories2] = useState(0);
  const [victories3, setVictories3] = useState(0);
  const [victories4, setVictories4] = useState(0);

  const victories = [victories1, victories2, victories3, victories4];

  useEffect(() => {

    // onValue(
    //   ref(database, 'users/' ), (snapshot) => {
    //     let users = [];
    //       snapshot.forEach((doc) => {
    //         users.push({...doc.val() });
    //       });
    //       setConnected(users);
    //   }
    // );

    onValue(
      ref(database, 'victories/'+players[0].uid+'/victories'), (snapshot) => {
        setVictories1(snapshot.val() === null ? 0 : snapshot.val());
      }
    );

    onValue(
      ref(database, 'victories/'+players[1].uid+'/victories'), (snapshot) => {
        setVictories2(snapshot.val() === null ? 0 : snapshot.val());
      }
    );

    onValue(
      ref(database, 'victories/'+players[2].uid+'/victories'), (snapshot) => {
        setVictories3(snapshot.val() === null ? 0 : snapshot.val());
      }
    );

    onValue(
      ref(database, 'victories/'+players[3].uid+'/victories'), (snapshot) => {
        setVictories4(snapshot.val() === null ? 0 : snapshot.val());
      }
    );

  }, []);

  console.log("Players", players);

  return (

    <div className='pt-10'>

      {players?.slice(0).map((person, i) => 
          <p className='text-center' key={i}> 🟢 {person.username} ➖ {victories[i]} wins</p>
      )}
    
    </div>

  )
}

export default Online;