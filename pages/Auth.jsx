import { googleProvider, facebookProvider, githubProvider, database } from "../firebase/config";
import { Card, CardHeader, CardBody, Heading, Input, Stack, StackDivider, Box, useToast } from "@chakra-ui/react";
import { push, ref, serverTimestamp, set } from "firebase/database";
import { useSocialSignup } from "../hooks/useSocialSignup";
import { useAuthContext } from "@/context/AuthContext";

import FacebookIcon from "../public/images/facebookIcon.png";
import GoogleIcon from "../public/images/googleIcon.png";
import GithubIcon from "../public/images/gitLogo.png";
import someUser from '/public/images/unknow.png';
import Image from "next/image";

import { useEffect, useState } from "react";
import { getAuth, sendSignInLinkToEmail, isSignInWithEmailLink, signInWithEmailLink } from "firebase/auth";

export default function Auth() {

  const auth = getAuth();
  const { user, dispatch } = useAuthContext();
  const toast = useToast();

  const google = useSocialSignup(googleProvider);
  const facebook = useSocialSignup(facebookProvider);
  const github = useSocialSignup(githubProvider);

  const [email, setEmail] = useState("");

  const [loginLoading, setLoginLoading] = useState(false);
  const [loginError, setLoginError] = useState("");
  const [infoMsg, setInfoMsg] = useState("");

  const [initialLoading, setInitialLoading] = useState(false);
  const [initialError, setInitialError] = useState("");

  const handleMail = async (e) => {
    e.preventDefault();
    setLoginLoading(true);

    sendSignInLinkToEmail(auth, email, {        
      url: "http://localhost:3000/",
      handleCodeInApp: true,})
      .then(() => {
          // The link was successfully sent. Inform the user.
          // Save the email locally so you don't need to ask the user for it again
          // if they open the link on the same device.
          localStorage.setItem('emailForSignIn', email);
          setLoginLoading(false);
          setLoginError("");
          setInfoMsg("We have sent you an email with a link to sign in.")
      })
      .catch((error) => {
          setLoginLoading(false);
          setLoginError("["+error.code+"] "+ error.message);
      });
  }

  useEffect(() => {
    
    const recordUserMail = async (response) => {

      let mail = response.user.email;
      let name = mail.slice(0, mail.indexOf('@'));

      console.log("Record // Email = ", mail);
      console.log("Record // Name = ", name);
      console.log("Response // User = ", response.user);
      console.log("AuthContext // User = ", user);
  
      set(ref(database, 'users/' + response.user.uid), {
          username: name,
          email: response.user.email,
          picture: "https://e7.pngegg.com/pngimages/416/62/png-clipart-anonymous-person-login-google-account-computer-icons-user-activity-miscellaneous-computer-thumbnail.png",
      });
  
      console.log("-> New user recorded :", name);
  
      toast({
          title: "You are logged in as " + name,
          status: "success",
          duration: 2000,
          position: "top",
      });
  
      const msgRef = ref(database, 'messages/');
      const newItem = await push(msgRef);
  
      set(newItem, 
          {
              createdAt: serverTimestamp(),
              msg: name+" has just connected!",
              name: "[J@rvis]",
              uid: "basic101",
          });
    }

    // user not signed in but link is valid.
    if(isSignInWithEmailLink(auth, window.location.href)) {
      // In case user clicks link on a different device, email confirmat° asked.
      let email = localStorage.getItem('emailForSignIn');
      if(!email) {
          email = window.prompt('Please provide your email.');
      }
      // And complete log in process
      setInitialLoading(true);
      signInWithEmailLink(auth, email, window.location.href)
      .then((result) => {

          result.user.displayName = result.user.email.slice(0, result.user.email.indexOf('@'));;
          result.user.photoURL = "https://e7.pngegg.com/pngimages/416/62/png-clipart-anonymous-person-login-google-account-computer-icons-user-activity-miscellaneous-computer-thumbnail.png";
          
          console.log("Res User Email = ", result.user.email);
          localStorage.removeItem('emailForSignIn');
  
          setInitialLoading(false);
          setInitialError("");
          dispatch({ type: "LOGIN", payload: result.user });
          recordUserMail(result);
      })
      .catch((error) => {
          setInitialLoading(false);
          setInitialError(error.message);
      })
  } else console.log("Enter email & Sign In.");

  }, [auth, dispatch, toast, user]);

  
  return (

      <div className="utility__page">

            <Card>
              <CardHeader>
                <Heading className="text-5xl font-bold" align='center' size='md'>Sign Up</Heading>
              </CardHeader>

              <CardBody>
                <Stack divider={<StackDivider />} spacing='4'>
                  <Box>
                    {
                      initialLoading ? (
                        <div className="text-blue-500">Loading...</div>
                      ) : (
                        initialError !== '' ? (
                            <div className="text-red-600">{initialError}</div>
                          ) : null
                          )
                    }

                  <form onSubmit={handleMail}>
                    <Input 
                      required 
                      name="email" 
                      id="email" 
                      type="email" 
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email" 
                      className="text-white px-6" 
                      value={email || ""} />
                    <button type="submit" className="text-white w-full bg-[#050708] hover:bg-[#050708]/30 focus:ring-4 focus:outline-none focus:ring-[#050708]/50 font-normal rounded-lg text-base px-14 py-1.5 text-center inline-flex items-center dark:focus:ring-[#050708]/50 dark:hover:bg-[#050708]/30 mr-2 mb-0 mt-2">
                      {loginLoading ? (
                        <span className='block rounded-full px-3 py-2 hover:text-white text-xl font-[courier]'> Logging you in.. </span>
                      ) 
                        : (
                          <span className='block rounded-full px-3 py-2 hover:text-white text-xl font-[courier]'> Log IN </span>
                        )
                      }
                    </button>

                      {loginError !== "" && (
                          <div className="text-red-600">{loginError}</div>
                      )}
                      
                      {infoMsg !== "" && (
                        <div className="text-blue-500">{infoMsg}</div>
                      )}                     
                    
                  </form>

                  </Box>
                  <Box>
                    <button onClick={google.signInWithSocial} className="text-white bg-[#050708] hover:bg-[#050708]/30 focus:ring-4 focus:outline-none focus:ring-[#050708]/50 font-normal rounded-lg text-base px-14 py-1.5 text-center inline-flex items-center dark:focus:ring-[#050708]/50 dark:hover:bg-[#050708]/30 mr-2 mb-0">
                      <Image src={GoogleIcon} alt="gg" />
                      <span className='block rounded-full px-3 py-2 hover:text-white text-xl font-[courier]'> Google </span>
                    </button>
                  </Box>
                  <Box>
                    <button onClick={facebook.signInWithSocial} className="text-white bg-[#3b5998] hover:bg-[#3b5998]/60 focus:ring-4 focus:outline-none focus:ring-[#3b5998]/50 font-normal rounded-lg text-base px-12 py-1.5 text-center inline-flex items-center dark:focus:ring-[#3b5998]/70 mr-2 mb-0">
                      <Image src={FacebookIcon} alt="fb" />
                      <span className='block rounded-full px-3 py-2 hover:text-white text-xl font-[courier]'>Facebook</span>
                    </button>
                  </Box>
                  <Box>
                    <button onClick={github.signInWithSocial} className="text-white bg-[#24292F] hover:bg-[#24292F]/90 focus:ring-4 focus:outline-none focus:ring-[#24292F]/50 font-normal rounded-lg text-base px-14 py-1.5 text-center inline-flex items-center dark:focus:ring-gray-500 dark:hover:bg-[#050708]/70 mr-2 mb-2">
                      <Image src={GithubIcon} alt="gh" />
                      <span className='block rounded-full px-3 py-2 hover:text-white text-xl font-[courier]'> Github </span>
                    </button>
                  </Box>
                </Stack>
              </CardBody>
            </Card>

      </div>
  )
};
