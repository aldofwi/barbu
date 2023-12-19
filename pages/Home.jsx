
import React from 'react';

import { useAuthContext } from '@/context/AuthContext';
import { useState, useEffect } from 'react';

import Chat from './Chat';
import Welcome from './Welcome';
import Navbar from '@/pages/Navbar';
import { onValue, ref, set } from 'firebase/database';
import { database } from '@/firebase/config';

const Home = () => {

    const { user }                  = useAuthContext();
    const [connected, setConnected] = useState([]);

    // set(ref(database, 'game/current/'), {
    //   contract: "",
    //   nbClic: 0,
    //   hasToPlay: "SOUTH",
    //   endOfContract: true,
    // });

    // await set(ref(database, 'game/players/n3gYoJQyeHhCKzr3WGFybc8nIdb2'), {
    //   picture: "https://lh3.googleusercontent.com/a/ACg8ocJKrBneCAOjhDLhJtFY5SQlvjtrntczP19Gp3LhYCI-Zw=s96-c",
    //   rank: 1,
    //   uid: "n3gYoJQyeHhCKzr3WGFybc8nIdb2",
    //   username: "Player 1",
    // });

    // await set(ref(database, 'game/players/n3gYoJQyeHhCKzr3WGFybc8nIdb3'), {
    //   picture: "https://lh3.googleusercontent.com/a/ACg8ocJKrBneCAOjhDLhJtFY5SQlvjtrntczP19Gp3LhYCI-Zw=s96-c",
    //   rank: 2,
    //   uid: "n3gYoJQyeHhCKzr3WGFybc8nIdb3",
    //   username: "Player 2",
    // });

    // await set(ref(database, 'game/players/n3gYoJQyeHhCKzr3WGFybc8nIdb4'), {
    //   picture: "https://lh3.googleusercontent.com/a/ACg8ocJKrBneCAOjhDLhJtFY5SQlvjtrntczP19Gp3LhYCI-Zw=s96-c",
    //   rank: 3,
    //   uid: "n3gYoJQyeHhCKzr3WGFybc8nIdb4",
    //   username: "Player 3",
    // });

    // await set(ref(database, 'game/players/n3gYoJQyeHhCKzr3WGFybc8nIdb5'), {
    //   picture: "https://lh3.googleusercontent.com/a/ACg8ocJKrBneCAOjhDLhJtFY5SQlvjtrntczP19Gp3LhYCI-Zw=s96-c",
    //   rank: 4,
    //   uid: "n3gYoJQyeHhCKzr3WGFybc8nIdb5",
    //   username: "Player 4",
    // });

    useEffect(() => {
  
      onValue(
        ref(database, 'users/' ), (snapshot) => {
          let users = [];
            snapshot.forEach((doc) => {
              users.push({...doc.val() });
            });
            setConnected(users);
        }
      );
  
    }, []);

  // className="h-full w-full flex flex-col text-white bg-[#121212] inset-y-0"
  // className="h-full flex flex-col bg-[#121212] container justify-center items-center"

  return (
    <div className="utility__page">

        <Navbar users={connected} />
        <Chat users={connected} />

        <div className="absolute bg-[#121212] text-white bottom-0 top-28 left-0 right-96">
          <Welcome users={connected} />
        </div>
    </div>
  )};

export default Home;