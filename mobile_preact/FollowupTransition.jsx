// eslint-disable-next-line no-unused-vars
import { Component, createRef, h } from 'preact';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import CssTransition from '../shared/css_transition';
import Skin from '../shared/skin/Skin';

const PAGELOADING = 0;
const READY = 1;
const SLIDING_FIRST_PART = 2;
const SLIDING_SECOND_PART = 3;
const FINISHED = 4;

/*
 * The FollowupTransition is a second transition that takes place when
 * displaying a full page banner that replaces a mini banner. The mini
 * banner is hidden and the full page page slides in from the top.

 * The downwards animation of the banner must first fill the space left
 * by the vanished mini banner, then it must look like it's "pushing down"
 * the rest of the page, while maintaining an overall smooth animation style.
 */
export default class BannerTransition extends Component {
	ref = createRef();

	static propTypes = {
		/** callback when transition finishes */
		onFinish: PropTypes.func,

		/** A registration callback to expose this.displayBanner to the parent */
		registerDisplayBanner: PropTypes.func.isRequired,

		/** Transition duration in milliseconds */
		transitionDuration: PropTypes.number,

		/** Skin Adjuster to move the page content down */
		skinAdjuster: PropTypes.instanceOf( Skin ),

		/** if the sliding area should be fixed or absolute. Default is "false" (absolute) */
		fixed: PropTypes.bool
	};

	constructor( props ) {
		super( props );
		this.state = {
			transitionPhase: PAGELOADING,
			twoPhaseSlide: true,
			previousTransitionHeight: 0
		};
	}

	componentDidMount() {
		this.props.registerDisplayBanner( this.displayBanner );
		this.setState( { transitionPhase: READY } );
	}

	adjustSkin( speed, easing ) {
		this.props.skinAdjuster.addSpace(
			this.ref.current.offsetHeight,
			new CssTransition( speed, easing ),
		);
	}

	/**
	 * Get ratio between the height of the previous (mini) banner and the full page banner.
	 *
	 * getFirstPartDuration and getSecondPartDuration use this ratio to calculate the
	 * transition duration for each transition phase.
	 *
	 * @return {number}
	 */
	getPhaseRatio = () => this.state.previousTransitionHeight / this.ref.current.offsetHeight;
	getFirstPartDuration = () => Math.round( this.props.transitionDuration * this.getPhaseRatio() );
	getSecondPartDuration = () => Math.round( this.props.transitionDuration * ( 1 - this.getPhaseRatio() ) );

	/**
	 * Start the transition
	 *
	 * To calculate the transition duration of the two animation phases, the method needs the
	 * height of the previous (mini) banner. If the given height is falsy (including 0) or greater
	 * than the height of the the full page banner, the transition will use only one phase.
	 * This behavior is a "soft" error handling and should be investigated and mitigated
	 * by the calling code.
	 *
	 * @param {number} previousHeight
	 */
	displayBanner = ( previousHeight ) => {
		// Skip 2-phase animation if previousHeight has bad value
		if ( previousHeight === 0 || previousHeight > this.ref.current.offsetHeight ) {
			this.setState( {
				previousTransitionHeight: 0,
				twoPhaseSlide: false,
				transitionPhase: SLIDING_SECOND_PART
			} );
			this.adjustSkin( this.props.transitionDuration, 'ease-in-out' );
			return;
		}

		// Otherwise start first slide
		this.setState( {
			previousTransitionHeight: previousHeight,
			transitionPhase: SLIDING_FIRST_PART
		} );
	};

	onTransitionEnd = () => {
		switch ( this.state.transitionPhase ) {
			case SLIDING_FIRST_PART:
				this.setState( { transitionPhase: SLIDING_SECOND_PART } );
				this.adjustSkin( this.getSecondPartDuration(), 'ease-out' );
				break;
			case SLIDING_SECOND_PART:
				this.setState( { transitionPhase: FINISHED } );
				if ( this.props.onFinish ) {
					this.props.onFinish();
				}
				break;
		}
	};

	// eslint-disable-next-line no-unused-vars
	render( props, state, context ) {
		let bannerStyle, easing;

		switch ( state.transitionPhase ) {
			case PAGELOADING:
				bannerStyle = {};
				break;
			case READY:
				bannerStyle = { top: this.ref.current.offsetHeight * -1 };
				break;
			case SLIDING_FIRST_PART:
				bannerStyle = {
					top: ( this.ref.current.offsetHeight - state.previousTransitionHeight ) * -1,
					transition: `top ${this.getFirstPartDuration()}ms ease-in`
				};
				break;
			case SLIDING_SECOND_PART:
				easing = state.twoPhaseSlide ? 'ease-out' : 'ease-in-out';
				bannerStyle = {
					top: 0,
					transition: `top ${this.getSecondPartDuration()}ms ${easing}`
				};
				break;
			case FINISHED:
				bannerStyle = { top: 0 };
		}
		return <div style={ bannerStyle } ref={this.ref}
			className={ classNames( {
				'banner-position': true,
				'banner-position--fixed': props.fixed
			} ) }
			onTransitionEnd={ this.onTransitionEnd }
		>
			{ props.children }
		</div>;
	}
}
