import React from 'react';
import { useAuthContext } from '@/context/AuthContext';
import { collection } from 'firebase/firestore';
import { db } from '@/firebase/config';

const Online = () => {

  const { user } = useAuthContext();
  const usersRef = collection(db, "users");

  return (

    <div>Users Connected</div>

  )
}

export default Online;