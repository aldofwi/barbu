import { useAuthContext } from '@/context/AuthContext';
import React from 'react';
import { Tooltip } from '@chakra-ui/react';
import Image from 'next/image';
import Hand from './Hand';

const PlayerBox = ({ nameOfClass, id, player, myCards, clickBoard, getBoxClass }) => {

  const { user } = useAuthContext();
  const myLoader = ({ src }) => { return player.picture };

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
            onClickHand={(playCard) => clickBoard(playCard)}
          />
        </div>

    </div>

  )
}

export default PlayerBox;