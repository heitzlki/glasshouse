<script>
	import io from 'socket.io-client';

	const token = 'SECRET_KEY';
	const socket = io('http://localhost:5000', {
		query: { token }
	});

	let sensor = '';

	socket.on('connect', function () {
		console.log('[client] connected');
	});

	socket.on('sensor', (data) => {
		console.log('[sensor]', data);
		sensor = data;
	});
</script>

<p>{sensor || '--'}</p>
