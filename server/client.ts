import io from 'socket.io-client';

const token = 'SECRET_KEY';
const socket = io('http://localhost:5000', {
  query: { token },
});

socket.on('connect', function () {
  console.log('[client] connected');
});

socket.on('status', (status: any) => {
  console.log('[status]', status);
});

socket.on('sensor', (data) => {
  console.log('[sensor]', data);
});

socket.on('disconnect', function () {
  console.log('[client ]disconnected');
});
