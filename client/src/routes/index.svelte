<script lang="ts">
	import Led from '../lib/led.svelte';
	import Sensor from '../lib/sensor.svelte';
	import { initClient } from '@urql/svelte';

	initClient({
		url: 'http://localhost:4000/'
	});
</script>

<Led />
<Sensor />
