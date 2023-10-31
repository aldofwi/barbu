import { useAuthContext } from "@/context/AuthContext";
import Auth from "./Auth";
import Home from "./Home";

export default function App() {

    const { user, authIsReady } = useAuthContext();

    if(!authIsReady) return null;

    return (
        {user} ? 
                <>
                <Home />
                </>
             : 
                <>
                <Auth />
                </>
            
    );
  };