import { Server } from 'socket.io-client';

export default function SocketHandler(req, res) {

    const bio = Server(res.socket.server);
    res.socket.server.io = bio;

    bio.on("connection", (socket) => {

        socket.on("sendtxt", (obj) => {
            bio.emit("messagetxt", obj);
        });
    });

    console.log("socket.js --- Setting Socket.");
    res.end();
}


// const ENDPOINT = process.env.NODE_ENV === 'production' ? undefined : 'http://localhost:3000/';
// console.log('00 - socketConfig --- Process.env.NODE_ENV =', process.env.NODE_ENV);
// const barbuWS = socketBarbu(ENDPOINT);
// export default barbuWS;