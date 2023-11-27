import React, { useState, useEffect } from 'react';
import { useAuthContext } from '@/context/AuthContext';
import { onValue, ref } from 'firebase/database';
import { database } from '@/firebase/config';

const Online = () => {

  const { user } = useAuthContext();
  const [connected, setConnected] = useState([]);

  useEffect(() => {

    onValue(
      ref(database, 'users/' ), (snapshot) => {
        let users = [];
          snapshot.forEach((doc) => {
            users.push({...doc.val() });
          });
          setConnected(users);
      }
    );

  }, []);
  // console.log("Connected : ", connected);

  return (

    <div>

      {connected.slice(0).map((person, i) => 
          <p className='text-center' key={i}> 🟢 {person.username} </p>
      )}
    
    </div>

  )
}

export default Online;