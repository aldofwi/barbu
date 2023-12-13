import { useAuthContext } from '@/context/AuthContext';
import { database } from '@/firebase/config';
import { ref, set, update } from 'firebase/database';
import { Tooltip } from '@chakra-ui/react';
import Image from 'next/image';
import React, { useEffect, useState } from 'react'
import Hand from './Hand';

const PlayerBox = ({ nameOfClass, id, player, myCards }) => {

  const { user } = useAuthContext();
  const myLoader = ({ src }) => { return player.picture };

  // console.log("player = ", player);

  const getClass = (oneID) => {

    switch(oneID) {
      case "SOUTH": return "fixed absolute flex px-50 left-8 bottom-32";
      case "WEST" : return "fixed absolute flex px-50 top-96 -right-20 bottom-10";
      case "NORTH": return "fixed absolute flex px-50 top-20 left-52 bottom-50";
      case "EAST" : return "fixed absolute flex px-50 top-96 -left-20 bottom-10";
      default: break;
    }
  }

  const onPlayerClick = (clickTab) => {
    // TODO PROD : ONLY MAIN PLAYER CAN CLICK !!! Update place later

    // Save clicked card in Database table "Board".
    set(ref(database, 'game/board/'+clickTab[0]), {
      value: clickTab[1],
    });

    // Remove from myCards props
    myCards.splice(myCards.indexOf(clickTab[1]), 1);

    // Remove from HANDS in Database table "Hands".
    // TODO PROD : ONLY "SOUTH" updating with uid.
    switch(clickTab[0]) {
      case "SOUTH": 
        update(ref(database, 'game/hands/'), {
          SOUTH: myCards,
        });
        return;
      case "WEST":  
        update(ref(database, 'game/hands/'), {
          WEST: myCards,
        });
        return;
      case "NORTH":  
        update(ref(database, 'game/hands/'), {
          NORTH: myCards,
        });
        return;
      case "EAST":  
        update(ref(database, 'game/hands/'), {
          EAST: myCards,
        });
        return;

      default: break;
    }

    // onValue needed in BoardGame (8 --> 7 --> 6) southHand.splice(indexOf())

    // alert('|| PlayerBox || '+clickTab[0]+' clicked on '+clickTab[1]);
  }

  return (

    <div className={nameOfClass}>

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


        <Hand
          handStyle={id}
          cards={myCards}
          onClickHand={(playCard) => onPlayerClick(playCard)}
        />
        
    </div>

  )
}

export default PlayerBox;