// eslint-disable-next-line no-unused-vars
import { Component, h, createRef } from 'preact';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import CssTransition from '../css_transition';
import Skin from '../skin/Skin';

const PAGELOADING = 0;
const READY = 1;
const SLIDING = 2;
const FINISHED = 3;

const STATE_NAMES = new Map( [
	[ PAGELOADING, 'loading' ],
	[ READY, 'ready' ],
	[ SLIDING, 'sliding' ],
	[ FINISHED, 'finished' ]
] );

export default class BannerTransition extends Component {
	ref = createRef();

	static propTypes = {
		/** callback when transition finishes */
		onFinish: PropTypes.func,

		/** A registration callback to expose this.displayBanner to the parent */
		registerDisplayBanner: PropTypes.func.isRequired,

		/** Skin Adjuster to move the page content down */
		skinAdjuster: PropTypes.instanceOf( Skin ),

		/** if the sliding area should be fixed or absolute. Default is "false" (absolute) */
		fixed: PropTypes.bool,

		/** time in milliseconds that the transition should take */
		transitionSpeed: PropTypes.number
	};

	constructor( props ) {
		super( props );
		this.transition = new CssTransition( this.props.transitionSpeed, 'ease-in-out' );
		this.state = {
			transitionPhase: PAGELOADING
		};
	}

	componentDidMount() {
		this.props.registerDisplayBanner( this.displayBanner );
		this.setState( { transitionPhase: READY } );
	}

	getHeight() {
		return this.ref.current ? this.ref.current.offsetHeight : 0;
	}

	displayBanner = () => {
		this.setState( { transitionPhase: SLIDING } );
		this.props.skinAdjuster.addSpace( this.ref.current.offsetHeight, this.transition );
	};

	onTransitionEnd = () => {
		// TODO: Discover why this is being called multiple times
		if ( this.state.transitionPhase === FINISHED ) {
			return;
		}
		this.setState( { transitionPhase: FINISHED } );
		if ( this.props.onFinish ) {
			this.props.onFinish();
		}
	};

	// eslint-disable-next-line no-unused-vars
	render( props, state, context ) {
		let bannerStyle;

		switch ( state.transitionPhase ) {
			case PAGELOADING:
				bannerStyle = {};
				break;
			case READY:
				bannerStyle = { top: this.ref.current.offsetHeight * -1 };
				break;
			case SLIDING:
				bannerStyle = { top: 0, transition: this.transition.createTransitionValue( 'top' ) };
				break;
			case FINISHED:
				bannerStyle = { top: 0 };
		}
		return <div style={ bannerStyle } ref={this.ref}
			className={ classNames(
				`banner-position--state-${STATE_NAMES.get( state.transitionPhase ) }`,
				{
					'banner-position': true,
					'banner-position--fixed': props.fixed
				}
			)}
			onTransitionEnd={ this.onTransitionEnd }>
			{ props.children }
		</div>;
	}
}
