<template>
	<div v-bind:class="transitionClass"
	     v-bind:style="transitionStyle"
	     v-on:transitionend="onTransitionEnd"
	>
			<slot></slot>
	</div>
</template>

<script>

import CssTransition from "../css_transition";

const LOADING = 0
const READY = 1;
const SLIDING = 2;
const FINISHED = 3;

const STATE_NAMES = new Map( [
		[ LOADING, 'loading' ],
	[ READY, 'ready' ],
	[ SLIDING, 'sliding' ],
	[ FINISHED, 'finished' ]
] );

export default {
    name: "BannerTransition",
	data() {
			return {
				transitionState: LOADING,
				transition: new CssTransition( this.transitionSpeed, 'ease-in-out' )
			}
	},
	mounted() {
			this.transitionState = READY;
	},
	props: {
			transitionSpeed: {
				type: Number,
				default: 1000
			},
			fixed: {
				type: Boolean,
				default: false
			}
	},
	inject: [ 'skinAdjuster' ],
	computed: {
		transitionClass() {
			const cls = [
					'banner-position',
					`banner-position--${STATE_NAMES.get(this.transitionState)}`
			];
			if (this.fixed) {
				cls.push( 'banner-position--fixed' );
			}
			return cls;
		},
		transitionStyle() {
			let bannerStyle;
			switch ( this.transitionState ) {
				case LOADING:
					bannerStyle = {};
					break;
				case READY:
					bannerStyle = { top: `${this.$el.clientHeight * -1}px` };
					break;
				case SLIDING:
					bannerStyle = { top: 0, transition: this.transition.createTransitionValue( 'top' ) };
					break;
				case FINISHED:
					bannerStyle = { top: 0 };
			}
			return bannerStyle;
		}
	},
	methods: {
			startTransition() {
				this.transitionState = SLIDING;
				this.skinAdjuster.addSpace( this.$el.clientHeight, this.transition );
			},
			onTransitionEnd() {
				this.transitionState = FINISHED;
				this.$emit( 'transition-finished' )

			}
	}
}
</script>
