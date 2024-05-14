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
        setVictories1(snapshot.val());
      }
    );

    onValue(
      ref(database, 'victories/'+players[1].uid+'/victories'), (snapshot) => {
        setVictories2(snapshot.val());
      }
    );

    onValue(
      ref(database, 'victories/'+players[2].uid+'/victories'), (snapshot) => {
        setVictories3(snapshot.val());
      }
    );

    onValue(
      ref(database, 'victories/'+players[3].uid+'/victories'), (snapshot) => {
        setVictories4(snapshot.val());
      }
    );

  }, []);

  console.log("Players", players);

  // console.log("Connected[0].uid", connected[0].uid);
  // console.log("Connected[1].uid", connected[1].uid);
  // console.log("Connected[2].uid", connected[2].uid);
  // console.log("Connected[3].uid", connected[3].uid);

  console.log("Connected victories1 :", victories1);
  console.log("Connected victories2 :", victories2);
  console.log("Connected victories3 :", victories3);
  console.log("Connected victories4 :", victories4);

  console.log("Connected victories :", victories);

  return (

    <div className='pt-10'>

      {players.slice(0).map((person, i) => 
          <p className='text-center' key={i}> 🟢 {person.username} ➖ {victories[i]} wins</p>
      )}
    
    </div>

  )
}

export default Online;