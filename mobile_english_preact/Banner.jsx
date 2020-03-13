// eslint-disable-next-line no-unused-vars
import { Component, h, createRef } from 'preact';
import classNames from 'classnames';
import { Slider } from '../shared/banner_slider';

import BannerTransition from '../shared/components/BannerTransition';
import MiniBanner from './components/MiniBanner';
import TranslationContext from '../shared/components/TranslationContext';
import FollowupTransition from '../shared/components/FollowupTransition';
import FullpageBanner from './components/FullpageBanner';

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
		this.transitionToFullpage = () => {};
		this.startHighlight = () => {};
		this.adjustFollowupBannerHeight = () => {};
	}

	miniBannerTransitionRef = createRef();

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
		this.props.trackingData.tracker.trackBannerEvent(
			'mobile-mini-banner-expanded',
			this.bannerSlider.getViewedSlides(),
			this.bannerSlider.getCurrentSlide(),
			this.props.trackingData.bannerClickTrackRatio
		);
		window.scrollTo( 0, 0 );
		const miniBannerHeight = this.miniBannerTransitionRef.current ? this.miniBannerTransitionRef.current.base.offsetHeight : 0;
		this.transitionToFullpage( miniBannerHeight );
		this.setState( { isFullPageVisible: true } );
	};

	closeBanner = e => {
		this.props.trackingData.tracker.trackBannerEvent(
			'banner-closed',
			this.bannerSlider.getViewedSlides(),
			this.bannerSlider.getCurrentSlide(),
			this.props.trackingData.bannerCloseTrackRatio
		);
		e.preventDefault();
		this.setState( {
			displayState: CLOSED,
			isFullPageVisible: false
		} );
		this.props.onClose();
	};

	registerBannerTransition = cb => { this.slideInBanner = cb; };
	registerFullpageBannerTransition = cb => { this.transitionToFullpage = cb; };
	registerStartHighlight = cb => { this.startHighlight = cb; };
	registerAdjustFollowupBannerHeight = cb => { this.adjustFollowupBannerHeight = cb; };
	onMiniBannerSlideInFinished = () => {
		this.bannerSlider.enableAutoplay();
		this.adjustFollowupBannerHeight( this.miniBannerTransitionRef.current.getHeight() );
	};

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
					onFinish={ this.onMiniBannerSlideInFinished }
					skinAdjuster={ props.skinAdjuster }
					ref={this.miniBannerTransitionRef}
				>
					<MiniBanner
						{ ...props }
						onClose={ this.closeBanner }
						campaignProjection={ campaignProjection }
						startAnimation={ () => {} }
						onExpandFullpage={ this.showFullPageBanner }/>

				</BannerTransition>
				<FollowupTransition
					registerDisplayBanner={ this.registerFullpageBannerTransition }
					registerFirstBannerFinished={ this.registerAdjustFollowupBannerHeight }
					onFinish={ () => { this.startHighlight(); } }
					transitionDuration={ 1250 }
					skinAdjuster={ props.skinAdjuster }
					hasStaticParent={ false }
				>
					<FullpageBanner
						{...props}
						registerStartHighlight={this.registerStartHighlight}
						onClose={ this.closeBanner }
					/>
				</FollowupTransition>
			</TranslationContext.Provider>
		</div>;
	}
}
