import { useAuthContext } from '@/context/AuthContext';
import { database } from '@/firebase/config';
import { onValue, push, ref, serverTimestamp, set, update } from 'firebase/database';
import React, { useEffect, useState } from 'react'
import Hand from './Hand';

const rankh = ["7h", "8h", "9h", "th", "jh", "qh", "kh", "ah"];
const cardSpell = {
  "7h": "Sept de coeur", "8h": "Huit de coeur", "9h": "Neuf de coeur", "th": "Dix de coeur", "jh": "Valet de coeur",  "qh": "Dame de coeur",  "kh": "Roi de coeur",  "ah": "As de coeur",
  "7c": "Sept de trèfle", "8c": "Huit de trèfle", "9c": "Neuf de trèfle", "tc": "Dix de trèfle", "jc": "Valet de trèfle",  "qc": "Dame de trèfle",  "kc": "Roi de trèfle",  "ac": "As de trèfle",
  "7s": "Sept de pique", "8s": "Huit de pique", "9s": "Neuf de pique", "ts": "Dix de pique", "js": "Valet de pique",  "qs": "Dame de pique",  "ks": "Roi de pique",  "as": "As de pique",
  "7d": "Sept de carreau", "8d": "Huit de carreau", "9d": "Neuf de carreau", "td": "Dix de carreau", "jd": "Valet de carreau",  "qd": "Dame de carreau",  "kd": "Roi de carreau",  "ad": "As de carreau",
}

const shuffle = (tab) => {

    const theTab = [...tab];
    const newTab = [];
    let i;  let n = tab.length;
    
    // While it remains elements to suffle.
    while(n) {
        // Pick a remaining element.
        i = Math.floor(Math.random() * theTab.length);
        
        // If not already shuffle, move it to the new array.
        newTab.push(theTab[i]);
        theTab.splice(i, 1);
        //delete tab[i];
        n--;
    }
    //console.log("newtab = ", newTab);

    return newTab;
}

const DeckChoice = ({ setOrderDone }) => {

  const { user } = useAuthContext();
  const [order, setOrder] = useState([]);
  const [myCards, setMyCards] = useState(shuffle(rankh));
  const [contractors, setContractors] = useState([]);

    // getPositionByID when Order is setted.
    // pass positions to PlayerBox props.
    // Map players from database.

  const getRank = () => {

    let numb=1;
    let myCard;
    let myValue;
    let otherCards = [];
    let players = order;

    for(let i=0; i<players.length; i++) {
      if(players[i].username === user.displayName) {
        myCard = players[i].pick.charAt(0);
        for(let j=0; j<cardValues.length; j++) {
          if(myCard === cardValues[j]) myValue = j;
        }
      } else {
        otherCards.push(players[i].pick.charAt(0));
      }
    }

    for(let k=0; k<players.length; k++) {
      if(players[k].username !== user.displayName) {
        
        // console.log("myValue = ", myValue);
        // console.log("k = ", k, "| players[k].pick.charAt(0) = ", players[k].pick.charAt(0));
        // console.log("values[players[k].pick.charAt(0)] = ", values[players[k].pick.charAt(0)]);
        // console.log("myValue < other --> ", myValue  < values[players[k].pick.charAt(0)]);

        if(myValue < values[players[k].pick.charAt(0)]) {
          numb++;
        }
      }
    }

    update(ref(database, '/game/players/' + user.uid), {
      rank: numb,
    });

    if(numb === 1) {
      set(ref(database, '/game/contractor'), {
        name: user.displayName,
        uid: user.uid,
      });
    }
    
    const msgRef = ref(database, 'messages/');
    const newItem = push(msgRef);

    set(newItem, 
      {
          createdAt: serverTimestamp(),
          msg: user.displayName+" is contractor N°"+numb,
          name: "[J@rvis]",
          uid: "basic101",
      });

    return numb;
  }

  const onClickChoice = (element) => {

      // set(ref(database, '/game/players/' + user.uid), {
      //   username: user.displayName,
      //   picture: user.photoURL,
      //   pick: element,
      // });

      update(ref(database, '/game/players/' + user.uid), {
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

      if(order.length === 4) {
        getRank();
        setOrderDone(true);
      } 
  }

  useEffect(() => {

    onValue(
      ref(database, 'game/players' ), (snapshot) => {
        let orders = [];
          snapshot.forEach((doc) => {
            orders.push({...doc.val()});
          });
          setOrder(orders);
      }
    );

  }, []);
    
  return (

    <div className='boardgame h-screen bg-[#121212] text-white container justify-center items-center'>
        <p className="choiceTitle">Make a choice</p>

        <div className='flex flex-row justify-center items-center'>

            <Hand
              handStyle="positionPick"
              cards={myCards}
              others={order}
              onClickHand={(choice) => onClickChoice(choice)}
            />

        </div>
    </div>

  )
};

export default DeckChoice;