// eslint-disable-next-line no-unused-vars
import { Component, h, createRef } from 'preact';
import { onMediaWiki } from '../shared/mediawiki_checks';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import BannerTransition from '../shared/components/BannerTransition';

const PENDING = 0;
const VISIBLE = 1;
const CLOSED = 2;

export default class Banner extends Component {

	static propTypes = {
		/** callback when banner closes */
		onClose: PropTypes.func,
		/** */
		registerDisplayBanner: PropTypes.func.isRequired
	}

	ref = createRef();

	constructor( props ) {
		super( props );
		this.state = {
			displayState: PENDING,
			bannerTop: -350
		};
		this.slideInBanner = () => {};
	}

	componentDidMount() {
		this.props.registerDisplayBanner(
			() => {
				this.setState( { displayState: VISIBLE } );
				this.slideInBanner();
			}
		);
	}

	closeBanner = e => {
		this.props.trackingData.eventTracker.trackBannerEvent( 'banner-closed', 0, 0, this.props.trackingData.bannerCloseTrackRatio );
		e.preventDefault();
		this.setState( { displayState: CLOSED } );
		this.props.onClose();
	};

	registerBannerTransition = ( cb ) => {
		this.slideInBanner = cb;
	}

	// eslint-disable-next-line no-unused-vars
	render( props, state, context ) {

		return <div
			className={classNames(
				'wmde-banner',
				state.displayState === CLOSED ? 'wmde-banner--hidden' : '',
				state.displayState === VISIBLE ? 'wmde-banner--visible' : ''
			)}
			ref={this.ref}>
			<BannerTransition registerDisplayBanner={ this.registerBannerTransition } >
				<div className="banner-wrapper">
					banner
					<button onClick={this.closeBanner}>close</button>
				</div>
			</BannerTransition>
		</div>;
	}

}
