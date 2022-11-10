import { Component, h, createRef } from 'preact';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import BannerTransition from '../../../components/BannerTransition/BannerTransition';
import Message from '../../../components/Message/Message';
import FundsDistributionInfo from '../../../components/UseOfFunds/FundsDistributionInfo';
import FundsModal from '../../../components/UseOfFunds/FundsModal';
import TranslationContext from '../../../shared/components/TranslationContext';
import { BannerType } from '../BannerType';
import createDynamicCampaignText from '../../../shared/create_dynamic_campaign_text';
import Slider from '../../../components/Slider/Slider';
import SlideState from '../../../components/Slider/slide_state';
import ChevronLeftIcon from '../../../components/Icons/ChevronLeftIcon';
import ChevronRightIcon from '../../../components/Icons/ChevronRightIcon';
import ButtonClose from '../../../components/ButtonClose/ButtonClose';
import BegYearlyRecurringDonationFormStep2 from '../../../components/DonationForm/BegYearlyRecurringDonationFormStep2';
import ProgressBar, { AmountToShowOnRight } from '../../../components/ProgressBar/ProgressBar';

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
		this.startProgressbar = () => {};
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
		this.storeBannerWidth( () => {
			const bannerElement = document.querySelector( '.wmde-banner .banner-position' );
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
		this.props.onFinishedTransitioning();
		setTimeout( this.startSliderAutoplay, SLIDESHOW_START_DELAY );
		this.triggerTextHighlight();
		this.startProgressbar();
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
		this.triggerTextHighlight();
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

	onPage2 = () => {
		this.trackBannerEvent( 'second-form-page-shown' );
	};

	onChangeToYearly = () => {
		this.trackBannerEvent( 'changed-to-yearly' );
	};

	// eslint-disable-next-line no-unused-vars
	render( props, state, context ) {
		const DonationForm = props.donationForm;
		const Footer = props.footer;
		const BannerText = props.bannerText;

		return <div
			className={ classNames( {
				'wmde-banner': true,
				'wmde-banner--hidden': state.bannerVisibilityState === BannerVisibilityState.CLOSED,
				'wmde-banner--visible': state.bannerVisibilityState === BannerVisibilityState.VISIBLE,
				'wmde-banner--animate-highlight': state.textHighlight === HighlightState.ANIMATE,
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
					<div className="wmde-banner-wrapper">
						<ButtonClose onClick={ this.closeBanner }/>
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
							</div>
							<div className="wmde-banner-column-right">
								<DonationForm
									onPage2={ this.onPage2 }
									onSubmit={ props.onSubmit }
									onSubmitRecurring={ () => props.onSubmit( 'submit-recurring' ) }
									onSubmitNonRecurring={ () => props.onSubmit( 'submit-non-recurring' ) }
									onChangeToYearly={ this.onChangeToYearly }
									formItems={props.formItems}
									formStep2={ BegYearlyRecurringDonationFormStep2 }
									bannerName={props.bannerName}
									campaignName={props.campaignName}
									formatters={props.formatters}
									impressionCounts={props.impressionCounts}
									onFormInteraction={this.onFormInteraction}
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
							formatters={ props.formatters }
							daysLeft={ props.campaignProjection.getRemainingDays() }
							donationAmount={ props.campaignProjection.getProjectedDonationSum() }
							goalDonationSum={ props.campaignProjection.goalDonationSum }
							missingAmount={ props.campaignProjection.getProjectedRemainingDonationSum() }
							setStartAnimation={ this.registerStartProgressbar }
							isLateProgress={ props.campaignParameters.isLateProgress }
							amountToShowOnRight={ AmountToShowOnRight.TOTAL }/>
					</div>

				</TranslationContext.Provider>
			</BannerTransition>
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
