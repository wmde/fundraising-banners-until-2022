import { Component, h, createRef } from 'preact';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import BannerTransition from '../../shared/components/BannerTransition';
import Infobox from './ui/Infobox';
import FundsDistributionInfo from '../../shared/components/ui/use_of_funds/FundsDistributionInfo';
import FundsModal from '../../shared/components/ui/use_of_funds/FundsModal';
import TranslationContext from '../../shared/components/TranslationContext';
import { BannerType } from '../BannerType';
import createDynamicCampaignText from '../create_dynamic_campaign_text';
import Slider from '../../shared/components/Slider';
import Slides from './Slides';
import SlideState from '../../shared/slide_state';
import ChevronLeftIcon from './ui/ChevronLeftIcon';
import ChevronRightIcon from './ui/ChevronRightIcon';
import ProgressBar, { AmountToShowOnRight } from './ui/ProgressBar';
import CloseIcon from './ui/CloseIcon';
import MinimisedBanner from './MinimisedBanner';
import { createMinimisedPersistence } from '../../shared/minimised_persistence';

const BannerVisibilityState = Object.freeze( {
	PENDING: Symbol( 'pending' ),
	VISIBLE: Symbol( 'visible' ),
	CLOSED: Symbol( 'closed' )
} );

const BannerContentState = Object.freeze( {
	FULL: Symbol( 'full' ),
	MINIMISED: Symbol( 'minimised' )
} );

const HighlightState = Object.freeze( {
	WAITING: Symbol( 'waiting' ),
	ANIMATE: Symbol( 'animate' )
} );

const SLIDESHOW_START_DELAY = 2000;
const SLIDESHOW_SLIDE_INTERVAL = 10000;

const SHOW_SLIDE_BREAKPOINT = 1300;

export class Banner extends Component {

	static propTypes = {
		/** callback when banner closes */
		onClose: PropTypes.func,
		/** callback when banner gets submitted */
		onSubmit: PropTypes.func,
		/** */
		registerDisplayBanner: PropTypes.func.isRequired
	}

	ref = createRef();
	slideshowRef = createRef();

	constructor( props ) {
		super( props );
		this.state = {
			bannerVisibilityState: BannerVisibilityState.PENDING,
			isFundsModalVisible: false,

			// trigger for banner resize events
			formInteractionSwitcher: false,
			// needed for the width-based "component breakpoint" (slider or infobox)
			bannerWidth: 0,
			textHighlight: HighlightState.WAITING,
			bannerContentState: BannerContentState.FULL
		};
		this.slideInBanner = () => {};
		this.startSliderAutoplay = () => {};
		this.stopSliderAutoplay = () => {};
		this.slideState = new SlideState();
		// Only used to track minimization, not used to restore state on banner load
		this.minimizedPersistence = createMinimisedPersistence( props.bannerName );

		this.dynamicCampaignText = createDynamicCampaignText(
			props.campaignParameters,
			props.campaignProjection,
			props.impressionCounts,
			props.formatters,
			props.translations
		);
		this.triggerTextHighlight = this.triggerTextHighlight.bind( this );
	}

	componentDidMount() {
		this.props.registerDisplayBanner(
			() => {
				this.setState( { bannerVisibilityState: BannerVisibilityState.VISIBLE } );
				this.slideInBanner();
			}
		);
		this.storeBannerWidth();
		this.props.registerResizeBanner( this.adjustSurroundingSpace.bind( this ) );
	}

	adjustSurroundingSpace() {
		const bannerElement = document.querySelector( '.wmde-banner .banner-position' );
		this.props.skinAdjuster.addSpaceInstantly( bannerElement.offsetHeight );
		if ( this.state.bannerContentState === BannerContentState.MINIMISED ) {
			const miniBannerElement = document.querySelector( '.wmde-banner .minimised-banner--button-wrapper' );
			this.props.skinAdjuster.addSpaceToSidebarInstantly( miniBannerElement.offsetHeight );
		}
		this.storeBannerWidth();
	}

	// eslint-disable-next-line no-unused-vars
	componentDidUpdate( previousProps, previousState, snapshot ) {
		if ( previousState.formInteractionSwitcher !== this.state.formInteractionSwitcher ) {
			this.adjustSurroundingSpace();
		}
	}

	onFinishedTransitioning = () => {
		this.props.onFinishedTransitioning();
		this.startProgressbar();
		setTimeout( this.startSliderAutoplay, SLIDESHOW_START_DELAY );
	}

	closeBanner = e => {
		e.preventDefault();
		this.setState( { bannerVisibilityState: BannerVisibilityState.CLOSED } );
		this.props.onClose();
	};

	registerBannerTransition = ( cb ) => {
		this.slideInBanner = cb;
	}

	registerStartProgressbar = ( startPb ) => {
		this.startProgressbar = startPb;
	};

	registerAutoplayCallbacks = ( onStartAutoplay, onStopAutoplay ) => {
		this.startSliderAutoplay = onStartAutoplay;
		this.stopSliderAutoplay = onStopAutoplay;
	};

	toggleFundsModal = () => {
		if ( !this.state.isFundsModalVisible ) {
			this.props.trackingData.tracker.trackBannerEvent( 'application-of-funds-shown', 0, 0, this.props.trackingData.bannerClickTrackRatio );
		}
		this.setState( { isFundsModalVisible: !this.state.isFundsModalVisible } );
	};

	fundsModalDonate = () => {
		this.props.trackingData.tracker.trackBannerEvent( 'funds-modal-donate-clicked', 0, 0, this.props.trackingData.bannerClickTrackRatio );
		this.setState( { isFundsModalVisible: false } );
	};

	onFormInteraction = () => {
		this.stopSliderAutoplay();
		this.setState( { showLanguageWarning: true, formInteractionSwitcher: !this.state.formInteractionSwitcher } );
	}

	onSlideChange = ( index ) => {
		this.slideState.onSlideChange( index );
		this.triggerTextHighlight();
	}

	onSubmit = () => {
		if ( this.minimizedPersistence.isMinimised() ) {
			this.minimizedPersistence.removeMinimised();
			this.trackBannerEventWithViewport( 'submit-after-minimise' + this.props.bannerName );
			return;
		}
		this.props.onSubmit();
	}

	triggerTextHighlight() {
		if ( this.state.textHighlight === HighlightState.ANIMATE ) {
			return;
		}
		if ( this.state.bannerWidth > SHOW_SLIDE_BREAKPOINT ) {
			this.setState( { textHighlight: HighlightState.ANIMATE } );
		}
	}

	storeBannerWidth = () => {
		this.setState( { bannerWidth: this.ref.current.offsetWidth } );
	}

	trackBannerEventWithViewport( eventName ) {
		this.props.trackingData.tracker.trackViewportData(
			eventName,
			this.props.getBannerDimensions(),
			1
		);
	}

	minimiseBanner = e => {
		e.preventDefault();
		this.setState( {
			bannerContentState: BannerContentState.MINIMISED,
			formInteractionSwitcher: !this.state.formInteractionSwitcher
		} );
		this.trackBannerEventWithViewport( 'minimised-' + this.props.bannerName );
		this.stopSliderAutoplay();
		this.minimizedPersistence.setMinimised();
	}

	maximiseBanner = e => {
		e.preventDefault();
		this.setState( {
			bannerContentState: BannerContentState.FULL,
			formInteractionSwitcher: !this.state.formInteractionSwitcher
		} );
		this.trackBannerEventWithViewport( 'maximised-' + this.props.bannerName );
	}

	// eslint-disable-next-line no-unused-vars
	render( props, state, context ) {
		const DonationForm = props.donationForm;
		const campaignProjection = props.campaignProjection;
		const Footer = props.footer;

		return <div
			className={ classNames( {
				'wmde-banner': true,
				'wmde-banner--hidden': state.bannerVisibilityState === BannerVisibilityState.CLOSED,
				'wmde-banner--visible': state.bannerVisibilityState === BannerVisibilityState.VISIBLE,
				'wmde-banner--animate-highlight': state.textHighlight === HighlightState.ANIMATE,
				'wmde-banner--content-full': state.bannerContentState === BannerContentState.FULL,
				'wmde-banner--content-minimised': state.bannerContentState === BannerContentState.MINIMISED,
				'wmde-banner--ctrl': props.bannerType === BannerType.CTRL,
				'wmde-banner--var': props.bannerType === BannerType.VAR
			} ) }
			ref={this.ref}
		>
			<BannerTransition
				fixed={ true }
				registerDisplayBanner={ this.registerBannerTransition }
				onFinish={ this.onFinishedTransitioning }
				skinAdjuster={ props.skinAdjuster }
				transitionSpeed={ 1000 }
			>
				<TranslationContext.Provider value={props.translations}>
					<div className="banner__wrapper">
						<div className="close">
							<a className="close-link" onClick={ this.minimiseBanner }>
								{ props.translations[ 'close-button' ] } <CloseIcon/>
							</a>
						</div>
						<div className="banner__content">
							<div className="banner__infobox">
								<div className="infobox-bubble">
									{ state.bannerWidth <= SHOW_SLIDE_BREAKPOINT && state.bannerContentState !== BannerContentState.MINIMISED && (
										<div className="banner__slideshow" ref={ this.slideshowRef }>
											<Slider
												slides={ Slides( this.dynamicCampaignText ) }
												onSlideChange={ this.onSlideChange }
												registerAutoplay={ this.registerAutoplayCallbacks }
												interval={ SLIDESHOW_SLIDE_INTERVAL }
												previous={ <ChevronLeftIcon/> }
												next={ <ChevronRightIcon/> }
												dynamicCampaignText={ this.dynamicCampaignText }
												sliderOptions={ { loop: false } }
											/>
										</div>
									) }

									{ state.bannerWidth > SHOW_SLIDE_BREAKPOINT && (
										<Infobox
											formatters={ props.formatters }
											campaignParameters={ props.campaignParameters }
											campaignProjection={ props.campaignProjection }
											bannerText={ props.bannerText }
											dynamicCampaignText={ this.dynamicCampaignText }
											propsForText={ {
												overallImpressionCount: props.impressionCounts.getOverallCount(),
												millionImpressionsPerDay: props.campaignParameters.millionImpressionsPerDay
											} } />
									) }
								</div>
							</div>
							<div className="banner__form">
								<DonationForm
									formItems={props.formItems}
									bannerName={props.bannerName}
									campaignName={props.campaignName}
									formatters={props.formatters}
									impressionCounts={props.impressionCounts}
									onFormInteraction={this.onFormInteraction}
									onSubmit={ this.onSubmit }
									customAmountPlaceholder={ props.translations[ 'custom-amount-placeholder' ] }
									buttonText={ props.buttonText }
									errorPosition={ props.errorPosition }
									bannerType={ props.bannerType }
									showCookieBanner={ props.showCookieBanner }
								/>
							</div>
						</div>
						<Footer showFundsModal={ this.toggleFundsModal }/>
						<ProgressBar
							formatters={props.formatters}
							daysLeft={campaignProjection.getRemainingDays()}
							donationAmount={campaignProjection.getProjectedDonationSum()}
							goalDonationSum={campaignProjection.goalDonationSum}
							missingAmount={campaignProjection.getProjectedRemainingDonationSum()}
							setStartAnimation={this.registerStartProgressbar}
							amountToShowOnRight={AmountToShowOnRight.TOTAL}
							onEndProgress={ this.triggerTextHighlight }
						/>
					</div>

					<MinimisedBanner
						maximiseBanner={ this.maximiseBanner }
						closeBanner={ this.closeBanner }

					/>

				</TranslationContext.Provider>
			</BannerTransition>
			<FundsModal
				toggleFundsModal={ this.toggleFundsModal }
				onCallToAction={ this.fundsModalDonate }
				isFundsModalVisible={ this.state.isFundsModalVisible }
				useOfFundsText={ props.useOfFundsText }
				locale='de'>
				<FundsDistributionInfo
					applicationOfFundsData={ props.useOfFundsText.applicationOfFundsData }
				/>
			</FundsModal>
		</div>;
	}
}
