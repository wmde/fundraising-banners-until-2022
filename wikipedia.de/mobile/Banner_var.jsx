import { Component, h, createRef } from 'preact';
import classNames from 'classnames';
import { Slider } from '../../shared/banner_slider_keen';
import debounce from '../../shared/debounce';

import BannerTransition from '../../shared/components/BannerTransition';
import MiniBanner from './components/MiniBanner_var';
import TranslationContext from '../../shared/components/TranslationContext';
import FollowupTransition from '../../shared/components/FollowupTransition';
import FullpageBanner from './components/FullpageBanner_var';
import PropTypes from 'prop-types';
import FundsModal from '../../shared/components/ui/use_of_funds/FundsModal';
import FundsDistributionAccordion from '../../shared/components/ui/use_of_funds/FundsDistributionAccordion';

const PENDING = 0;
const VISIBLE = 1;
const CLOSED = 2;

const SLIDESHOW_START_DELAY = 2000;

export const BannerType = Object.freeze( {
	CTRL: Symbol( 'ctrl ' ),
	VAR: Symbol( 'var' )
} );

export default class Banner extends Component {

	static propTypes = {
		/** callback when banner closes */
		onClose: PropTypes.func,
		/** callback when banner gets submitted */
		onSubmit: PropTypes.func
	}

	constructor( props ) {
		super( props );
		this.state = {
			displayState: PENDING,
			isFullPageVisible: false,
			isFundsModalVisible: false
		};
		this.transitionToFullpage = () => {};
		this.startHighlight = () => {};
		this.adjustFollowupBannerHeight = () => {};
		this.fullPageBannerReRender = () => {};
		this.startProgressBarInMiniBanner = () => {};
	}

	miniBannerTransitionRef = createRef();
	fullBannerTransitionRef = createRef();

	componentDidMount() {
		this.bannerSlider = new Slider( this.props.sliderAutoPlaySpeed );
		this.bannerSlider.initialize();

		this.props.registerDisplayBanner(
			() => {
				this.setState( { displayState: VISIBLE } );
				this.slideInBanner();
			}
		);

		this.props.skinAdjuster.addSpaceInstantly( this.miniBannerTransitionRef.current.getHeight() );
		this.props.registerResizeBanner( debounce( this.onPageResize.bind( this ), 200 ) );
	}

	onPageResize() {
		if ( this.state.displayState !== VISIBLE ) {
			return;
		}

		if ( this.state.isFullPageVisible ) {
			this.props.skinAdjuster.addSpaceInstantly( this.getFullBannerHeight() );
			this.fullPageBannerReRender();
		} else {
			this.bannerSlider.resize();
			this.props.skinAdjuster.addSpaceInstantly( this.getMiniBannerHeight() );
			this.adjustFollowupBannerHeight( this.miniBannerTransitionRef.current.getHeight() );
		}
	}

	// eslint-disable-next-line no-unused-vars
	showFullPageBanner = e => {
		this.props.trackingData.tracker.trackBannerEvent(
			'mobile-mini-banner-expanded',
			this.bannerSlider.getViewedSlides(),
			this.bannerSlider.getCurrentSlide(),
			this.props.trackingData.bannerClickTrackRatio
		);
		this.bannerSlider.disableAutoplay();
		window.scrollTo( 0, 0 );
		this.transitionToFullpage( this.getMiniBannerHeight() );
		this.setState( { isFullPageVisible: true } );
	};

	toggleFundsModal = e => {
		e.preventDefault();
		const currentlyVisible = this.state.isFundsModalVisible;
		if ( !currentlyVisible ) {
			this.props.trackingData.tracker.trackBannerEvent( 'application-of-funds-shown', 0, 0, this.props.trackingData.bannerClickTrackRatio );
		}
		this.setState( { isFundsModalVisible: !currentlyVisible } );
		if ( currentlyVisible ) {
			const link = document.querySelector( '.smallprint .application-of-funds-link' );
			if ( link ) {
				link.scrollIntoView( false );
			}
		}
	};

	fundsModalDonate = e => {
		e.preventDefault();
		this.setState( { isFundsModalVisible: false } );
		const startOfForm = document.querySelector( '.fullpage-banner .call-to-action' );
		if ( startOfForm ) {
			startOfForm.scrollIntoView( true );
		}
	}

	getMiniBannerHeight() {
		return this.miniBannerTransitionRef.current ? this.miniBannerTransitionRef.current.base.offsetHeight : 0;
	}

	getFullBannerHeight() {
		return this.fullBannerTransitionRef.current ? this.fullBannerTransitionRef.current.base.offsetHeight : 0;
	}

	closeBanner = e => {
		e.preventDefault();
		this.setState( {
			displayState: CLOSED,
			isFullPageVisible: false
		} );
		this.props.onClose(
			this.bannerSlider.getViewedSlides(),
			this.bannerSlider.getCurrentSlide()
		);
	};

	registerBannerTransition = cb => { this.slideInBanner = cb; };
	registerFullpageBannerTransition = cb => { this.transitionToFullpage = cb; };
	registerStartHighlight = cb => { this.startHighlight = cb; };
	registerAdjustFollowupBannerHeight = cb => { this.adjustFollowupBannerHeight = cb; };
	registerFullPageBannerReRender = cb => { this.fullPageBannerReRender = cb; };
	registerStartProgressBarInMiniBanner = cb => { this.startProgressBarInMiniBanner = cb; };
	registerStartProgressBarInFullPageBanner = cb => { this.startProgressBarInFullPageBanner = cb; };
	onMiniBannerSlideInFinished = () => {
		if ( this.props.sliderAutoPlay !== false ) {
			this.bannerSlider.enableAutoplayAfter( SLIDESHOW_START_DELAY );
		}
		this.adjustFollowupBannerHeight( this.miniBannerTransitionRef.current.getHeight() );
		this.props.onFinishedTransitioning();
		this.startProgressBarInMiniBanner();
	};

	// eslint-disable-next-line no-unused-vars
	render( props, state, context ) {
		const campaignProjection = props.campaignProjection;
		return <div className={classNames( {
			'wmde-banner': true,
			'wmde-banner--hidden': state.displayState === CLOSED,
			'wmde-banner--visible': state.displayState === VISIBLE,
			'wmde-banner--mini-banner': !state.isFullPageVisible,
			'wmde-banner--full-page': state.isFullPageVisible,
			'wmde-banner--ctrl': props.bannerType === BannerType.CTRL,
			'wmde-banner--var': props.bannerType === BannerType.VAR
		} )}>
			<TranslationContext.Provider value={ props.translations }>
				<BannerTransition
					fixed={ true }
					registerDisplayBanner={ this.registerBannerTransition }
					onFinish={ this.onMiniBannerSlideInFinished }
					skinAdjuster={ props.skinAdjuster }
					ref={this.miniBannerTransitionRef}
					transitionSpeed={ 1000 }
				>
					<MiniBanner
						{ ...props }
						onClose={ this.closeBanner }
						campaignProjection={ campaignProjection }
						setStartAnimation={ this.registerStartProgressBarInMiniBanner }
						onExpandFullpage={ this.showFullPageBanner }/>

				</BannerTransition>
				<FollowupTransition
					registerDisplayBanner={ this.registerFullpageBannerTransition }
					registerFirstBannerFinished={ this.registerAdjustFollowupBannerHeight }
					registerFullPageBannerReRender={ this.registerFullPageBannerReRender }
					onFinish={ () => { this.startProgressBarInFullPageBanner(); } }
					transitionDuration={ 1250 }
					skinAdjuster={ props.skinAdjuster }
					hasStaticParent={ true }
					ref={this.fullBannerTransitionRef}
				>
					<FullpageBanner
						{...props}
						registerStartHighlight={this.registerStartHighlight}
						onClose={ this.closeBanner }
						onSubmit={props.onSubmit}
						donationForm={props.donationForm}
						setStartAnimation={ this.registerStartProgressBarInFullPageBanner }
						toggleFundsModal={ this.toggleFundsModal }
					/>
				</FollowupTransition>
			</TranslationContext.Provider>
			<FundsModal
				isFundsModalVisible={ this.state.isFundsModalVisible }
				toggleFundsModal={ this.toggleFundsModal }
				onCallToAction={ this.fundsModalDonate }
				useOfFundsText={ props.useOfFundsText }
				locale='de'>
				<FundsDistributionAccordion
					applicationOfFundsData={ props.useOfFundsText.applicationOfFundsData }
				/>
			</FundsModal>
		</div>;
	}
}
