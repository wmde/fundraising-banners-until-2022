// eslint-disable-next-line no-unused-vars
import { Component, h, createRef } from 'preact';
import { onMediaWiki } from '../shared/mediawiki_checks';
import classNames from 'classnames';
import PropTypes from 'prop-types';

const PENDING = 0;
const VISIBLE = 1;
const CLOSED = 2;

export default class Banner extends Component {

	static propTypes = {
		/** callback when banner closes */
		onClose: PropTypes.func
	}

	ref = createRef();

	constructor( props ) {
		super( props );
		this.state = {
			displayState: PENDING
		};
	}

	componentDidMount() {
		setTimeout(() => this.setState( { displayState: VISIBLE } ), 500 );
	}

	closeBanner = e => {
		this.props.trackingData.eventTracker.trackBannerEvent( 'banner-closed', 0, 0, this.props.trackingData.bannerCloseTrackRatio );
		e.preventDefault();
		this.setState( { displayState: CLOSED } );
		this.props.onClose();
	};

	// eslint-disable-next-line no-unused-vars
	render( props, state, context ) {

		return <div
			className={classNames(
				'wmde-banner',
				state.displayState === CLOSED ? 'wmde-banner--hidden' : '',
				state.displayState === VISIBLE ? 'wmde-banner--visible' : ''
			)}
			ref={this.ref}>
			<div className="banner-wrapper">
				banner
				<button onClick={this.closeBanner}>close</button>
			</div>
		</div>;
	}

}
