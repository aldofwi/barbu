import { useAuthContext } from '@/context/AuthContext';
import { Tooltip } from '@chakra-ui/react';
import Image from 'next/image';
import Hand from './Hand';
import React from 'react';

const PlayerBox = ({ nameOfClass, id, player, myCards, clickBoard, getBoxClass }) => {

  const { user } = useAuthContext();

  const myLoader = () => { 

    if(player.picture) return player.picture;
    else return;
  };

  // src={player.picture}

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

        {
          player?.uid === user?.uid 
              ?
            <Hand
              handStyle={id}
              cards={myCards}
              onClickHand={(playCard) => clickBoard(playCard)}
            />
              :
            <Hand
              handStyle={id}
              cards={myCards}
            />
        }
          
        </div>

    </div>

  )
}

export default PlayerBox;