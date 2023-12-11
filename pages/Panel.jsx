import { Box, Card, CardBody, CardHeader, Heading, Stack, StackDivider } from '@chakra-ui/react';
import React from 'react'

const Panel = () => {

  const handleClick = () => {
    alert("Panel click !");
  }

  const handlePli = () => {

    

  }
  
  // If contract X is done -->
  // cursor-not-allowed bg-[grey]

  return (

    <div className='utility__panel'>

      <Card>
        <CardHeader>
          <Heading className="text-5xl font-bold" align='center' size='md'>Choose One</Heading>
        </CardHeader>

        <CardBody>


        <Stack divider={<StackDivider />} spacing='1' align='center'>
        
          <Box>
            <button onClick={() => handleClick()} className="text-white bg-[#050708] hover:bg-[#fff] hover:text-blue-500 focus:ring-4 focus:outline-none focus:ring-[#050708]/50 font-normal rounded-lg text-base px-14 py-1.5 text-center inline-flex items-center dark:focus:ring-[#050708]/50 mr-2 mb-0">
              <span className='block rounded-full px-3 py-2 hover:text-blue-500 text-xl font-[courier]'>
                RATA ®️
              </span>
            </button>
          </Box>
          <Box>
            <button onClick={() => handleClick()} className="text-white bg-[#050708] hover:bg-[#fff] hover:text-blue-500 focus:ring-4 focus:outline-none focus:ring-[#050708]/50 font-normal rounded-lg text-base px-14 py-1.5 text-center inline-flex items-center dark:focus:ring-[#050708]/50 mr-2 mb-0">
              <span className='block rounded-full px-3 py-2 hover:text-blue-500 text-xl font-[courier]'> 
                Barbu 🎅🏾
              </span>
            </button>
          </Box>
          <Box>
            <button onClick={() => handleClick()} className="text-white bg-[#050708] hover:bg-[#fff] hover:text-blue-500 focus:ring-4 focus:outline-none focus:ring-[#050708]/50 font-normal rounded-lg text-base px-14 py-1.5 text-center inline-flex items-center dark:focus:ring-[#050708]/50 mr-2 mb-0">
              <span className='block rounded-full px-3 py-2 hover:text-blue-500 text-xl font-[courier]'> 
                Domino 🎲
              </span>
            </button>
          </Box>
          <Box>
            <button onClick={() => handleClick()} className="text-white bg-[#050708] hover:bg-[#fff] hover:text-blue-500 focus:ring-4 focus:outline-none focus:ring-[#050708]/50 font-normal rounded-lg text-base px-14 py-1.5 text-center inline-flex items-center dark:focus:ring-[#050708]/50 mr-2 mb-0">
              <span className='block rounded-full px-3 py-2 hover:text-blue-500 text-xl font-[courier]'> 
                Coeurs ❤️
              </span>
            </button>
          </Box>
          <Box>
            <button onClick={() => handleClick()} className="text-white bg-[#050708] hover:bg-[#fff] hover:text-blue-500 focus:ring-4 focus:outline-none focus:ring-[#050708]/50 font-normal rounded-lg text-base px-14 py-1.5 text-center inline-flex items-center dark:focus:ring-[#050708]/50 mr-2 mb-0">
              <span className='block rounded-full px-3 py-2 hover:text-blue-500 text-xl font-[courier]'> 
                Dames 👸🏽
              </span>
            </button>
          </Box>
          <Box>
            <button onClick={() => handlePli()} className="text-white bg-[#050708] hover:bg-[#fff] hover:text-blue-500 focus:ring-4 focus:outline-none focus:ring-[#050708]/50 font-normal rounded-lg text-base px-14 py-1.5 text-center inline-flex items-center dark:focus:ring-[#050708]/50 mr-2 mb-0">
              <span className='block rounded-full px-3 py-2 hover:text-blue-500 text-xl font-[courier]'> 
                Plis 🀄
              </span>
            </button>
          </Box>
          <Box>
            <button onClick={() => handleClick()} className="text-white bg-[#050708] hover:bg-[#fff] hover:text-blue-500 focus:ring-4 focus:outline-none focus:ring-[#050708]/50 font-normal rounded-lg text-base px-14 py-1.5 text-center inline-flex items-center dark:focus:ring-[#050708]/50 mr-2 mb-0">
              <span className='block rounded-full px-3 py-2 hover:text-blue-500 text-xl font-[courier]'> 
                Dernier Pli 🥇
              </span>
            </button>
          </Box>

        </Stack>
  
        </CardBody>
      </Card>
    </div>

  )
}

export default Panel;

/*
*/