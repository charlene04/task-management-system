/* eslint-disable @typescript-eslint/no-var-requires */
const io = require('socket.io-client');
const socket = io('http://localhost:3000/websocket');

socket.on('connect', () => {
  console.log('Connected to the server');
});

socket.on('disconnect', () => {
  console.log('Disconnected from the server');
});

socket.on('liveData', (data) => {
  console.log('Live data received:', data);
});
