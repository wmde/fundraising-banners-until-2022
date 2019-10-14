{ #if !runAnimation }
	<span class="text__paragraph--highlight">
		<slot></slot>
	</span>
{ :else }
	<span class="text__paragraph--highlight" in:highlightText>
		<slot></slot>
	</span>
{ /if }

<script>
	import { isMobileFullpageVisible } from '../stores.js';
	export let runAnimation = false;

	isMobileFullpageVisible.subscribe( isVisible => {
		setTimeout( function() {
			runAnimation = isVisible;
		}, 1500 );
	} );

	function highlightText( node ) {
		const text = node.textContent;
		const duration = text.length * 20;

		return {
			duration,
			tick: percentage => {
				const characterPos = ~~( text.length * percentage );
				node.innerHTML = '<span class="marked">' + text.slice( 0, characterPos ) + '</span>' + text.slice( characterPos );
			}
		};
	}
</script>