<script lang="ts">
	import { mutation } from '@urql/svelte';

	const mutateLed = mutation({
		query: `
	    mutation {
	      led
	    }
	  `
	});

	function changeLed() {
		mutateLed();
		console.log('test');
	}
</script>

<button on:click={changeLed}>Set LED</button>
