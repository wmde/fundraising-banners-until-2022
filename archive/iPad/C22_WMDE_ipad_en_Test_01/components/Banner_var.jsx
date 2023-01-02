import { Component, h, createRef } from 'preact';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import TranslationContext from '../../../shared/TranslationContext';
import { LocalImpressionCount } from '../../../shared/local_impression_count';
import { CampaignProjection } from '../../../shared/campaign_projection';
import FundsDistributionInfo from '../../../components/UseOfFunds/FundsDistributionInfo';
import { BannerType } from '../../../shared/BannerType';
import createDynamicCampaignText from '../../../shared/create_dynamic_campaign_text';
import debounce from '../../../shared/debounce';
import SlideState from '../../../shared/slide_state';
import Slides from '../content/Slides';

import BannerTransition from '../../../components/BannerTransition/BannerTransition';
import FundsModal from '../../../components/UseOfFunds/FundsModal';
import Slider from '../../../components/Slider/Slider';
import ProgressBar, { AmountToShowOnRight } from '../../../components/ProgressBar/ProgressBar';
import Footer from '../../../components/Footer/Footer';
import ChevronLeftIcon from '../../../components/Icons/ChevronLeftIcon';
import ChevronRightIcon from '../../../components/Icons/ChevronRightIcon';
import ButtonClose from '../../../components/ButtonClose/ButtonClose';
import SoftClose from '../../../components/SoftClose/SoftClose';

const BannerVisibilityState = Object.freeze( {
	PENDING: Symbol( 'pending' ),
	VISIBLE: Symbol( 'visible' ),
	SOFT_CLOSING: Symbol( 'soft-closing' ),
	CLOSED: Symbol( 'closed' )
} );

const SLIDESHOW_START_DELAY = 2000;
const SLIDESHOW_SLIDE_INTERVAL = 10000;

export default class Banner extends Component {

	static propTypes = {
		bannerName: PropTypes.string,
		campaignName: PropTypes.string,

		campaignParameters: PropTypes.object,
		campaignProjection: PropTypes.instanceOf( CampaignProjection ),
		formatters: PropTypes.object,
		donationForm: PropTypes.elementType,
		translations: PropTypes.object,
		/**
		 *  Contains items with values and labels for SelectGroup components
		 *  in the form, e.g. amounts, payment types, intervals, etc
		 */
		formItems: PropTypes.object,

		/** object that holds any data needed for tracking purposes */
		trackingData: PropTypes.object,
		impressionCounts: PropTypes.instanceOf( LocalImpressionCount ),

		/** callback when banner closes */
		onClose: PropTypes.func,
		/** Callback to register a displayBanner function with the BannerPresenter */
		registerDisplayBanner: PropTypes.func.isRequired
	};

	ref = createRef();
	softCloseRef = createRef();

	constructor( props ) {
		super( props );
		this.state = {
			bannerVisibilityState: BannerVisibilityState.PENDING,
			isFundsModalVisible: false,

			// trigger for banner resize events
			formInteractionSwitcher: false
		};
		this.slideInBanner = () => {};
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

	componentDidMount() {
		this.props.registerDisplayBanner(
			() => {
				this.setState( { bannerVisibilityState: BannerVisibilityState.VISIBLE } );
				this.slideInBanner();
			}
		);
		this.props.registerResizeBanner( debounce( this.onPageResize.bind( this ), 200 ) );
	}

	trackBannerEvent( eventName, trackRatio ) {
		this.props.trackingData.tracker.trackBannerEvent(
			eventName,
			this.slideState.slidesShown,
			this.slideState.currentSlide + 1,
			trackRatio ?? this.props.trackingData.bannerClickTrackRatio
		);
	}

	onPageResize() {
		const bannerElement = document.querySelector( '.wmde-banner .banner-position' );
		this.props.skinAdjuster.addSpaceInstantly( bannerElement.offsetHeight );
	}

	// eslint-disable-next-line no-unused-vars
	componentDidUpdate( previousProps, previousState, snapshot ) {
		if ( previousState.formInteractionSwitcher !== this.state.formInteractionSwitcher ) {
			this.onPageResize();
		}
	}

	onFinishedTransitioning = () => {
		this.startProgressbar();
		this.props.onFinishedTransitioning();
		setTimeout( this.startSliderAutoplay, SLIDESHOW_START_DELAY );
		this.onPageResize();
	};

	onSoftCloseBanner = e => {
		e.preventDefault();
		this.softCloseRef.current?.startProgress();
		this.setState(
			{ bannerVisibilityState: BannerVisibilityState.SOFT_CLOSING },
			() => this.onPageResize()
		);
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
		this.props.onClose( 'micro-banner-ignored' );
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
			this.trackBannerEvent( 'application-of-funds-shown' );
		}
		this.setState( { isFundsModalVisible: !this.state.isFundsModalVisible } );
	};

	fundsModalDonate = () => {
		this.trackBannerEvent( 'funds-modal-donate-clicked' );
		this.setState( { isFundsModalVisible: false } );
	};

	onFormInteraction = () => {
		this.setState( { showLanguageWarning: true, formInteractionSwitcher: !this.state.formInteractionSwitcher } );
		this.stopSliderAutoplay();
	};

	onSlideChange = ( index ) => {
		this.slideState.onSlideChange( index );
	};

	// eslint-disable-next-line no-unused-vars
	render( props, state, context ) {
		const campaignProjection = props.campaignProjection;
		const DonationForm = props.donationForm;
		return <div
			className={ classNames(
				'wmde-banner',
				{
					'wmde-banner--hidden': state.bannerVisibilityState === BannerVisibilityState.CLOSED,
					'wmde-banner--visible': state.bannerVisibilityState === BannerVisibilityState.VISIBLE,
					'wmde-banner--soft-closing': state.bannerVisibilityState === BannerVisibilityState.SOFT_CLOSING,
					'wmde-banner--ctrl': props.bannerType === BannerType.CTRL,
					'wmde-banner--var': props.bannerType === BannerType.VAR
				}
			) }
			ref={this.ref}>
			<BannerTransition
				fixed={ true }
				registerDisplayBanner={ this.registerBannerTransition }
				onFinish={ this.onFinishedTransitioning }
				skinAdjuster={ props.skinAdjuster }
				transitionSpeed={ 1000 }
			>
				<TranslationContext.Provider value={props.translations}>
					<SoftClose
						onMaybeLater={ this.onMaybeLater }
						onCloseBanner={ this.onCloseBanner }
						onTimeOutClose={ this.onTimeOutClose }
						ref={this.softCloseRef}
					/>
					<div className="wmde-banner-wrapper">
						<ButtonClose onClick={ this.onSoftCloseBanner }/>
						<div className="wmde-banner-content">
							<div className="wmde-banner-column-left">
								<Slider
									slides={ Slides( this.dynamicCampaignText ) }
									onSlideChange={ this.onSlideChange }
									registerAutoplay={ this.registerAutoplayCallbacks }
									interval={ SLIDESHOW_SLIDE_INTERVAL }
									previous={ <ChevronLeftIcon fill={ '#990a00' }/> }
									next={ <ChevronRightIcon fill={ '#990a00' }/> }
									sliderOptions={ { loop: false } }
								/>
								<ProgressBar
									formatters={props.formatters}
									daysLeft={campaignProjection.getRemainingDays()}
									donationAmount={campaignProjection.getProjectedDonationSum()}
									goalDonationSum={campaignProjection.goalDonationSum}
									missingAmount={campaignProjection.getProjectedRemainingDonationSum()}
									setStartAnimation={this.registerStartProgressbar}
									amountToShowOnRight={ AmountToShowOnRight.TOTAL }/>
							</div>
							<div className="wmde-banner-column-right">
								<DonationForm
									formItems={props.formItems}
									bannerName={props.bannerName}
									campaignName={props.campaignName}
									formatters={props.formatters}
									impressionCounts={props.impressionCounts}
									onFormInteraction={this.onFormInteraction}
									customAmountPlaceholder={ props.translations[ 'custom-amount-placeholder' ] }
									onSubmit={ props.onSubmit }
									formActionProps={ props.formActionProps }
								/>
							</div>
						</div>
						<Footer showFundsModal={ this.toggleFundsModal }/>
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
					applicationOfFundsData={ props.useOfFundsText.applicationOfFundsData } />
			</FundsModal>
		</div>;
	}

}
