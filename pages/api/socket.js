import { io } from 'socket.io-client';

const ENDPOINT = process.env.NODE_ENV === 'production' ? 'http://barbu-server.vercel.app' : 'http://localhost:3000/';

export const barbuWS = io(ENDPOINT); 

// export default function SocketHandler(req, res) {

//     const io = new Server(res.socket.server);
//     res.socket.server.io = io;

//     io.on("connection", (socket) => {

//         socket.on("sendtxt", (obj) => {
//             io.emit("messagetxt", obj);
//         });
//     });

//     console.log("socket.js --- Setting Socket.");
//     res.end();
// }


// const ENDPOINT = process.env.NODE_ENV === 'production' ? undefined : 'http://localhost:3000/';
// console.log('00 - socketConfig --- Process.env.NODE_ENV =', process.env.NODE_ENV);
// const barbuWS = socketBarbu(ENDPOINT);
// export default barbuWS;