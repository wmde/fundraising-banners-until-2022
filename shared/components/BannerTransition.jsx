// eslint-disable-next-line no-unused-vars
import { Component, h, createRef } from 'preact';
import PropTypes from 'prop-types';

const PAGELOADING = 0;
const READY = 1
const SLIDING = 2;
const FINISHED = 3;

export default class BannerTransition extends Component {
	ref = createRef();

	static propTypes = {
		/** callback when transition finishes */
		onFinish: PropTypes.func,
		/** */
		registerDisplayBanner: PropTypes.func.isRequired
	}

	constructor( props ) {
		super( props );
		this.state = {
			displayState: PAGELOADING
		};
	}

	componentDidMount() {
		this.props.registerDisplayBanner( () => this.setState( { displayState: SLIDING } ) );
		this.setState( { displayState: READY } );
	}

	onTransitionEnd = () => {
		this.setState( { displayState: FINISHED } );
		if ( this.props.onFinish ) {
			this.props.onFinish();
		}
	}

	render( props, state, context ) {
		let bannerStyle;

		switch ( state.displayState ) {
			case PAGELOADING:
				bannerStyle = {};
				break;
			case READY:
				bannerStyle = { top: this.ref.current.offsetHeight * -1 };
				break;
			case SLIDING:
				bannerStyle = { top: 0, transition: 'top 1s ease-in-out' };
				break;
			case FINISHED:
				bannerStyle = { top: 0 };
		}
		return <div style={ bannerStyle } ref={this.ref}
					className='banner-position'
					onTransitionEnd={ this.onTransitionEnd}>
			{ props.children }
		</div>;
	}
}
