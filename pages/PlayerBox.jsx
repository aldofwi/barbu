import { Tooltip } from '@chakra-ui/react';
import Image from 'next/image';
import React from 'react'

const PlayerBox = ({}) => {



  return (

    <div>
        <Tooltip label={user?.displayName} bg='burlywood' textColor="black">
          <Image
              className="profile_img"
              src={user?.photoURL}
              unoptimized
              loader={myLoader}
              width={30}
              height={30}
              alt="pp" />
        </Tooltip>
    </div>

  )
}

export default PlayerBox;