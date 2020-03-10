// eslint-disable-next-line no-unused-vars
import { Component, h, Fragment, createRef } from 'preact';
import DesktopBanner from './components/DesktopBanner';
import MobileBanner from './components/MobileBanner';
import TranslationContext from '../shared/components/TranslationContext';
import { Slider } from '../shared/banner_slider';
import classNames from 'classnames';
import BannerTransition from '../shared/components/BannerTransition';
import MiniBanner from '../mobile_preact/components/MiniBanner';
import FollowupTransition from '../shared/components/FollowupTransition';
import MobileBannerFullpage from './components/MobileBannerFullpage';

const PENDING = 0;
const VISIBLE = 1;
const CLOSED = 2;

export default class Banner extends Component {
	constructor( props ) {
		super( props );
		this.state = { bannerVisible: true };


		//TODO set state pending



		this.transitionToFullpage = () => {};
		this.startHighlight = () => {};
		this.slideInBanner = () => {};
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
		//  TODO what has to be
		//   tracked on wikipediade? probably more than on mobile, because it combines more channels?
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

	registerBannerTransition = ( cb ) => {
		this.slideInBanner = cb;
	}

	registerStartProgressbar = ( startPb ) => {
		this.startProgressbar = startPb;
	};

	registerBannerTransition = cb => { this.slideInBanner = cb; };
	registerFullpageBannerTransition = cb => { this.transitionToFullpage = cb; };
	registerStartHighlight = cb => { this.startHighlight = cb; };



	// eslint-disable-next-line no-unused-vars
	render( props, state, context ) {
		const campaignProjection = props.campaignProjection;
		return <Fragment>
			<div className={classNames( {
				'wmde-banner': true,
				'wmde-banner--hidden': state.displayState === CLOSED,
				'wmde-banner--visible': state.displayState === VISIBLE,
				'wmde-banner--mini-banner': !state.isFullPageVisible,
				'wmde-banner--full-page': state.isFullPageVisible
			} )}>
				<TranslationContext.Provider value={props.translations}>
					<BannerTransition
						fixed={ true }
						registerDisplayBanner={ this.registerBannerTransition }
						onFinish={ this.startProgressbar }
						skinAdjuster={ props.skinAdjuster }
					>
						<DesktopBanner
							{ ...props}
							closeBanner={this.closeBanner}
							bannerVisible={this.state.bannerVisible}
						/>
					</BannerTransition>




					<BannerTransition
						fixed={ true }
						registerDisplayBanner={ this.registerBannerTransition }
						onFinish={ () => this.bannerSlider.enableAutoplay() }
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
						onFinish={ () => { this.startHighlight(); } }
						previousTransition={ this.miniBannerTransitionRef }
						transitionDuration={ 1250 }
						skinAdjuster={ props.skinAdjuster }
					>
						<MobileBannerFullpage
							{...props}
							registerStartHighlight={this.registerStartHighlight}
							onClose={ this.closeBanner }
							bannerVisible={this.state.bannerVisible}
						/>
					</FollowupTransition>






				</TranslationContext.Provider>
			</div>
		</Fragment>;
	}

}
