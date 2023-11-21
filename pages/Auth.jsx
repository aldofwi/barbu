import { googleProvider, facebookProvider, githubProvider } from "../firebase/config";
import { Card, CardHeader, CardBody, Heading, Stack, StackDivider, Box } from "@chakra-ui/react";
import { useSocialSignup } from "../hooks/useSocialSignup";
import { useAuthContext } from "@/context/AuthContext";
import FacebookIcon from "../public/images/facebookIcon.png";
import GoogleIcon from "../public/images/googleIcon.png";
import GithubIcon from "../public/images/gitLogo.png";
import { useEffect } from "react";
import Image from "next/image";

export default function Auth() {

  const google = useSocialSignup(googleProvider);
  const facebook = useSocialSignup(facebookProvider);
  const github = useSocialSignup(githubProvider);

  const { user } = useAuthContext();

  useEffect(() => console.log(user), [user]);

  return (
      <div className="utility__page">

            <Card>
              <CardHeader>
                <Heading className="text-5xl font-bold" align='center' size='md'>Sign Up</Heading>
              </CardHeader>

              <CardBody>
                <Stack divider={<StackDivider />} spacing='4'>
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

// <div className="auth_title mb-9 text-5xl font-bold">Welcome to Barbu</div>
