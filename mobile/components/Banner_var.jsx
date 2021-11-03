import { Component, h, createRef } from 'preact';
import classNames from 'classnames';
import debounce from '../../shared/debounce';

import BannerTransition from '../../shared/components/BannerTransition';
import MiniBanner from './MiniBanner_var';
import MinimisedBanner from './MinimisedBanner';
import FullpageBanner from './FullpageBanner';
import TranslationContext from '../../shared/components/TranslationContext';
import FollowupTransition from '../../shared/components/FollowupTransition';
import PropTypes from 'prop-types';
import FundsModal from '../../shared/components/ui/use_of_funds/FundsModal';
import FundsDistributionAccordion from '../../shared/components/ui/use_of_funds/FundsDistributionAccordion';
import { BannerType } from '../../shared/BannerType';
import SlideState from '../../shared/slide_state';
import createDynamicCampaignText from '../create_dynamic_campaign_text';

const PENDING = 0;
const VISIBLE = 1;
const CLOSED = 2;

const SLIDESHOW_START_DELAY = 2000;

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
			isMinimised: this.props.minimisedPersistence.isMinimised(),
			isFullPageVisible: false,
			isFundsModalVisible: false
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
				if ( this.props.minimisedPersistence.isMinimised() ) {
					this.trackBannerEventWithDimensions( 'restored-to-minimised' );
				}
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

	trackBannerEventWithDimensions( eventName ) {
		this.props.trackingData.tracker.trackViewPortDimensions(
			eventName,
			this.props.getBannerDimensions(),
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
			this.adjustFollowupBannerHeight( this.miniBannerTransitionRef.current.getHeight() );
		}
	}

	minimiseBanner = e => {
		e.preventDefault();
		this.setState( { isMinimised: true }, this.setContentSize );
		this.trackBannerEventWithDimensions( 'minimised' );
		this.props.minimisedPersistence.setMinimised();
	}

	maximiseBannerToForm = e => {
		e.preventDefault();
		this.trackBannerEventWithDimensions( 'maximised' );
		this.showFullPageBanner();
	}

	showFullPageBannerFromMiniBanner = e => {
		this.trackBannerEvent( 'mobile-mini-banner-expanded' );
		this.showFullPageBanner( e );
	}

	// eslint-disable-next-line no-unused-vars
	showFullPageBanner = e => {
		this.stopSliderAutoplay();
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

	onSlideChange = ( index ) => {
		this.slideState.onSlideChange( index );
	}

	registerSliderAutoplayCallbacks = ( onStartAutoplay, onStopAutoplay ) => {
		this.startSliderAutoplay = onStartAutoplay;
		this.stopSliderAutoplay = onStopAutoplay;
	};

	closeBanner = e => {
		e.preventDefault();
		this.setState( {
			displayState: CLOSED,
			isFullPageVisible: false
		} );
		this.props.onClose();
		this.props.minimisedPersistence.removeMinimised();
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
					{ state.isMinimised && ( <MinimisedBanner
						maximiseBannerToForm={ this.maximiseBannerToForm }
						closeBanner={ this.closeBanner }
					/> ) }
					{ !state.isMinimised && ( <MiniBanner
						{ ...props }
						onClose={ this.closeBanner }
						onMinimise={ this.minimiseBanner }
						campaignProjection={ campaignProjection }
						setStartAnimation={ this.registerStartProgressBarInMiniBanner }
						onExpandFullpage={ this.showFullPageBannerFromMiniBanner }
						onSlideChange={ this.onSlideChange }
						registerSliderAutoplayCallbacks={ this.registerSliderAutoplayCallbacks }
						dynamicCampaignText={ this.dynamicCampaignText }
					/> ) }
				</BannerTransition>
				<FollowupTransition
					registerDisplayBanner={ this.registerFullpageBannerTransition }
					registerFirstBannerFinished={ this.registerAdjustFollowupBannerHeight }
					registerFullPageBannerReRender={ this.registerFullPageBannerReRender }
					onFinish={ () => { this.startProgressBarInFullPageBanner(); } }
					transitionDuration={ 1250 }
					skinAdjuster={ props.skinAdjuster }
					hasStaticParent={ false }
					ref={this.fullBannerTransitionRef}
				>
					<FullpageBanner
						{...props}
						onClose={ this.closeBanner }
						campaignProjection={ campaignProjection }
						onSubmit={props.onSubmit}
						donationForm={props.donationForm}
						setStartAnimation={ this.registerStartProgressBarInFullPageBanner }
						toggleFundsModal={ this.toggleFundsModal }
						dynamicCampaignText={ this.dynamicCampaignText }
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
