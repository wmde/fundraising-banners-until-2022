// eslint-disable-next-line no-unused-vars
import { Component, h, createRef } from 'preact';
import classNames from 'classnames';
import { Slider } from '../shared/banner_slider';

import BannerTransition from '../shared/components/BannerTransition';
import MiniBanner from './components/MiniBanner';
import TranslationContext from '../shared/components/TranslationContext';

const PENDING = 0;
const VISIBLE = 1;
const CLOSED = 2;

export default class Banner extends Component {
	constructor( props ) {
		super( props );
		this.state = {
			displayState: PENDING,
			isFullPageVisible: false
		};
		this.animateHighLight = () => {};
	}

	componentDidMount() {
		this.bannerSlider = new Slider( this.props.sliderAutoPlaySpeed );
		this.bannerSlider.initialize();
		this.bannerSlider.disableAutoplay();

		this.props.registerDisplayBanner(
			() => {
				this.setState( { displayState: VISIBLE } );
				this.slideInBanner();
			}
		);
	}

	// eslint-disable-next-line no-unused-vars
	showFullPageBanner = e => {
		this.props.trackingData.tracker.trackBannerEvent( 'mobile-mini-banner-expanded', 0, 0, this.props.trackingData.bannerClickTrackRatio );
		this.setState( { isFullPageVisible: true } );
		this.animateHighLight();
	};

	registerAnimateHighlight = cb => { this.animateHighLight = cb; };

	closeBanner = e => {
		// TODO get flickity slider position
		this.props.trackingData.tracker.trackBannerEvent( 'banner-closed', 0, 0, this.props.trackingData.bannerCloseTrackRatio );
		e.preventDefault();
		this.setState( {
			displayState: CLOSED,
			isFullPageVisible: false
		} );
		this.props.onClose();
	};

	registerBannerTransition = cb => { this.slideInBanner = cb; };

	// eslint-disable-next-line no-unused-vars
	render( props, state, context ) {
		const campaignProjection = props.campaignProjection;
		return <div className={classNames( {
			'wmde-banner': true,
			'wmde-banner--hidden': state.displayState === CLOSED,
			'wmde-banner--visible': state.displayState === VISIBLE,
			'wmde-banner--mini-banner': !state.isFullPageVisible,
			'wmde-banner--full-page': state.isFullPageVisible
		} )}>
			<TranslationContext.Provider value={ props.translations }>
				<BannerTransition
					fixed={ true }
					registerDisplayBanner={ this.registerBannerTransition }
					onFinish={ () => this.bannerSlider.enableAutoplay() }>
					<MiniBanner
						{ ...props }
						onClose={ this.closeBanner }
						campaignProjection={ campaignProjection }
						startAnimation={ () => {} }
						onExpandFullpage={ this.showFullPageBanner }/>

				</BannerTransition>
			</TranslationContext.Provider>
		</div>;
	}
}
