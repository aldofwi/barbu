import React, { useState, useEffect } from 'react';

import { useAuthContext } from '@/context/AuthContext';
import { IconButton, Icon } from '@chakra-ui/react';
import { IoSend } from 'react-icons/io5';

import { database } from "../firebase/config";
import { onValue, push, ref, set, serverTimestamp } from "firebase/database";

const Chat = (props) => {

  const { user } = useAuthContext();

  const [message, setMessage]     = useState("");
  const [messages, setMessages]   = useState([]);

  const colorVariants = [
    'text-blue-500',
    'text-green-500',
    'text-gray-500',
    'text-orange-500',
    'text-yellow-500',
    'text-amber-800',
    'text-pink-500',
    'text-cyan-500',
    'text-white-500',
    'text-purple-500',
  ]

  useEffect(() => {

    onValue(
      ref(database, 'messages/' ), (snapshot) => {
        let messages = [];
          snapshot.forEach((doc) => {
            messages.push({...doc.val(), id: doc.id });
          });
          setMessages(messages);
      }
    );

  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if(message === "") return;

    const msgRef = ref(database, 'messages/');
    const newItem = await push(msgRef);

    await set(newItem, 
    {
        createdAt: serverTimestamp(),
        msg: message,
        name: user.displayName,
        uid: user.uid,
    });

    setMessage("");
  }

  const getColorByPlayer = (username) => {
    let indice = 3;
    props.users.map((person, i) => {
      if(username === person.username) indice = i;
    });
    return indice;
  }

  //  inset-y-0 right-0 --> top-0 right-0 bottom-0

  return (  
    <div className="flex flex-col fixed mx-auto px-40 py-10 border text-white border-[#33353F] inset-y-0 right-0 z-10 bg-[#121212] bg-opacity-100">
      <span className="flex font-[Stanley] text-blue-500 text-2xl font-bold">Messages</span>

            <div className="msg border flex flex-col-reverse rounded-lg w-11/12">

              {
                messages.slice(0).reverse().map((message, i) => 
                
                  message.name === "[J@rvis]"
                        ?
                    <p key={i} className="text-base pl-1">
                      <abbr> {message.name} </abbr>
                      <b className='text-red-500'> {message.msg} </b>
                    </p>
                        :
                    <p key={i} className="text-base pl-1">
                        <abbr className={`${colorVariants[getColorByPlayer(message.name)]}`}> {message.name} </abbr>
                        <abbr className="text-slate-100"> {message.msg} </abbr>
                    </p>
                
              )}

            </div>

            <div className="typetext">
                <form className='fixed bottom-2 right-0' onSubmit={handleSubmit} id="form">
                    
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
                  {messages?.map((doc, index) =>{
                    <div key={index}>{doc.msg}</div>
                  })}

                  {Object.entries(messages)?.map((msg) =>{
                    <div key={msg.uid}>{msg}</div>
                  })}

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