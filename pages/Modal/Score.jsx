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

  useEffect(() => {

    onValue(
      ref(database, 'game/players/'+players[0].uid+'/username' ), (snapshot) => {
        setName1(snapshot.val());
      }
    );

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

  }, []);
  

  return (

    <TableContainer>
      <Table variant='striped' colorScheme='teal' size='md'>
        <Thead>
          <Tr>
            <Th>Contracts</Th>
            <Th>{name1}</Th>
            <Th>{name2}</Th>
            <Th>{name3}</Th>
            <Th>{name4}</Th>
          </Tr>
        </Thead>

        <Tbody>
        <Tr>
          <Td><b>Total</b></Td>
          <Td>{globalScore1}</Td>
          <Td>{globalScore2}</Td>
          <Td>{globalScore3}</Td>
          <Td>{globalScore4}</Td>
        </Tr>
        </Tbody>

        {
          scores?.map((score, i) => 
          <Tbody>
            <Tr key={i}>
              <Td>{score[0]}</Td>
              <Td>{score[1]}</Td>
              <Td>{score[2]}</Td>
              <Td>{score[3]}</Td>
              <Td>{score[4]}</Td>
            </Tr>
            <Tr>
              <Td>-------------</Td>
              <Td>-------------</Td>
              <Td>-------------</Td>
              <Td>-------------</Td>
              <Td>-------------</Td>
            </Tr>
          </Tbody>
          
          )
        }

        {
          scores.length % 7 === 0
                    ?
            <Tbody>
              <Tr>
                <Td>-------------</Td>
                <Td>-------------</Td>
                <Td>-------------</Td>
                <Td>-------------</Td>
                <Td>-------------</Td>
              </Tr>
            </Tbody>
                    :
                  null
        }

      </Table>
    </TableContainer>

  )
}

export default Score;