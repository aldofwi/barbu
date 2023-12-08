import { useAuthContext } from '@/context/AuthContext';
import { database } from '@/firebase/config';
import { onValue, push, ref, serverTimestamp, set } from 'firebase/database';
import React, { useEffect, useState } from 'react'
import Hand from './Hand';

const cardSpell = {
  "7h": "Sept de coeur", "8h": "Huit de coeur", "9h": "Neuf de coeur", "th": "Dix de coeur", "jh": "Valet de coeur",  "qh": "Dame de coeur",  "kh": "Roi de coeur",  "ah": "As de coeur",
  "7c": "Sept de trèfle", "8c": "Huit de trèfle", "9c": "Neuf de trèfle", "tc": "Dix de trèfle", "jc": "Valet de trèfle",  "qc": "Dame de trèfle",  "kc": "Roi de trèfle",  "ac": "As de trèfle",
  "7s": "Sept de pique", "8s": "Huit de pique", "9s": "Neuf de pique", "ts": "Dix de pique", "js": "Valet de pique",  "qs": "Dame de pique",  "ks": "Roi de pique",  "as": "As de pique",
  "7d": "Sept de carreau", "8d": "Huit de carreau", "9d": "Neuf de carreau", "td": "Dix de carreau", "jd": "Valet de carreau",  "qd": "Dame de carreau",  "kd": "Roi de carreau",  "ad": "As de carreau",
}

const DeckChoice = () => {

  const { user } = useAuthContext();
  const [order, setOrder] = useState([]);
  const [contractors, setContractors] = useState([]);

  useEffect(() => {

    onValue(
      ref(database, 'game/order' ), (snapshot) => {
        let orders = [];
          snapshot.forEach((doc) => {
            orders.push({...doc.val()});
          });
          setOrder(orders);
      }
    );

  }, []);

  const onClickChoice = (element) => {
      // alert(user.displayName+"picked the card : "+element);

      set(ref(database, '/game/order/' + user.uid), {
        username: user.displayName,
        pick: element,
      });

      const msgRef = ref(database, 'messages/');
      const newItem = push(msgRef);

      set(newItem, 
          {
              createdAt: serverTimestamp(),
              msg: user.displayName+" a pris le "+cardSpell[element],
              name: "[J@rvis]",
              uid: "basic101",
          });
  }

  // console.log("Order : ", order);
    
  return (

    <div className='boardgame h-screen bg-[#121212] text-white container justify-center items-center'>
        <p className="choiceTitle">Make a choice</p>

        <div className='flex flex-row justify-center items-center'>

            <Hand
              handStyle="positionPick"
              suitChoice="h"
              others={order}
              onClickHand={(choice) => onClickChoice(choice)}
            />

        </div>
    </div>

  )
};

export default DeckChoice;

/*
<Card rank="ba" suit="ck" />

            <Card value="Ace"  />
            <Card value="King" />
            <Card value="Queen" />
            <Card value="Jack" />
        
            
            <Card value="Back" />
            <Card value="Back" />
            <Card value="Back" />
            <Card value="Back" />

*/