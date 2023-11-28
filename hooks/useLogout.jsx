import React from 'react'
import { auth, database } from '../firebase/config';
import { signOut } from 'firebase/auth';
import { useState, useEffect } from 'react';
import { useAuthContext } from '@/context/AuthContext';
import { push, ref, remove, serverTimestamp, set } from 'firebase/database';

export const useLogout = () => {
    
    const { user } = useAuthContext();
    
    // Error state for potential errors during logout.
    const [error, setError] = useState(null);
    // State to indicate if logout is in progress.
    const [isPending, setIsPending] = useState(false);
    // State to track if the operation is cancelled.
    const [isCancelled, setIsCancelled] = useState(false);
    // Accessing the Auth Context dispatch function.
    const { dispatch } = useAuthContext();

    const logout = async () => {

        setError(null);     // Clearing any previous error.
        setIsPending(true); // Indicating logout in progress.

        try {
            await remove(ref(database, 'users/' + user.uid));
                        
            // Initiating the logout using Firebase's signout function.
            await signOut(auth);
            dispatch({ type : "LOGOUT" });

            console.log("-> user", user.displayName, "removed.");
            const msgRef = ref(database, 'messages/');
            const newItem = await push(msgRef);
            set(newItem, 
                {
                    createdAt: serverTimestamp(),
                    msg: user.displayName+" has left.",
                    name: "[J@rvis]",
                    uid: "basic101",
                });

            // If the operation wasn't cancelled, reset pending state and error.
            if(!isCancelled) {
                setIsPending(false);    // Resetting isPending after asynchronous call completes.
                setError(null);         // Clearing any error that might have occured.       
            }
            
        } catch (err) {
            // Handling logout error
            if(!isCancelled) {
                console.log(err.message);   // Logging error msg.
                setError(err.message);      // Setting if error.
                setIsPending(false);        // Resetting pending state.
            }
        }
    }

    // Effect hook to set isCancelled to true when component unmount.
    useEffect(() => {

      return () => {
        setIsCancelled(true);
    }
      // Clean up function runs when component unmounts.
    }, []);

  return { logout, error, isPending };
};