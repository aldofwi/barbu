import React, { useState } from 'react';
import { IconButton, Icon } from '@chakra-ui/react';
import { IoSend } from 'react-icons/io5'

const Chat = (props) => {

  const [users, setUsers]       = useState([]);
  const [message, setMessage]   = useState("");
  const [messages, setMessages] = useState([]);



  const submit = (event) => {
    event.preventDefault();

    // emit()
    setMessage("");
  }

  

  return (
    <div className="flex flex-col fixed mx-auto px-40 py-10 border text-white border-[#33353F] top-0 right-0 bottom-0 z-10 bg-[#121212] bg-opacity-100">
      <span className="flex font-[Stanley] text-blue-500 text-2xl font-bold">Messages</span>

            <div className="msg border rounded-lg w-11/12 h-10/12">

                {messages.slice(0).reverse().map(({ user, date, text }, index) => (

                    <div key={index} className="row small">

                        <div className="col-sm">

                            {moment(date).format("h:mma")}

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

                        </div>

                    </div>

                ))}

            </div>

            <div className="typetext">

                <form className='fixed bottom-12 right-20' onSubmit={submit} id="form">
                    
                  <input
                      type="text"
                      aria-label="Default"
                      className='fixed right-16 w-2/12 h-10 rounded-lg border-double border'
                      onChange={e => setMessage(e.currentTarget.value)}
                      placeholder="-> Type your text here"
                      value={message}
                      id="text"
                  />

                  <button id="submit" type="submit" className="fixed right-4">
                      <IconButton
                        variant='outline'
                        colorScheme='teal'
                        aria-label='Send msg'
                        icon={ <Icon as={IoSend} /> }
                      />
                  </button>

                </form>

            </div>
        
    </div>
)};

export default Chat;