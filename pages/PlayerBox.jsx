import { useAuthContext } from '@/context/AuthContext';
import { Tooltip } from '@chakra-ui/react';
import Image from 'next/image';
import Hand from './Hand';
import React, { useState } from 'react';

const PlayerBox = ({ nameOfClass, id, player, myCards, clickBoard, boxClass }) => {

  const { user } = useAuthContext();

  const [playUsername, setPlayUsername] = useState(player?.username);
  const [playPicture, setPlayPicture] = useState(player?.picture);
  const [playUid, setPlayUid] = useState(player?.uid);


  // const myLoader = () => { 

  //   if(player.picture) return player.picture;
  //   else return;
  // };

  // loader={() => myLoader()}

  /*
        <div className={getBoxClass(id)}>
          <Tooltip label={playUsername} bg='burlywood' textColor="black">
            <Image
                className="profile_img"
                src={playPicture}
                unoptimized
                width={30}
                height={30}
                alt="pp" />
          </Tooltip>
        </div>
  */

  // console.log("PLAYERBOX // boxClass : ", boxClass);

  return (

    <div>

      <div className={boxClass}>
        <Tooltip label={playUsername} bg='burlywood' textColor="black">
          <Image
            className="profile_img"
            src={playPicture}
            unoptimized
            width={30}
            height={30}
            alt="pp" />
          </Tooltip>
      </div>

        <div>
          {
            playUid === user?.uid 
                ?
            <div className={nameOfClass}>
              <Hand
                handStyle={id}
                cards={myCards}
                onClickHand={(playCard) => clickBoard(playCard)}
              />
            </div>
                :
            <div className={nameOfClass}>
              <Hand
                handStyle={id}
                cards={myCards}
              />
            </div>
          }
        </div>

    </div>

  )
}

export default PlayerBox;