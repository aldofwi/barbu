import { useAuthContext } from '@/context/AuthContext';
import { database } from '@/firebase/config';
import { onValue, ref, set, update } from 'firebase/database';
import { Tooltip } from '@chakra-ui/react';
import Image from 'next/image';
import React, { useEffect, useState } from 'react'
import Hand from './Hand';

const PlayerBox = ({ nameOfClass, id, player, contractor, board, hasToPlay, myCards }) => {

  const { user } = useAuthContext();
  const myLoader = ({ src }) => { return player.picture };

  const getClass = (oneID) => {
    // HAS TO PLAY :  border border-2 rounded-full border-[red]
    switch(oneID) {
      case "SOUTH": return "image_S border border-2 rounded-full border-[red]" ;
      case "NORTH": return "image_N";

      case "WEST" : return "fixed absolute flex px-50 top-96 right-32 bottom-10";
      case "EAST" : return "fixed absolute flex px-50 top-96 left-32 bottom-10";
      default: break;
    }
  }

  const onPlayerClick = async (clickTab) => {
    // TODO PROD : ONLY MAIN PLAYER CAN CLICK !!! Update place later

    if(clickTab[0] !== hasToPlay) {
      alert(hasToPlay+" has to play !");
      return;
    }
    // SET hasTOPLAY "EAST"
    // Tableau de correspondance ex: "NORTH --> UID north"
    
    // Save clicked card in Database table "Board".
    await set(ref(database, 'game/board/'+clickTab[0]), {
      value: clickTab[1],
    });

    // Remove from myCards props
    myCards.splice(myCards.indexOf(clickTab[1]), 1);

    console.log("PLAYERBOX // BOARD =", board);

    if(board.length < 4) {

      switch(hasToPlay) {
        case "SOUTH": 
        update(ref(database, 'game/current/'), {
          hasToPlay: "WEST",
        });
        return;
      case "WEST":  
        update(ref(database, 'game/current/'), {
          hasToPlay: "NORTH",
        });
        return;
      case "NORTH":  
        update(ref(database, 'game/current/'), {
          hasToPlay: "EAST",
        });
        return;
      case "EAST":  
        update(ref(database, 'game/current/'), {
          hasToPlay: "SOUTH",
        });
        return;

      default: break;
      }
    } else if(board.length === 4) {

      // Who Is Master ?
      
    }


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

    <div>

        <div className={getClass(id)}>
          <Tooltip label={player?.username} bg='burlywood' textColor="black">
            <Image
                className="profile_img"
                src={player?.picture}
                unoptimized
                loader={myLoader}
                width={30}
                height={30}
                alt="pp" />
          </Tooltip>
        </div>

        <div className={nameOfClass}>
          <Hand
            handStyle={id}
            cards={myCards}
            onClickHand={(playCard) => onPlayerClick(playCard)}
          />
        </div>

    </div>

  )
}

export default PlayerBox;