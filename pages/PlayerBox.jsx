import { useAuthContext } from '@/context/AuthContext';
import { database } from '@/firebase/config';
import { ref, set } from 'firebase/database';
import { Tooltip } from '@chakra-ui/react';
import Image from 'next/image';
import React, { useEffect, useState } from 'react'
import Hand from './Hand';

const PlayerBox = ({ nameOfClass, id, player, myCards }) => {

  const { user } = useAuthContext();
  const myLoader = ({ src }) => { return player.picture };

  // console.log("player = ", player);
  useEffect(() => {
      
    

  }, [myCards]);

  const getClass = (oneID) => {

    switch(oneID) {
      case "SOUTH": return "relative flex px-50 top-8 -right-40 bottom-10";
      case "WEST" : return "relative flex px-50 -top-40 left-20 bottom-10";
      case "NORTH": return "relative flex px-50 top-4 -right-52 bottom-50";
      case "EAST" : return "relative flex px-50 -top-40 -left-20 bottom-10";
      default: break;
    }
  }

  const onPlayerClick = (clickTab) => {
    // PROD : ONLY MAIN PLAYER CAN CLICK !!! Update place later
    // save in Database table "Board" 

    set(ref(database, 'game/board/'+clickTab[0]), {
      value: clickTab[1],
    });

    // REMOVE from HANDS in db
    // onValue needed in BoardGame (8 --> 7 --> 6) southHand.splice(indexOf())

    // remove from hand.
    // alert(myCards.indexOf(clickTab[1]));
    myCards.splice(myCards.indexOf(clickTab[1]), 1);

    // send it on Board via Database
    alert('|| PlayerBox || '+clickTab[0]+' clicked on '+clickTab[1]);

  }


  return (

    <div className={nameOfClass}>

        <Hand
          handStyle={id}
          cards={myCards}
          onClickHand={(playCard) => onPlayerClick(playCard)}
        />

        <div className={getClass(id)}>
          <Tooltip label={player.username} bg='burlywood' textColor="black">
            <Image
                className="profile_img"
                src={player.picture}
                unoptimized
                loader={myLoader}
                width={30}
                height={30}
                alt="pp" />
          </Tooltip>
        </div>
    </div>

  )
}

export default PlayerBox;