import { googleProvider, facebookProvider } from "../firebase/config";
import { useSocialSignup } from "../hooks/useSocialSignup";
import { useAuthContext } from "@/context/AuthContext";
import FacebookIcon from "../public/images/facebookIcon.png";
import GoogleIcon from "../public/images/googleIcon.png";
import { useEffect } from "react";
import Image from "next/image";

export default function Auth() {

  const google = useSocialSignup(googleProvider);
  const facebook = useSocialSignup(facebookProvider);

  const { user } = useAuthContext();

  useEffect(() => console.log(user), [user]);

  return (
      <div className="utility__page">

            <h1 className="mb-9 font-bold">Welcome to the Auth Page</h1>
            
            <button onClick={google.signInWithSocial} className="text-white bg-[#050708] hover:bg-[#050708]/90 focus:ring-4 focus:outline-none focus:ring-[#050708]/50 font-normal rounded-lg text-base px-12 py-1.5 text-center inline-flex items-center dark:focus:ring-[#050708]/50 dark:hover:bg-[#050708]/80 mr-2 mb-0">
              <Image src={GoogleIcon} alt="gg" />
              <span className='block rounded-full px-3 py-2 hover:text-white text-xl font-[courier]'>Google</span>
            </button>

            <button onClick={facebook.signInWithSocial} className="text-white bg-[#3b5998] hover:bg-[#3b5998]/90 focus:ring-4 focus:outline-none focus:ring-[#3b5998]/50 font-normal rounded-lg text-base px-10 py-1.5 text-center inline-flex items-center dark:focus:ring-[#3b5998]/55 mr-2 mb-0">
              <Image src={FacebookIcon} alt="fb" />
              <span className='block rounded-full px-3 py-2 hover:text-white text-xl font-[courier]'>Facebook</span>
            </button>

      </div>
  )
};