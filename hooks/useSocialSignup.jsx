
import { useState, useEffect } from "react";
import { useAuthContext } from "@/context/AuthContext";
import { signInWithPopup } from "firebase/auth";

import { auth, database } from "../firebase/config";
import { push, ref, serverTimestamp, set } from "firebase/database";
import { useToast } from "@chakra-ui/react";

export const useSocialSignup = (provider) => {
    
    const toast = useToast();
    const { user } = useAuthContext();

    // State variables to manage sign-up process.
    const [error, setError] = useState(null);
    const [isPending, setIsPending] = useState(false);
    const [isCancelled, setIsCancelled] = useState(false);

    // Accessing the authentication context's dispatch function.
    const { dispatch } = useAuthContext();

    const recordUser = async (response) => {

        set(ref(database, 'users/' + response.user.uid), {
            username: response.user.displayName,
            email: response.user.email,
            picture: response.user.photoURL,
        });

        console.log("-> New user recorded :", response.user.displayName);

        toast({
            title: "You are logged in as " + response.user.displayName,
            status: "success",
            duration: 2000,
            position: "top",
        });

        const msgRef = ref(database, 'messages/');
        const newItem = await push(msgRef);

        set(newItem, 
            {
                createdAt: serverTimestamp(),
                msg: response.user.displayName+" has just connected!",
                name: "[J@rvis]",
                uid: "basic101",
            });
    }

    // Function to initiate the social sign-up process.
    const signInWithSocial = async () => {

        setError(null);
        setIsPending(true);

        try {
            const res = await signInWithPopup(auth, provider);
            dispatch({ type: "LOGIN", payload: res.user });
            recordUser(res);

            if(!isCancelled) {
                setIsPending(false);
                setError(null);
            }

        } catch (err) {
            setError(err.message);
            setIsPending(false);
        }

    };

    useEffect(() => {

      return () => {
        setIsCancelled(true);
      }
    }, []);
    
    // Return values and functions for component usage.
    return { error, isPending, signInWithSocial }
};
