import { database } from '@/firebase/config';
import { Box, Card, CardBody, CardHeader, Heading, Stack, StackDivider } from '@chakra-ui/react';
import { ref, set, update } from 'firebase/database';
import React from 'react';

const contracts = [
  "RATA",
  "Barbu",
  "Domino",
  "Coeurs",
  "Dames",
  "Plis",
  "Dernier Pli"
];

const Panel = ({ contractor }) => {

  const handleClick = (choice) => {

    update(ref(database, 'game/current/'), {
      contract: choice,
      nbClic: 0,
      hasToPlay: contractor,
      endOfContract: false, 
    });

    // alert(contractor+" choosed "+ choice);

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
            <button onClick={() => handleClick(contracts[0])} className="text-white bg-[#050708] hover:bg-[#fff] hover:text-blue-500 focus:ring-4 focus:outline-none focus:ring-[#050708]/50 font-normal rounded-lg text-base px-14 py-1.5 text-center inline-flex items-center dark:focus:ring-[#050708]/50 mr-2 mb-0">
              <span className='block rounded-full px-3 py-2 hover:text-blue-500 text-xl font-[courier]'>
                RATA ®️
              </span>
            </button>
          </Box>
          <Box>
            <button onClick={() => handleClick(contracts[1])} className="text-white bg-[#050708] hover:bg-[#fff] hover:text-blue-500 focus:ring-4 focus:outline-none focus:ring-[#050708]/50 font-normal rounded-lg text-base px-14 py-1.5 text-center inline-flex items-center dark:focus:ring-[#050708]/50 mr-2 mb-0">
              <span className='block rounded-full px-3 py-2 hover:text-blue-500 text-xl font-[courier]'> 
                Barbu 🎅🏾
              </span>
            </button>
          </Box>
          <Box>
            <button onClick={() => handleClick(contracts[2])} className="text-white bg-[#050708] hover:bg-[#fff] hover:text-blue-500 focus:ring-4 focus:outline-none focus:ring-[#050708]/50 font-normal rounded-lg text-base px-14 py-1.5 text-center inline-flex items-center dark:focus:ring-[#050708]/50 mr-2 mb-0">
              <span className='block rounded-full px-3 py-2 hover:text-blue-500 text-xl font-[courier]'> 
                Domino 🎲
              </span>
            </button>
          </Box>
          <Box>
            <button onClick={() => handleClick(contracts[3])} className="text-white bg-[#050708] hover:bg-[#fff] hover:text-blue-500 focus:ring-4 focus:outline-none focus:ring-[#050708]/50 font-normal rounded-lg text-base px-14 py-1.5 text-center inline-flex items-center dark:focus:ring-[#050708]/50 mr-2 mb-0">
              <span className='block rounded-full px-3 py-2 hover:text-blue-500 text-xl font-[courier]'> 
                Coeurs ❤️
              </span>
            </button>
          </Box>
          <Box>
            <button onClick={() => handleClick(contracts[4])} className="text-white bg-[#050708] hover:bg-[#fff] hover:text-blue-500 focus:ring-4 focus:outline-none focus:ring-[#050708]/50 font-normal rounded-lg text-base px-14 py-1.5 text-center inline-flex items-center dark:focus:ring-[#050708]/50 mr-2 mb-0">
              <span className='block rounded-full px-3 py-2 hover:text-blue-500 text-xl font-[courier]'> 
                Dames 👸🏽
              </span>
            </button>
          </Box>
          <Box>
            <button onClick={() => handleClick(contracts[5])} className="text-white bg-[#050708] hover:bg-[#fff] hover:text-blue-500 focus:ring-4 focus:outline-none focus:ring-[#050708]/50 font-normal rounded-lg text-base px-14 py-1.5 text-center inline-flex items-center dark:focus:ring-[#050708]/50 mr-2 mb-0">
              <span className='block rounded-full px-3 py-2 hover:text-blue-500 text-xl font-[courier]'> 
                Plis 🀄
              </span>
            </button>
          </Box>
          <Box>
            <button onClick={() => handleClick(contracts[6])} className="text-white bg-[#050708] hover:bg-[#fff] hover:text-blue-500 focus:ring-4 focus:outline-none focus:ring-[#050708]/50 font-normal rounded-lg text-base px-14 py-1.5 text-center inline-flex items-center dark:focus:ring-[#050708]/50 mr-2 mb-0">
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