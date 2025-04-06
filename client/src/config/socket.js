
import { io } from 'socket.io-client';

const SOCKET_SERVER_URL = 'http://192.168.1.143:4000';

console.log(`Intentando conectar a: ${SOCKET_SERVER_URL}`);

const socket = io(SOCKET_SERVER_URL, {
  reconnectionAttempts: 5,
  reconnectionDelay: 1000,
});



export default socket;