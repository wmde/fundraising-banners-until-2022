import { Component, h, createRef } from 'preact';
import classNames from 'classnames';
import debounce from '../../../shared/debounce';

import BannerTransition from '../../../components/BannerTransition/BannerTransition';
import FollowupTransition from '../../../components/BannerTransition/FollowupTransition';
import MiniBanner from './MiniBanner_var';
import FullBanner from './FullBanner';
import TranslationContext from '../../../shared/components/TranslationContext';
import PropTypes from 'prop-types';
import FundsModal from '../../../components/UseOfFunds/FundsModal';
import FundsDistributionAccordion from '../../../components/UseOfFunds/FundsDistributionAccordion';
import { BannerType } from '../../../shared/BannerType';
import SlideState from '../../../shared/slide_state';
import createDynamicCampaignText from '../../../shared/create_dynamic_campaign_text';
import CssTransition from '../../../shared/css_transition';

const BannerVisibilityState = Object.freeze( {
	PENDING: Symbol( 'pending' ),
	MINI_VISIBLE: Symbol( 'mini-visible' ),
	FULL_VISIBLE: Symbol( 'full-visible' ),
	SOFT_CLOSING: Symbol( 'soft-closing' ),
	CLOSED: Symbol( 'closed' )
} );

const SLIDESHOW_START_DELAY = 2000;

const HighlightState = Object.freeze( {
	WAITING: Symbol( 'waiting' ),
	ANIMATE: Symbol( 'animate' )
} );

export default class Banner extends Component {

	static propTypes = {
		/** callback when banner closes */
		onClose: PropTypes.func,
		/** callback when banner gets submitted */
		onSubmit: PropTypes.func
	};

	constructor( props ) {
		super( props );
		this.state = {
			bannerVisibilityState: BannerVisibilityState.PENDING,
			isFullPageVisible: false,
			isFundsModalVisible: false,
			textHighlight: HighlightState.WAITING
		};
		this.transitionToFullpage = () => {};
		this.startHighlight = () => {};
		this.adjustFollowupBannerHeight = () => {};
		this.fullPageBannerReRender = () => {};
		this.startProgressBarInMiniBanner = () => {};
		this.startProgressBarInFullPageBanner = () => {};
		this.startSliderAutoplay = () => {};
		this.stopSliderAutoplay = () => {};
		this.slideState = new SlideState();
		this.dynamicCampaignText = createDynamicCampaignText(
			props.campaignParameters,
			props.campaignProjection,
			props.impressionCounts,
			props.formatters,
			props.translations
		);
	}

	miniBannerTransitionRef = createRef();
	fullBannerTransitionRef = createRef();
	softCloseTransitionRef = createRef();
	softCloseRef = createRef();

	componentDidMount() {
		this.props.registerDisplayBanner(
			() => {
				this.setState( { bannerVisibilityState: BannerVisibilityState.MINI_VISIBLE } );
				this.slideInBanner();
			}
		);

		this.props.registerResizeBanner( debounce( this.setContentSize.bind( this ), 200 ) );
	}

	trackBannerEvent( eventName ) {
		this.props.trackingData.tracker.trackBannerEvent(
			eventName,
			this.slideState.slidesShown,
			this.slideState.currentSlide + 1,
			this.props.trackingData.bannerClickTrackRatio
		);
	}

	setContentSize() {
		switch ( this.state.bannerVisibilityState ) {
			case BannerVisibilityState.MINI_VISIBLE:
				this.props.skinAdjuster.addSpaceInstantly( this.getMiniBannerHeight() );
				this.adjustFollowupBannerHeight( this.getMiniBannerHeight() );
				break;
			case BannerVisibilityState.FULL_VISIBLE:
				this.props.skinAdjuster.addSpaceInstantly( this.getFullBannerHeight() );
				this.fullPageBannerReRender();
				break;
			case BannerVisibilityState.SOFT_CLOSING:
				this.props.skinAdjuster.addSpaceInstantly( this.getSoftCloseBannerHeight() );
				break;
		}
	}

	showFullPageBannerFromMiniBanner = e => {
		this.trackBannerEvent( 'mobile-mini-banner-expanded' );
		this.showFullPageBanner( e );
	};

	showFullPageBanner = () => {
		this.stopSliderAutoplay();
		window.scrollTo( 0, 0 );
		this.transitionToFullpage( this.getMiniBannerHeight() );
		this.setState( { bannerVisibilityState: BannerVisibilityState.FULL_VISIBLE } );
	};

	toggleFundsModal = e => {
		e.preventDefault();
		const currentlyVisible = this.state.isFundsModalVisible;
		if ( !currentlyVisible ) {
			this.trackBannerEvent( 'application-of-funds-shown' );
		}
		this.setState( { isFundsModalVisible: !currentlyVisible } );
		if ( currentlyVisible ) {
			const link = document.querySelector( '.application-of-funds-link' );
			if ( link ) {
				link.scrollIntoView( false );
			}
		}
	};

	fundsModalDonate = e => {
		e.preventDefault();
		this.trackBannerEvent( 'funds-modal-donate-clicked' );
		this.setState( { isFundsModalVisible: false } );
		const startOfForm = document.querySelector( '.wmde-banner-full-call-to-action' );
		if ( startOfForm ) {
			startOfForm.scrollIntoView( true );
		}
	};

	getMiniBannerHeight() {
		return this.miniBannerTransitionRef.current ? this.miniBannerTransitionRef.current.base.offsetHeight : 0;
	}

	getFullBannerHeight() {
		return this.fullBannerTransitionRef.current ? this.fullBannerTransitionRef.current.base.offsetHeight : 0;
	}

	getSoftCloseBannerHeight() {
		return this.softCloseTransitionRef.current ? this.softCloseTransitionRef.current.offsetHeight : 0;
	}

	onSlideChange = ( index ) => {
		this.slideState.onSlideChange( index );
	};

	registerSliderAutoplayCallbacks = ( onStartAutoplay, onStopAutoplay ) => {
		this.startSliderAutoplay = onStartAutoplay;
		this.stopSliderAutoplay = onStopAutoplay;
	};

	onSoftCloseMiniBanner = e => {
		e.preventDefault();
		this.softCloseRef.current?.startProgress();
		this.setState(
			{ bannerVisibilityState: BannerVisibilityState.SOFT_CLOSING },
			() => this.setContentSize()
		);
	};

	onCloseFullBanner = e => {
		e.preventDefault();
		this.setState( { bannerVisibilityState: BannerVisibilityState.CLOSED } );
		this.props.onMaybeLater( 'banner-closed-full' );
	};

	onMaybeLater = e => {
		e.preventDefault();
		this.setState( { bannerVisibilityState: BannerVisibilityState.CLOSED } );
		this.props.onMaybeLater();
	};

	onCloseBanner = e => {
		e.preventDefault();
		this.setState( { bannerVisibilityState: BannerVisibilityState.CLOSED } );
		this.props.onClose();
	};

	onTimeOutClose = () => {
		this.setState( { bannerVisibilityState: BannerVisibilityState.CLOSED } );
		this.props.onClose( 'micro-banner-ignored', new CssTransition( 1000 ) );
	};

	registerBannerTransition = cb => { this.slideInBanner = cb; };
	registerFullpageBannerTransition = cb => { this.transitionToFullpage = cb; };
	registerAdjustFollowupBannerHeight = cb => { this.adjustFollowupBannerHeight = cb; };
	registerFullPageBannerReRender = cb => { this.fullPageBannerReRender = cb; };
	registerStartProgressBarInMiniBanner = cb => { this.startProgressBarInMiniBanner = cb; };
	registerStartProgressBarInFullPageBanner = cb => { this.startProgressBarInFullPageBanner = cb; };

	onMiniBannerSlideInFinished = () => {
		setTimeout( this.startSliderAutoplay, SLIDESHOW_START_DELAY );
		this.adjustFollowupBannerHeight( this.miniBannerTransitionRef.current.getHeight() );
		this.props.onFinishedTransitioning();
		this.startProgressBarInMiniBanner();
	};

	onFullBannerSlideInFinished = () => {
		this.startProgressBarInFullPageBanner();
		this.triggerTextHighlight();
	};

	triggerTextHighlight() {
		if ( this.state.textHighlight === HighlightState.ANIMATE ) {
			return;
		}
		this.setState( { textHighlight: HighlightState.ANIMATE } );
	}

	// eslint-disable-next-line no-unused-vars
	render( props, state, context ) {
		const SoftClose = props.softClose;
		const campaignProjection = props.campaignProjection;
		return <div className={classNames( {
			'wmde-banner': true,
			'wmde-banner--hidden': state.bannerVisibilityState === BannerVisibilityState.CLOSED,
			'wmde-banner--visible': state.bannerVisibilityState !== BannerVisibilityState.CLOSED && state.bannerVisibilityState !== BannerVisibilityState.PENDING,
			'wmde-banner--soft-closing': state.bannerVisibilityState === BannerVisibilityState.SOFT_CLOSING,
			'wmde-banner--mini-banner': state.bannerVisibilityState === BannerVisibilityState.MINI_VISIBLE,
			'wmde-banner--full-page': state.bannerVisibilityState === BannerVisibilityState.FULL_VISIBLE,
			'wmde-banner--animate-highlight': state.textHighlight === HighlightState.ANIMATE,
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
						onClose={ this.onSoftCloseMiniBanner }
						campaignProjection={ campaignProjection }
						setStartAnimation={ this.registerStartProgressBarInMiniBanner }
						onExpandFullpage={ this.showFullPageBannerFromMiniBanner }
						onSlideChange={ this.onSlideChange }
						registerSliderAutoplayCallbacks={ this.registerSliderAutoplayCallbacks }
						dynamicCampaignText={ this.dynamicCampaignText }
					/>
				</BannerTransition>
				<FollowupTransition
					registerDisplayBanner={ this.registerFullpageBannerTransition }
					registerFirstBannerFinished={ this.registerAdjustFollowupBannerHeight }
					registerFullPageBannerReRender={ this.registerFullPageBannerReRender }
					onFinish={ this.onFullBannerSlideInFinished }
					transitionDuration={ 1250 }
					skinAdjuster={ props.skinAdjuster }
					hasStaticParent={ false }
					ref={this.fullBannerTransitionRef}
				>
					<FullBanner
						{...props}
						onClose={ this.onCloseFullBanner }
						campaignProjection={ campaignProjection }
						onSubmit={ props.onSubmit }
						donationForm={props.donationForm}
						setStartAnimation={ this.registerStartProgressBarInFullPageBanner }
						toggleFundsModal={ this.toggleFundsModal }
						dynamicCampaignText={ this.dynamicCampaignText }
					/>
				</FollowupTransition>
				<div
					ref={ this.softCloseTransitionRef }
					className="soft-close-container"
					style="top: 0px"
				>
					<SoftClose
						onMaybeLater={ this.onMaybeLater }
						onCloseBanner={ this.onCloseBanner }
						onTimeOutClose={ this.onTimeOutClose }
						ref={ this.softCloseRef }
					/>
				</div>
			</TranslationContext.Provider>
			<FundsModal
				isFundsModalVisible={ this.state.isFundsModalVisible }
				toggleFundsModal={ this.toggleFundsModal }
				onCallToAction={ this.fundsModalDonate }
				useOfFundsText={ props.useOfFundsText }
				figuresAreProvisional={ props.campaignParameters.useOfFundsProvisional }
				locale='de'>
				<FundsDistributionAccordion
					applicationOfFundsData={ props.useOfFundsText.applicationOfFundsData }
				/>
			</FundsModal>
		</div>;
	}
}
