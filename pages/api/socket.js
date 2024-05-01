import { io } from 'socket.io-client';

const ENDPOINT = process.env.NODE_ENV === 'production' ? 'https://barbu.vercel.app' : 'http://localhost:3000/';
