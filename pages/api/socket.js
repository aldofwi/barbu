import { io } from 'socket.io-client';

const ENDPOINT = process.env.NODE_ENV === 'production' ? 'https://barbu-server.vercel.app' : 'http://localhost:3000/';

export const barbuWS = io(ENDPOINT);