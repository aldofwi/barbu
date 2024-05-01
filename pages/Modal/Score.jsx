import React, { useEffect, useState } from 'react'
import { onValue, ref } from 'firebase/database';
import {
  Table,
  Thead,
  Tbody,
  Tfoot,
  Tr,
  Th,
  Td,
  TableCaption,
  TableContainer,
} from '@chakra-ui/react';
import { database } from '@/firebase/config';

const Score = ({ players }) => {

  const [scores, setScores] = useState([]);

  const [name1, setName1] = useState("");
  const [name2, setName2] = useState("");
  const [name3, setName3] = useState("");
  const [name4, setName4] = useState("");

  let [globalScore1, setGlobalScore1] = useState(0);
  let [globalScore2, setGlobalScore2] = useState(0);
  let [globalScore3, setGlobalScore3] = useState(0);
  let [globalScore4, setGlobalScore4] = useState(0);

  // TODO : function getHigherScore() & getLowerScore()

  useEffect(() => {

    onValue(
      ref(database, 'game/players/'+players[0].uid+'/username' ), (snapshot) => {
        setName1(snapshot.val());
      }
    );

    onValue(
      ref(database, 'game/players/'+players[1].uid+'/username' ), (snapshot) => {
        setName2(snapshot.val());
      }
    );

    onValue(
      ref(database, 'game/players/'+players[2].uid+'/username' ), (snapshot) => {
        setName3(snapshot.val());
      }
    );

    onValue(
      ref(database, 'game/players/'+players[3].uid+'/username' ), (snapshot) => {
        setName4(snapshot.val());
      }
    );

    onValue(
      ref(database, 'game/current/score1' ), (snapshot) => {
        setGlobalScore1(snapshot.val());
      }
    );

    onValue(
      ref(database, 'game/current/score2' ), (snapshot) => {
        setGlobalScore2(snapshot.val());
      }
    );

    onValue(
      ref(database, 'game/current/score3' ), (snapshot) => {
        setGlobalScore3(snapshot.val());
      }
    );

    onValue(
      ref(database, 'game/current/score4' ), (snapshot) => {
        setGlobalScore4(snapshot.val());
      }
    );

    onValue(
      ref(database, 'game/scores' ), (snapshot) => {
        let scoresNew = [];
        snapshot.forEach((doc) => {
          scoresNew.push(doc.val());
        });
        setScores(scoresNew);
      }
    );

  }, [players]);
  
  // teal

  return (

    <TableContainer>
      <Table variant='striped' colorScheme='twitter' size='xl'>
        <Thead>
          <Tr>
            <Th textAlign='center'>Contracts</Th>
            <Th textAlign='center'>{name1}</Th>
            <Th textAlign='center'>{name2}</Th>
            <Th textAlign='center'>{name3}</Th>
            <Th textAlign='center'>{name4}</Th>
          </Tr>
          <Tr>
            <Td fontSize="large" textAlign='center'><b>Total</b></Td>
            <Td fontSize="large" textAlign='center' className={globalScore1>0 ? "p1" : globalScore1<0 ? "p11" : null}><b>{globalScore1}</b></Td>
            <Td fontSize="large" textAlign='center' className={globalScore2>0 ? "p1" : globalScore2<0 ? "p11" : null}><b>{globalScore2}</b></Td>
            <Td fontSize="large" textAlign='center' className={globalScore3>0 ? "p1" : globalScore3<0 ? "p11" : null}><b>{globalScore3}</b></Td>
            <Td fontSize="large" textAlign='center' className={globalScore4>0 ? "p1" : globalScore4<0 ? "p11" : null}><b>{globalScore4}</b></Td>
          </Tr>
        </Thead>

        {
          scores?.map((score, i) => 
          <Tbody key={i}>
            <Tr>
              <Td textAlign='center' className={score[0]>0 ? "p1" : score[0]<0 ? "p11" : null}>{score[0]}</Td>
              <Td textAlign='center' className={score[1]>0 ? "p1" : score[1]<0 ? "p11" : null}>{score[1]}</Td>
              <Td textAlign='center' className={score[2]>0 ? "p1" : score[2]<0 ? "p11" : null}>{score[2]}</Td>
              <Td textAlign='center' className={score[3]>0 ? "p1" : score[3]<0 ? "p11" : null}>{score[3]}</Td>
              <Td textAlign='center' className={score[4]>0 ? "p1" : score[4]<0 ? "p11" : null}>{score[4]}</Td>
            </Tr>

            {
              (i+1)%1 === 0 
                    ?
              <Tr>
                <Td textAlign='center'>------------</Td>
                <Td textAlign='center'>------------</Td>
                <Td textAlign='center'>------------</Td>
                <Td textAlign='center'>------------</Td>
                <Td textAlign='center'>------------</Td>
              </Tr>
                  : null
            }
            
          </Tbody>
          )
        }
        
      </Table>
    </TableContainer>

  )
}

export default Score;