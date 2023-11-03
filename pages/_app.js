import { AuthContextProvider } from '@/context/AuthContext';
import { ChakraProvider } from '@chakra-ui/react';
import '@/styles/globals.css';

export default function App({ Component, pageProps }) {

  return (
    <AuthContextProvider>
      <ChakraProvider>
        <Component {...pageProps} />
      </ChakraProvider>
    </AuthContextProvider>
  )
};
