
import { useState, useEffect } from "react";
import { useAuthContext } from "@/context/AuthContext";
import { signInWithPopup } from "firebase/auth";
import { auth } from "../firebase/config";

export const useSocialSignup = (provider) => {

    // State variables to manage sign-up process.
    const [error, setError] = useState(null);
    const [isPending, setIsPending] = useState(false);
    const [isCancelled, setIsCancelled] = useState(false);

    // Accessing the authentication context's dispatch function.
    const { dispatch } = useAuthContext();

    // Function to initiate the social sign-up process.
    const signInWithSocial = async () => {

        setError(null);
        setIsPending(true);

        try {
            const res = await signInWithPopup(auth, provider);
            dispatch({ type: "LOGIN", payload: res.user });

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
      return () => setIsCancelled(true);
    }, []);
    
    // Return values and functions for component usage.
    return { error, isPending, signInWithSocial }
};