import { auth } from "@/pages/firebase/config";
import { onAuthStateChanged } from "firebase/auth";
import { createContext, useReducer, useEffect, useContext } from "react";

export const AuthContext = createContext();

// Manage auth states for Auth related actions.
export const authReducer = (state, action) => {

    switch(action.type) {
        // "LOGIN" : update the state with new user info.
        case "LOGIN" : 
            return { ...state, user: action.payload };

        // "LOGOUT" : update the state to remove user info.
        case "LOGOUT" :
            return { ...state, user: null };
        
        // "AUTH_IS_READY" : update the state with user info
        // and set a state to indicate the process is complete.
        case "AUTH_IS_READY" :
            return { user: action.payload, authIsReady: true };

        // For other actions, just return the state with no changes.
        default : 
            return state;
    }
};

// Authentication context provider component.
export const AuthContextProvider = ({ children }) => {

    // Initialize authentication state using a reducer.
    const [state, dispatch] = useReducer(authReducer, {
        user: null,
        authIsReady: false,
    });

    // Effect to determine initial authentication state and update context
    useEffect(() => {

        // Subscribe to authentication state changes.
        const unsub = onAuthStateChanged(auth, (user) => {

            // Dispatch an action to update the state with user info.
            dispatch({ type: "AUTH_IS_READY", payload: user });

            // Unsubscribe to avoid further unnecessary updates.
            unsub(); // Unsub once the initial auth state is determined.
        });
    }, []);

    // Provide authentication state and dispatch function to children components
    return(
        <AuthContext.Provider value={{ ...state, dispatch }}>
            { children }
        </AuthContext.Provider>
    );
};

// Custom hook to access the authentication context.
export function useAuthContext() {

    // Get the authentication context from the nearest AuthContextProvider.
    const context = useContext(AuthContext);

    // Check if the context was successfully obtained.
    if(!context) {
        throw Error("useAuthContext must be used inside an AuthContextProvider");
    }

    // Return the authentication context object for use in components.
    return context;
};