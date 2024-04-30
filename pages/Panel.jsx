import { useAuthContext } from '@/context/AuthContext';
import { database } from '@/firebase/config';
import { Box, Card, CardBody, CardHeader, Heading, Stack, StackDivider } from '@chakra-ui/react';
import { onValue, ref, set, update } from 'firebase/database';
import React, { useEffect, useState } from 'react';

const contracts = [
  "RATA",
  "Barbu",
  "Domino",
  "Coeurs",
  "Dames",
  "Plis",
  "Dernier Pli"
];

const btnClass = "text-white bg-[#050708] hover:bg-[#fff] hover:text-blue-500 focus:ring-4 focus:outline-none focus:ring-[#050708]/50 font-normal rounded-lg text-base px-14 py-1.5 text-center inline-flex items-center dark:focus:ring-[#050708]/50 mr-2 mb-0";
const spanClass = 'block rounded-full px-3 py-2 hover:text-blue-500 text-xl font-[courier]';
const btnClassOFF = "text-white disabled cursor-not-allowed bg-[grey] focus:ring-4 focus:outline-none focus:ring-[#050708]/50 font-normal rounded-lg text-base px-14 py-1.5 text-center inline-flex items-center dark:focus:ring-[#050708]/50 mr-2 mb-0";
const spanClassOFF = 'block disabled cursor-not-allowed bg-[grey] rounded-full px-3 py-2 text-xl font-[courier]';

const Panel = ({ whoCanPlayDom }) => {

  const { user } = useAuthContext();

  const [rataDone, setRATADone]     = useState(false);
  const [barbuDone, setBarbuDone]   = useState(false);
  const [dominoDone, setDominoDone] = useState(false);
  const [coeursDone, setCoeursDone] = useState(false);
  const [damesDone, setDamesDone]   = useState(false);
  const [plisDone, setPlisDone]     = useState(false);
  const [dpDone, setDpDone]         = useState(false);

  const handleClick = (choice) => {

    update(ref(database, 'game/current/'), {
      contract: choice,
      endOfContract: false, 
    });

    if(choice === "Domino") {

      // INIT Hands Domino
      update(ref(database, 'game/boardDomino/'), {
        SPIDES:   [],
        HEARTS:   [],
        CLOVES:   [],
        DIAMONDS: [],   
      });

      // Check if contractor can play first.
      update(ref(database, 'game/current/'), {
        dominosDone: [], // last edit ✏️
        hasToPlay: whoCanPlayDom(),
      });
      
    }

  }

  useEffect(() => {
    
    onValue(
      ref(database, 'game/contracts/rata' ), (snapshot) => {
          setRATADone(snapshot.val());
      }
    );

    onValue(
      ref(database, 'game/contracts/barbu' ), (snapshot) => {
          setBarbuDone(snapshot.val());
      }
    );

    onValue(
      ref(database, 'game/contracts/domino' ), (snapshot) => {
          setDominoDone(snapshot.val());
      }
    );

    onValue(
      ref(database, 'game/contracts/coeurs' ), (snapshot) => {
          setCoeursDone(snapshot.val());
      }
    );

    onValue(
      ref(database, 'game/contracts/dames' ), (snapshot) => {
          setDamesDone(snapshot.val());
      }
    );

    onValue(
      ref(database, 'game/contracts/plis' ), (snapshot) => {
          setPlisDone(snapshot.val());
      }
    );

    onValue(
      ref(database, 'game/contracts/dp' ), (snapshot) => {
          setDpDone(snapshot.val());
      }
    );
  
  }, []);
  
  
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
            <button onClick={!rataDone ? () => handleClick(contracts[0]) : null} className={rataDone ? btnClassOFF : btnClass}>
              <span className={rataDone ? spanClassOFF : spanClass}>                 
                RATA ®️
              </span>
            </button>
          </Box>
          <Box>
            <button onClick={!barbuDone ? () => handleClick(contracts[1]) : null} className={barbuDone ? btnClassOFF : btnClass}>
              <span className={barbuDone ? spanClassOFF : spanClass}>                 
                Barbu 🎅🏾
              </span>
            </button>
          </Box>
          <Box>
            <button onClick={!dominoDone ? () => handleClick(contracts[2]) : null} className={dominoDone ? btnClassOFF : btnClass}>
              <span className={dominoDone ? spanClassOFF : spanClass}>                 
                Domino 🎲
              </span>
            </button>
          </Box>
          <Box>
            <button onClick={!coeursDone ? () => handleClick(contracts[3]) : null} className={coeursDone ? btnClassOFF : btnClass}>
              <span className={coeursDone ? spanClassOFF : spanClass}>                 
                Coeurs ❤️
              </span>
            </button>
          </Box>
          <Box>
            <button onClick={!damesDone ? () => handleClick(contracts[4]) : null} className={damesDone ? btnClassOFF : btnClass}>
              <span className={damesDone ? spanClassOFF : spanClass}>                 
                Dames 👸🏽
              </span>
            </button>
          </Box>
          <Box>
            <button onClick={!plisDone ? () => handleClick(contracts[5]) : null} className={plisDone ? btnClassOFF : btnClass}>
              <span className={plisDone ? spanClassOFF : spanClass}>
                Plis 🀄
              </span>
            </button>
          </Box>
          <Box>
            <button onClick={!dpDone ? () => handleClick(contracts[6]) : null} className={dpDone ? btnClassOFF : btnClass}>
              <span className={dpDone ? spanClassOFF : spanClass}> 
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