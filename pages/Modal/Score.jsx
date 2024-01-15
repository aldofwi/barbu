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

const Score = () => {

  const [southName, setSouthName] = useState("");
  const [westName,  setWestName]  = useState("");
  const [northName, setNorthName] = useState("");
  const [eastName,  setEastName]  = useState("");

  let [southGlobalScore, setSouthGlobalScore] = useState(0);
  let [westGlobalScore,  setWestGlobalScore]  = useState(0);
  let [northGlobalScore, setNorthGlobalScore] = useState(0);
  let [eastGlobalScore,  setEastGlobalScore]  = useState(0);

  useEffect(() => {

    onValue(
      ref(database, 'game/players/n3gYoJQyeHhCKzr3WGFybc8nIdb2/username' ), (snapshot) => {
        setSouthName(snapshot.val());
      }
    );

    onValue(
      ref(database, 'game/players/n3gYoJQyeHhCKzr3WGFybc8nIdb3/username' ), (snapshot) => {
        setWestName(snapshot.val());
      }
    );

    onValue(
      ref(database, 'game/players/n3gYoJQyeHhCKzr3WGFybc8nIdb4/username' ), (snapshot) => {
        setNorthName(snapshot.val());
      }
    );

    onValue(
      ref(database, 'game/players/n3gYoJQyeHhCKzr3WGFybc8nIdb5/username' ), (snapshot) => {
        setEastName(snapshot.val());
      }
    );

    onValue(
      ref(database, 'game/players/n3gYoJQyeHhCKzr3WGFybc8nIdb2/score' ), (snapshot) => {
        setSouthGlobalScore(snapshot.val());
      }
    );

    onValue(
      ref(database, 'game/players/n3gYoJQyeHhCKzr3WGFybc8nIdb3/score' ), (snapshot) => {
        setWestGlobalScore(snapshot.val());
      }
    );

    onValue(
      ref(database, 'game/players/n3gYoJQyeHhCKzr3WGFybc8nIdb4/score' ), (snapshot) => {
        setNorthGlobalScore(snapshot.val());
      }
    );

    onValue(
      ref(database, 'game/players/n3gYoJQyeHhCKzr3WGFybc8nIdb5/score' ), (snapshot) => {
        setEastGlobalScore(snapshot.val());
      }
    );

  }, []);
  

  return (

    <TableContainer>
      <Table variant='striped' colorScheme='teal' size='md'>
        <Thead>
          <Tr>
            <Th>{southName}</Th>
            <Th>{westName}</Th>
            <Th>{northName}</Th>
            <Th>{eastName}</Th>
          </Tr>
        </Thead>
        <Tbody>
        <Tr>
          <Td>{southGlobalScore}</Td>
          <Td>{westGlobalScore}</Td>
          <Td>{northGlobalScore}</Td>
          <Td>{eastGlobalScore}</Td>
        </Tr>
        </Tbody>
      </Table>
    </TableContainer>



    
  )
}

export default Score;