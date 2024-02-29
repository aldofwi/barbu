
import { useState, useEffect } from "react";
import { useAuthContext } from "@/context/AuthContext";
import { getAuth, sendSignInLinkToEmail, isSignInWithEmailLink, signInWithEmailLink } from "firebase/auth";

import { auth, database } from "../firebase/config";
import { push, ref, serverTimestamp, set } from "firebase/database";
import { useToast } from "@chakra-ui/react";

export const useEmailSignup = (provider) => {
    
    const { user } = useAuthContext();

    const auth = getAuth();
    const toast = useToast();

    // Accessing the authentication context's dispatch function.
    const { dispatch } = useAuthContext();

    const actionCodeSettings = {
        // URL you want to redirect back to. The domain (www.example.com) for this
        // URL must be in the authorized domains list in the Firebase Console.
        // https://barbu.vercel.app/
        url: 'http://localhost:3000/LOGIN',
        handleCodeInApp: true,
      };

    // State variables to manage sign-up process.
    const [error, setError] = useState(null);
    const [isPending, setIsPending] = useState(false);
    const [isCancelled, setIsCancelled] = useState(false);


    const recordUser = async (response) => {

        set(ref(database, 'users/' + response.user.uid), {
            //username: response.user.displayName,
            email: response.user.email,
            //picture: response.user.photoURL,
        });
  
        console.log("-> New user recorded :", response.user.email);
  
        toast({
            title: "You are logged in as " + response.user.email,
            status: "success",
            duration: 2000,
            position: "top",
        });
  
        const msgRef = ref(database, 'messages/');
        const newItem = await push(msgRef);
  
        set(newItem, 
            {
                createdAt: serverTimestamp(),
                msg: response.user.email+" has just connected!",
                name: "[J@rvis]",
                uid: "basic101",
            });
    }

    // Function to initiate the email sign-up process.
    const signInWithEmail = async (email) => {

        alert(email);
        setError(null);
        setIsPending(true);

        sendSignInLinkToEmail(auth, email, actionCodeSettings)
            .then(() => {
                // The link was successfully sent. Inform the user.
                // Save the email locally so you don't need to ask the user for it again
                // if they open the link on the same device.
                window.localStorage.setItem('emailForSignIn', email);
                alert('The link was successfully sent.');
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                setIsCancelled(true);
                console.log("("+errorCode+")"+ errorMessage);
            });

        if(!isCancelled) {
            setIsPending(false);
            setError(null);
        }

    
        if(isSignInWithEmailLink(auth, window.location.href)) {
    
            let email = window.localStorage.getItem('emailForSignIn');
            // if(!email) {
            //     email = window.prompt('Please provide your email for confirmation');
            // }
        
            signInWithEmailLink(auth, email, window.location.href)
                .then(() => {
                    window.localStorage.getItem('emailForSignIn');
            
                    toast({
                        title: "You are logged in as " + email,
                        status: "success",
                        duration: 2000,
                        position: "top",
                    });
                })
                .catch((error) => {
                    console.error(error.code + " - " + error.message);
                    toast({
                        title: "[" + errorCode + "] " + errorMessage,
                        status: "error",
                        duration: 9000,
                        position: "top",
                    });  
                });
    
            dispatch({ type: "LOGIN", payload: res.user });
            recordUser(res);
        }


    };

    useEffect(() => {

        return () => {
          setIsCancelled(true);
        }
      }, []);
      
    // Return values and functions for component usage.
    return { error, isPending, signInWithEmail }
}
