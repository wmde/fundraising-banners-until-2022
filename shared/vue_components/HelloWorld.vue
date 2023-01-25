<template>
	<div class="wmde-hello">
		WMDE Banner with a message: {{greeting}} {{planet}}
	</div>
</template>

<script>
export default {
props: {
		greeting: {
			type: String,
			default: "Ahoy"
		  }
	   },
		   data(){ 
	return { planet: 'World' }
		   }
}


// Composition api
/*
import { ref } from 'vue';

const props = defineProps({
		greeting: {
			type: String,
			default: "Ahoy"
		  }
	})

	const planet = ref('World');
 */
</script>

<style>
.wmde-hello {
	font-size: 200%;
	color: green;
	padding: 15px;
	border: solid 2px darkgreen;
}
</style>
