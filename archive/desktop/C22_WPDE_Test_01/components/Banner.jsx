import { Component, h, createRef } from 'preact';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import TranslationContext from '../../../shared/TranslationContext';
import { BannerType } from '../../../shared/BannerType';
import createDynamicCampaignText from '../../../shared/create_dynamic_campaign_text';

import FundsModal from '../../../components/UseOfFunds/FundsModal';
import FundsDistributionInfo from '../../../components/UseOfFunds/FundsDistributionInfo';
import Message from '../../../components/Message/Message';
import Slider from '../../../components/Slider/Slider';
import SlideState from '../../../components/Slider/slide_state';
import ProgressBar, { AmountToShowOnRight } from '../../../components/ProgressBar/ProgressBar';
import Footer from '../../../components/Footer/Footer';
import ChevronLeftIcon from '../../../components/Icons/ChevronLeftIcon';
import ChevronRightIcon from '../../../components/Icons/ChevronRightIcon';
import ButtonClose from '../../../components/ButtonClose/ButtonClose';

const BannerVisibilityState = Object.freeze( {
	PENDING: Symbol( 'pending' ),
	VISIBLE: Symbol( 'visible' ),
	CLOSED: Symbol( 'closed' )
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
	};

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
			textHighlight: HighlightState.WAITING
		};
		this.slideInBanner = () => {};
		this.startSliderAutoplay = () => {};
		this.stopSliderAutoplay = () => {};
		this.startProgressbar = () => {};
		this.slideState = new SlideState();

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
		this.props.registerDisplayBanner( () => {} );
		this.setState( { bannerVisibilityState: BannerVisibilityState.VISIBLE } );
		this.slideInBanner();
		this.storeBannerWidth();
		this.onFinishedTransitioning();
		this.startProgressbar();
		setTimeout( () => this.startSliderAutoplay(), SLIDESHOW_START_DELAY );
		this.props.registerResizeBanner( this.adjustSurroundingSpace.bind( this ) );
		this.adjustSurroundingSpace();
	}

	adjustSurroundingSpace() {
		this.storeBannerWidth( () => {
			const bannerElement = document.querySelector( '.wmde-banner' );
			this.props.skinAdjuster.addSpaceInstantly( bannerElement.offsetHeight );
		} );
	}

	// eslint-disable-next-line no-unused-vars
	componentDidUpdate( previousProps, previousState, snapshot ) {
		if ( previousState.formInteractionSwitcher !== this.state.formInteractionSwitcher ) {
			this.adjustSurroundingSpace();
		}
	}

	onFinishedTransitioning = () => {
		this.startProgressbar();
		this.props.onFinishedTransitioning();
		setTimeout( this.startSliderAutoplay, SLIDESHOW_START_DELAY );
		setTimeout( this.triggerTextHighlight );
	};

	closeBanner = e => {
		e.preventDefault();
		this.setState( { bannerVisibilityState: BannerVisibilityState.CLOSED } );
		this.props.onClose();
	};

	registerBannerTransition = ( cb ) => {
		this.slideInBanner = cb;
	};

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
	};

	onSlideChange = ( index ) => {
		this.slideState.onSlideChange( index );
	};

	triggerTextHighlight() {
		if ( this.state.textHighlight === HighlightState.ANIMATE ) {
			return;
		}
		this.setState( { textHighlight: HighlightState.ANIMATE } );
	}

	storeBannerWidth = ( callback = () => {} ) => {
		this.setState( { bannerWidth: this.ref.current.offsetWidth }, callback );
	};

	trackBannerEvent( eventName ) {
		this.props.trackingData.tracker.trackBannerEvent(
			eventName,
			this.slideState.slidesShown,
			this.slideState.currentSlide + 1,
			this.props.trackingData.bannerClickTrackRatio
		);
	}

	// eslint-disable-next-line no-unused-vars
	render( props, state, context ) {
		const DonationForm = props.donationForm;
		const BannerText = props.bannerText;
		const campaignProjection = props.campaignProjection;

		return <div
			className={ classNames( 'wmde-banner', 'banner-position', {
				'wmde-banner--hidden': state.bannerVisibilityState === BannerVisibilityState.CLOSED,
				'wmde-banner--visible': state.bannerVisibilityState === BannerVisibilityState.VISIBLE,
				'wmde-banner--animate-highlight': state.textHighlight === HighlightState.ANIMATE,
				'wmde-banner--ctrl': props.bannerType === BannerType.CTRL,
				'wmde-banner--var': props.bannerType === BannerType.VAR
			} ) }
			ref={this.ref}
		>
			<TranslationContext.Provider value={props.translations}>
				<div className="wmde-banner-wrapper">
					<ButtonClose onClick={ this.closeBanner }/>
					{ state.bannerVisibilityState === BannerVisibilityState.CLOSED &&
						<img src="https://bruce.wikipedia.de/close-banner?c=fundraising" alt="" height="0" width="0"/>
					}
					<div className="wmde-banner-content">
						<div className="wmde-banner-column-left">
							{ state.bannerWidth < SHOW_SLIDE_BREAKPOINT && (
								<Slider
									slides={ props.slides( this.dynamicCampaignText ) }
									onSlideChange={ this.onSlideChange }
									registerAutoplay={ this.registerAutoplayCallbacks }
									interval={ SLIDESHOW_SLIDE_INTERVAL }
									previous={ <ChevronLeftIcon/> }
									next={ <ChevronRightIcon/> }
									dynamicCampaignText={ this.dynamicCampaignText }
									sliderOptions={ { loop: false } }
								/>
							) }

							{ state.bannerWidth >= SHOW_SLIDE_BREAKPOINT && (
								<Message>
									<BannerText dynamicCampaignText={ this.dynamicCampaignText }/>
								</Message>
							) }
							<ProgressBar
								formatters={ props.formatters }
								daysLeft={ campaignProjection.getRemainingDays() }
								donationAmount={ campaignProjection.getProjectedDonationSum() }
								goalDonationSum={ campaignProjection.goalDonationSum }
								missingAmount={ campaignProjection.getProjectedRemainingDonationSum() }
								setStartAnimation={ this.registerStartProgressbar }
								amountToShowOnRight={ AmountToShowOnRight.TOTAL }
								isLateProgress={ props.campaignParameters.isLateProgress }/>
						</div>
						<div className="wmde-banner-column-right">
							<DonationForm
								formItems={props.formItems}
								bannerName={props.bannerName}
								campaignName={props.campaignName}
								formatters={props.formatters}
								impressionCounts={props.impressionCounts}
								onFormInteraction={this.onFormInteraction}
								onSubmit={ props.onSubmit }
								customAmountPlaceholder={ props.translations[ 'custom-amount-placeholder' ] }
								buttonText={ props.buttonText }
								errorPosition={ props.errorPosition }
								bannerType={ props.bannerType }
								showCookieBanner={ props.showCookieBanner }
							/>
						</div>
					</div>
					<Footer showFundsModal={ this.toggleFundsModal }/>
				</div>

			</TranslationContext.Provider>
			<FundsModal
				toggleFundsModal={ this.toggleFundsModal }
				onCallToAction={ this.fundsModalDonate }
				isFundsModalVisible={ this.state.isFundsModalVisible }
				useOfFundsText={ props.useOfFundsText }
				figuresAreProvisional={ props.campaignParameters.useOfFundsProvisional }
				locale='de'>
				<FundsDistributionInfo
					applicationOfFundsData={ props.useOfFundsText.applicationOfFundsData }
				/>
			</FundsModal>
		</div>;
	}
}
