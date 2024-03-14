import { useAuthContext } from '@/context/AuthContext';
import { database } from '@/firebase/config';
import { get, onValue, ref, set, update } from 'firebase/database';
import { useEffect, useState } from 'react';
import BoardGame from './BoardGame_';
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

const FirstBoard = async () => {

    // const { user } =   useAuthContext();
    // const [isOrderSet, setIsOrderSet] = useState(true);

    // getPositionByID when Order is setted.
    // pass positions to PlayerBox props.
    // Map players from database.

    const getRank = () => {

      let numb=1;
      let myCard;
      let myValue;
      let otherCards = [];

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

  return (

    <div>
    
      <BoardGame

      />
   
    </div>

  )
}

export default FirstBoard;

/*
 {
        isOrderSet
            ?
        <BoardGame
          players={players}
        />
            :
        <DeckChoice />
    }
*/

/*
    await set(ref(database, 'game/players/n3gYoJQyeHhCKzr3WGFybc8nIdb2'), {
      picture: "https://lh3.googleusercontent.com/a/ACg8ocJKrBneCAOjhDLhJtFY5SQlvjtrntczP19Gp3LhYCI-Zw=s96-c",
      rank: 1,
      uid: "n3gYoJQyeHhCKzr3WGFybc8nIdb2",
      username: "Player 1",
    });

    await set(ref(database, 'game/players/n3gYoJQyeHhCKzr3WGFybc8nIdb3'), {
      picture: "https://lh3.googleusercontent.com/a/ACg8ocJKrBneCAOjhDLhJtFY5SQlvjtrntczP19Gp3LhYCI-Zw=s96-c",
      rank: 2,
      uid: "n3gYoJQyeHhCKzr3WGFybc8nIdb3",
      username: "Player 2",
    });

    await set(ref(database, 'game/players/n3gYoJQyeHhCKzr3WGFybc8nIdb4'), {
      picture: "https://lh3.googleusercontent.com/a/ACg8ocJKrBneCAOjhDLhJtFY5SQlvjtrntczP19Gp3LhYCI-Zw=s96-c",
      rank: 3,
      uid: "n3gYoJQyeHhCKzr3WGFybc8nIdb4",
      username: "Player 3",
    });

    await set(ref(database, 'game/players/n3gYoJQyeHhCKzr3WGFybc8nIdb5'), {
      picture: "https://lh3.googleusercontent.com/a/ACg8ocJKrBneCAOjhDLhJtFY5SQlvjtrntczP19Gp3LhYCI-Zw=s96-c",
      rank: 4,
      uid: "n3gYoJQyeHhCKzr3WGFybc8nIdb5",
      username: "Player 4",
    });
*/