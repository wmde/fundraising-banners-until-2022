<template>
	<div>
		<slot></slot>
	</div>
</template>

<script>
import BannerEvents from "../../desktop/events";

export default {
	name: "BannerFitter",
	inject: [ 'eventBus', 'skinAdjuster' ],
	mounted() {
		this.eventBus.$emit( BannerEvents.BANNER_DIMENSIONS, { width: this.$el.clientWidth, height: this.$el.clientHeight } );
		window.addEventListener( 'resize', this.onResize );
	},
	methods: {
		onResize() {
			this.eventBus.$emit( BannerEvents.BANNER_DIMENSIONS, { width: this.$el.clientWidth, height: this.$el.clientHeight } );
			this.skinAdjuster.addSpaceInstantly( this.$el.clientHeight );
		}
	}
}
</script>
