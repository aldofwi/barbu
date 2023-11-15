import React, { useState, useEffect } from 'react';
import { useAuthContext } from '@/context/AuthContext';
import { IconButton, Icon } from '@chakra-ui/react';
import { IoSend } from 'react-icons/io5';
import moment from 'moment';
import { io } from 'socket.io-client';
import { barbuWS } from './api/socket';

const Chat = (props) => {

  const { user } = useAuthContext();

  const [users, setUsers]       = useState([]);
  const [message, setMessage]   = useState("");
  const [messages, setMessages] = useState([]);
  const [socket, setSocket] = useState("");
  
  useEffect(() => {
    //const socket = io("http://localhost:3000");

    barbuWS.on("messagetxt", (message) => {
      setMessages( messages => [...messages, message]);
    });

    setSocket(barbuWS);
  }, []);

  const submit = (event) => {
    event.preventDefault();

    barbuWS.emit("sendtxt", [message, user.displayName]);

    setMessage("");
  }

  console.log(messages);

  return (
    <div className="flex flex-col fixed mx-auto px-40 py-10 border text-white border-[#33353F] top-0 right-0 bottom-0 z-10 bg-[#121212] bg-opacity-100">
      <span className="flex font-[Stanley] text-blue-500 text-2xl font-bold">Messages</span>

            <div className="msg border flex flex-col-reverse rounded-lg w-11/12">

                {messages.slice(0).reverse().map(({ user, date, text }, index) => (

                    <div key={index}>

                      <div className="pl-2">

                            {moment(date).format("h:mma")}

                            {<b className="text-slate-500"> [{[user]}] </b>}

                            {<abbr className="text-white"> {text} </abbr>}

                      </div>

                    </div>

                ))}

            </div>

            <div className="typetext">

                <form className='fixed bottom-2 right-0' onSubmit={submit} id="form">
                    
                  <input
                      type="text"
                      aria-label="Default"
                      className='fixed right-16 w-2/12 h-10 rounded-lg border-double border text-black'
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