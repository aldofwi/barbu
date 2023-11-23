import React, { useState, useEffect } from 'react';

import { useAuthContext } from '@/context/AuthContext';
import { IconButton, Icon } from '@chakra-ui/react';
import { IoSend } from 'react-icons/io5';

import { collection, query, orderBy, where, getDocs } from 'firebase/firestore';
import { db } from '@/firebase/config';
import moment from 'moment';

import { useCollectionData } from 'react-firebase-hooks/firestore';

const Chat = () => {

  const { user } = useAuthContext();
  // const query = getDocs(collection(db, 'messages'));
  // const [messages] = useCollectionData(query);

  const [users, setUsers]         = useState([]);
  const [message, setMessage]     = useState("");
  const [messages, setMessages]   = useState([]);

  useEffect(() => {

    const handleMessages = async () => {
      const q = query(
        collection(db, "messages"),
        orderBy("createdAt")
        );

      try {
          console.log("------LOG------");
          const querySnapshot = await getDocs(q);

          querySnapshot.forEach((doc) => {
            //console.log(doc.data());
            setMessages( messages => [...messages, doc.data().msg])
          });

      } catch (error) { console.warn("Err --> ", error.message); }
    }

    handleMessages();
  }, []);
  

  const submit = (event) => {
    event.preventDefault();
    // setMessage("");
  }
  // if(q) console.log("Document data : ", q);
  // else console.log("No Such Document !");

  return (
    <div className="flex flex-col fixed mx-auto px-40 py-10 border text-white border-[#33353F] top-0 right-0 bottom-0 z-10 bg-[#121212] bg-opacity-100">
      <span className="flex font-[Stanley] text-blue-500 text-2xl font-bold">Messages</span>

            <div className="msg border flex flex-col-reverse rounded-lg w-11/12">

                {messages}

            </div>

            <div className="typetext">
                <form className='fixed bottom-2 right-0' onSubmit={submit} id="form">
                    
                  <input
                      type="text"
                      aria-label="Default"
                      className='fixed right-16 w-2/12 h-10 rounded-lg border-double border text-white'
                      onChange={e => setMessage(e.currentTarget.value)}
                      placeholder="   Type your text here"
                      value={message}
                      id="text"
                  />

                  <IconButton
                    id="submit"
                    type="submit"
                    className="fixed right-4"
                    variant='outline'
                    colorScheme='teal'
                    aria-label='Send msg'
                    icon={ <Icon as={IoSend} /> }
                  />

                </form>
            </div>
        
    </div>
)};

export default Chat;

/*


                            {
                                user === props.players[0]
                                      ?
                                      <b className="col-"><span className="dg"> [{[user]}] </span></b>
                                      :
                                      user === props.players[1]
                                            ?
                                            <b className="col-"><span className="db"> [{[user]}] </span></b>
                                            :
                                            user === props.players[2]
                                                  ?
                                                  <b className="col-"><span className="dr"> [{[user]}] </span></b>
                                                  :
                                                    user === props.players[3]
                                                          ?
                                                        <b className="col-"><span className="dc"> [{[user]}] </span></b>
                                                            :
                                                            user === "J@rvis"
                                                                ?
                                                            <b className="col-"> [{[user]}] </b>
                                                                :
                                                                <b className="col-"><em> [{[user]}] </em></b>
                            }

                        

                            {
                                user === "J@rvis"
                                      ?
                                <strong><abbr className="col-"> {text} </abbr></strong>
                                      :
                                    user === props.players[0]
                                        ?
                                    <span className="dg"><abbr className="col-"> {text} </abbr></span>
                                            :
                                        user === props.players[1]
                                                ?
                                            <span className="db"><abbr className="col-"> {text} </abbr></span>
                                                :
                                                user === props.players[2]
                                                    ?
                                                <span className="dr"><abbr className="col-"> {text} </abbr></span>
                                                          :
                                                    user === props.players[3]
                                                          ?
                                                    <span className="dc"><abbr className="col-"> {text} </abbr></span>
                                                          :
                                                          <b className="col-"> <em> {text} </em></b>
                            }


*/
  // useEffect(() => {
  //   socketInitializer();
  // }, []);

  // async function socketInitializer() {
  //   await fetch("/api/socket");

  //   socket = io();

  //   socket.on("messagetxt", (data) => {
  //     console.log(data);
  //     setMessages( messages => [...messages, message]);
  //   });
  // }