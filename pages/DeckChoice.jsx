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

const DeckChoice = ({ getRanking }) => {

  const { user } = useAuthContext();
  const [myCards, setMyCards] = useState(shuffle(rankh));
  const [contractors, setContractors] = useState([]);
  const [order, setOrder] = useState([]);

  const onClickChoice = (element) => {

      set(ref(database, '/game/players/' + user.uid), {
        picture: user.photoURL,
        pick: element,
        score: 0,
        uid: user.uid,
        username: user.displayName,
      });

      // const msgRef = ref(database, 'messages/');
      // const newItem = push(msgRef);

      // set(newItem, 
      //     {
      //         createdAt: serverTimestamp(),
      //         msg: user.displayName+" a pris le "+cardSpell[element],
      //         name: "[J@rvis]",
      //         uid: "basic101",
      //     });
      console.log(user.displayName+" a pris le "+cardSpell[element]);
  }

  useEffect(() => {

    onValue(
      ref(database, 'game/players' ), (snapshot) => {
        let picks = [];
          snapshot.forEach((doc) => {
            picks.push({...doc.val()});
          });
          //setPickers(picks);
          setOrder(picks);
          
          if(picks.length === 4) getRanking(picks);
          //console.log("picks = ", picks);
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