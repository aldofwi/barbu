import { useAuthContext } from "@/context/AuthContext";
import Head from "next/head";
import Auth from "./Auth";
import Home from "./Home";

export default function App() {

    const { user, authIsReady } = useAuthContext();
    // No Comment
    if(!authIsReady) return null;
 
    return (
            
        <main>
            <Head>
                <title>Barbu 🎅🏾</title>
                <meta property="og:barbu" title="The Barbu" key="barbu" />
            </Head>
            {
                user ? <Home /> : <Auth />
            }
        </main>
    );
  };