import { useAuthContext } from '@/context/AuthContext';
import { database } from '@/firebase/config';
import { onValue, ref, set, update } from 'firebase/database';
import { Tooltip } from '@chakra-ui/react';
import Image from 'next/image';
import React, { useEffect, useState } from 'react'
import Hand from './Hand';

const PlayerBox = ({ nameOfClass, id, player, board, hasToPlay, myCards, clickBoard, getBoxClass }) => {

  const { user } = useAuthContext();
  const myLoader = ({ src }) => { return player.picture };

  const onPlayerClick = async (clickTab) => {
    // TODO PROD : ONLY MAIN PLAYER CAN CLICK !!! Update place later

    if(clickTab[0] !== hasToPlay) {
      alert(hasToPlay+" has to play !");
      return;
    } 
    
    // Tableau de correspondance ex: "NORTH --> UID north"
    // Save clicked card in Database table "Board".
    console.log("PLAYERBOX // ADD TO BOARD ", clickTab[1]);
    await set(ref(database, 'game/board/'+clickTab[0]), {
      value: clickTab[1],
      place: clickTab[0],
    });

    // Remove from myCards props
    console.log("PLAYERBOX // SPLICE // myCards");
    myCards.splice(myCards.indexOf(clickTab[1]), 1);

    console.log("PLAYERBOX // onPlayerClick = ", board.length);
    if(board.length < 3) {
      console.log("PLAYERBOX // switch() from ", hasToPlay);

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
    }

    clickBoard();

    // Remove from HANDS in Database table "Hands".
    // TODO PROD : ONLY "SOUTH" updating with uid.
    switch(clickTab[0]) {
      case "SOUTH": 
        await update(ref(database, 'game/hands/'), {
          SOUTH: myCards,
        });
        return;
      case "WEST":  
        await update(ref(database, 'game/hands/'), {
          WEST: myCards,
        });
        return;
      case "NORTH":  
        await update(ref(database, 'game/hands/'), {
          NORTH: myCards,
        });
        return;
      case "EAST":  
        await update(ref(database, 'game/hands/'), {
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

        <div className={getBoxClass(id)}>
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