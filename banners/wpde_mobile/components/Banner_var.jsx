import { Component, h, createRef } from 'preact';
import classNames from 'classnames';
import debounce from '../../../shared/debounce';

import BannerTransition from '../../../components/BannerTransition/BannerTransition';
import FollowupTransition from '../../../components/BannerTransition/FollowupTransition';
import MiniBanner from './MiniBanner';
import FullBanner from './FullBanner_var';
import TranslationContext from '../../../shared/components/TranslationContext';
import PropTypes from 'prop-types';
import FundsModal from '../../../components/UseOfFunds/FundsModal';
import FundsDistributionAccordion from '../../../components/UseOfFunds/FundsDistributionAccordion';
import { BannerType } from '../../../shared/BannerType';
import SlideState from '../../../shared/slide_state';
import createDynamicCampaignText from '../../../shared/create_dynamic_campaign_text';

const PENDING = 0;
const VISIBLE = 1;
const CLOSED = 2;

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
			displayState: PENDING,
			setCookie: false,
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

	componentDidMount() {
		this.props.registerDisplayBanner(
			() => {
				this.setState( { displayState: VISIBLE } );
				this.slideInBanner();
			}
		);

		this.props.skinAdjuster.addSpaceInstantly( this.miniBannerTransitionRef.current.getHeight() );
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
		if ( this.state.displayState !== VISIBLE ) {
			return;
		}

		if ( this.state.isFullPageVisible ) {
			this.props.skinAdjuster.addSpaceInstantly( this.getFullBannerHeight() );
			this.fullPageBannerReRender();
		} else {
			this.props.skinAdjuster.addSpaceInstantly( this.getMiniBannerHeight() );
			this.adjustFollowupBannerHeight( this.getMiniBannerHeight() );
		}
	}

	showFullPageBannerFromMiniBanner = e => {
		this.trackBannerEvent( 'mobile-mini-banner-expanded' );
		this.showFullPageBanner( e );
	};

	// eslint-disable-next-line no-unused-vars
	showFullPageBanner = e => {
		this.stopSliderAutoplay();
		this.trackBannerEvent( 'mobile-mini-banner-expanded' );
		window.scrollTo( 0, 0 );
		this.transitionToFullpage( this.getMiniBannerHeight() );
		this.setState( { isFullPageVisible: true } );
	};

	toggleFundsModal = e => {
		e.preventDefault();
		const currentlyVisible = this.state.isFundsModalVisible;
		if ( !currentlyVisible ) {
			this.trackBannerEvent( 'application-of-funds-shown' );
		}
		this.setState( { isFundsModalVisible: !currentlyVisible } );
		if ( currentlyVisible ) {
			const link = document.querySelector( '.wmde-banner-full-small-print .application-of-funds-link' );
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

	onSlideChange = ( index ) => {
		this.slideState.onSlideChange( index );
	};

	registerSliderAutoplayCallbacks = ( onStartAutoplay, onStopAutoplay ) => {
		this.startSliderAutoplay = onStartAutoplay;
		this.stopSliderAutoplay = onStopAutoplay;
	};

	closeBanner = e => {
		e.preventDefault();
		this.setState( {
			displayState: CLOSED,
			setCookie: true,
			isFullPageVisible: false
		} );
		this.props.onClose(
			this.slideState.slidesShown,
			this.slideState.currentSlide + 1
		);
	};

	registerBannerTransition = cb => { this.slideInBanner = cb; };
	registerFullpageBannerTransition = cb => { this.transitionToFullpage = cb; };
	registerAdjustFollowupBannerHeight = cb => { this.adjustFollowupBannerHeight = cb; };
	registerFullPageBannerReRender = cb => { this.fullPageBannerReRender = cb; };
	registerStartProgressBarInMiniBanner = cb => { this.startProgressBarInMiniBanner = cb; };
	registerStartProgressBarInFullPageBanner = cb => { this.startProgressBarInFullPageBanner = cb; };

	onMiniBannerSlideInFinished = () => {
		setTimeout( () => this.startSliderAutoplay(), SLIDESHOW_START_DELAY );
		this.adjustFollowupBannerHeight( this.miniBannerTransitionRef.current.getHeight() );
		this.props.onFinishedTransitioning();
		this.startProgressBarInMiniBanner();
	};

	onDonationFormPage2 = () => {
		this.trackBannerEvent( 'second-form-page-shown' );
	};

	onDonationFormChangeToYearly = () => {
		this.trackBannerEvent( 'changed-to-yearly' );
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
		const campaignProjection = props.campaignProjection;
		return <div className={classNames( {
			'wmde-banner': true,
			'wmde-banner--hidden': state.displayState === CLOSED,
			'wmde-banner--visible': state.displayState === VISIBLE,
			'wmde-banner--mini-banner': !state.isFullPageVisible,
			'wmde-banner--full-page': state.isFullPageVisible,
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
					transitionSpeed={ 1 }
				>
					<MiniBanner
						{ ...props }
						setCookie={ state.setCookie }
						onClose={ this.closeBanner }
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
					hasStaticParent={ true }
					ref={this.fullBannerTransitionRef}
				>
					<FullBanner
						{...props}
						setCookie={ state.setCookie }
						onPage2={ this.onDonationFormPage2 }
						onSubmit={ props.onSubmit }
						onSubmitRecurring={ () => props.onSubmit( 'submit-recurring' ) }
						onSubmitNonRecurring={ () => props.onSubmit( 'submit-non-recurring' ) }
						onChangeToYearly={ this.onDonationFormChangeToYearly }
						onClose={ this.closeBanner }
						campaignProjection={ campaignProjection }
						donationForm={props.donationForm}
						setStartAnimation={ this.registerStartProgressBarInFullPageBanner }
						toggleFundsModal={ this.toggleFundsModal }
						dynamicCampaignText={ this.dynamicCampaignText }
					/>
				</FollowupTransition>
			</TranslationContext.Provider>
			<FundsModal
				toggleFundsModal={ this.toggleFundsModal }
				isFundsModalVisible={ this.state.isFundsModalVisible }
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
