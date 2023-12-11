import { useAuthContext } from '@/context/AuthContext';
import { database } from '@/firebase/config';
import { onValue, push, ref, serverTimestamp, set, update } from 'firebase/database';
import { useEffect, useState } from 'react';
import BoardGame from './BoardGame';
import DeckChoice from './DeckChoice';

const cardValues = ["7", "8", "9", "t", "j", "q", "k", "a"];

const values = {
  7: 0,
  8: 1,
  9: 2,
  t: 3,
  j: 4,
  q: 5,
  k: 6,
  a: 7,
}

const FirstBoard = () => {

    const { user } = useAuthContext();
    const [places, setPlaces] = useState([]);
    const [isOrderSet, setIsOrderSet] = useState(false);

    useEffect(() => {

        onValue(
          ref(database, 'game/order' ), (snapshot) => {
            let orders = [];
              snapshot.forEach((doc) => {
                orders.push({...doc.val()});
              });
              setPlaces(orders);
          }
        );

        if(places.length === 2) setIsOrderSet(true);
    
      }, [places.length]);

    // getPositionByID when Order is setted.
    // pass positions to PlayerBox props.
    // Map players from database.

    const getRank = () => {

      let numb=1;
      let myCard;
      let myValue;
      let otherCards = [];

      for(let i=0; i<places.length; i++) {
        if(places[i].username === user.displayName) {
          myCard = places[i].pick.charAt(0);
          for(let j=0; j<cardValues.length; j++) {
            if(myCard === cardValues[j]) myValue = j;
          }
        } else {
          otherCards.push(places[i].pick.charAt(0));
        }
      }

      // console.log("otherCards = ", otherCards);

      for(let k=0; k<places.length; k++) {
        if(places[k].username !== user.displayName) {
          
          // console.log("myValue = ", myValue);
          // console.log("k = ", k, "| places[k].pick.charAt(0) = ", places[k].pick.charAt(0));
          // console.log("values[places[k].pick.charAt(0)] = ", values[places[k].pick.charAt(0)]);
          // console.log("myValue < other --> ", myValue  < values[places[k].pick.charAt(0)]);

          if(myValue < values[places[k].pick.charAt(0)]) {
            numb++;
          }
        }
      }

      // console.log("Rank = ", numb);
      
      update(ref(database, '/game/order/' + user.uid), {
        rank: numb,
      });

      if(numb === 1) {
        set(ref(database, '/game/contractor'), {
          name: user.displayName,
          uid: user.uid,
        });
      }
      /*
      const msgRef = ref(database, 'messages/');
      const newItem = push(msgRef);

      set(newItem, 
          {
              createdAt: serverTimestamp(),
              msg: user.displayName+" is contractor N°"+numb,
              name: "[J@rvis]",
              uid: "basic101",
          });
      */

      return numb;
    }
      
    // className="h-full w-full flex flex-col text-white bg-[#121212] inset-y-0"

  return (

    <div>
    
    {
        isOrderSet
            ?
        <BoardGame
          players={places}
          rank={getRank()}
        />
            :
        <DeckChoice />
    }
   
    </div>

  )
}

export default FirstBoard;