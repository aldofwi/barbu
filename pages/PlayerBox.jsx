import { useAuthContext } from '@/context/AuthContext';
import { Tooltip } from '@chakra-ui/react';
import Image from 'next/image';
import React, { useState } from 'react'
import Hand from './Hand';

const PlayerBox = ({ nameOfClass, id, player, myCards }) => {

  const { user } = useAuthContext();
  const myLoader = ({ src }) => { return player.picture };

  console.log("player = ", player);

  const getStyle = (oneID) => {

    switch(oneID) {
      case "SOUTH": return "mainPlayer";
      case "WEST" : return "westPlayer";
      case "NORTH": return "northPlayer";
      case "EAST" : return "eastPlayer";
      default: break;
    }
  }

  const getClass = (oneID) => {

    switch(oneID) {
      case "SOUTH": return "relative flex px-50 top-8 -right-40 bottom-10";
      case "WEST" : return "relative flex px-50 -top-40 left-20 bottom-10";
      case "NORTH": return "relative flex px-50 top-4 -right-48 bottom-50";
      case "EAST" : return "relative flex px-50 -top-40 -left-20 bottom-10";
      default: break;
    }
  }

  const onClickPlay = (clickCard) => {

    // remove from hand.
    // send it on Board.
    alert(player.username+' clicked on '+clickCard);

  }
  /*

  */

  return (

    <div className={nameOfClass}>

        <Hand
          handStyle={getStyle(id)}
          cards={myCards}
          onClickHand={(playCard) => onClickPlay(playCard)}
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