import { Component, h, createRef } from 'preact';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import TranslationContext from '../../../shared/components/TranslationContext';
import { LocalImpressionCount } from '../../../shared/local_impression_count';
import { CampaignProjection } from '../../../shared/campaign_projection';
import FundsDistributionInfo from '../../../shared/components/ui/use_of_funds/FundsDistributionInfo';
import { BannerType } from '../../../shared/BannerType';
import createDynamicCampaignText from '../../../shared/create_dynamic_campaign_text';
import debounce from '../../../shared/debounce';
import SlideState from '../../../shared/slide_state';

import BannerTransition from '../../../components/BannerTransition/BannerTransition';
import FundsModal from '../../../components/UseOfFunds/FundsModal';
import Slider from '../../../components/Slider/Slider';
import ProgressBar, { AmountToShowOnRight } from '../../../components/ProgressBar/ProgressBar';
import ChevronLeftIcon from '../../../components/Icons/ChevronLeftIcon';
import ChevronRightIcon from '../../../components/Icons/ChevronRightIcon';
import ButtonClose from '../../../components/ButtonClose/ButtonClose';
import CssTransition from '../../../shared/css_transition';
import AlreadyDonatedModal from '../../../components/AlreadyDonatedModal/AlreadyDonatedModal';

const BannerVisibilityState = Object.freeze( {
	PENDING: Symbol( 'pending' ),
	FULL_VISIBLE: Symbol( 'full-visible' ),
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
	softCloseTransitionRef = createRef();
	softCloseRef = createRef();

	constructor( props ) {
		super( props );
		this.state = {
			bannerVisibilityState: BannerVisibilityState.PENDING,
			isFundsModalVisible: false,

			// trigger for banner resize events
			formInteractionSwitcher: false,
			isAlreadyDonatedModalVisible: false
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
				this.setState( { bannerVisibilityState: BannerVisibilityState.FULL_VISIBLE } );
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

	setContentSize() {
		switch ( this.state.bannerVisibilityState ) {
			case BannerVisibilityState.FULL_VISIBLE:
				this.props.skinAdjuster.addSpaceInstantly( this.getFullBannerHeight() );
				this.fullPageBannerReRender();
				break;
			case BannerVisibilityState.SOFT_CLOSING:
				this.props.skinAdjuster.addSpaceInstantly( this.getSoftCloseBannerHeight() );
				break;
		}
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

	getSoftCloseBannerHeight() {
		return this.softCloseTransitionRef.current ? this.softCloseTransitionRef.current.offsetHeight : 0;
	}

	onSoftCloseBanner = e => {
		e.preventDefault();
		this.softCloseRef.current?.startProgress();
		this.setState(
			{ bannerVisibilityState: BannerVisibilityState.SOFT_CLOSING },
			() => this.setContentSize()
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
		this.props.onClose( 'micro-banner-ignored', new CssTransition( 1000 ) );
	};

	onSlideChange = ( index ) => {
		this.slideState.onSlideChange( index );
	};

	onPage2 = () => {
		this.trackBannerEvent( 'second-form-page-shown' );
	};

	onChangeToYearly = () => {
		this.trackBannerEvent( 'changed-to-yearly' );
	};

	showAlreadyDonated = ( e ) => {
		e.preventDefault();
		this.trackBannerEvent( 'clicked-already-donated' );
		this.setState( { isAlreadyDonatedModalVisible: true } );
	};

	hideAlreadyDonated = ( e ) => {
		e.preventDefault();
		this.setState( { isAlreadyDonatedModalVisible: false } );
	};

	onAlreadyDonatedMaybeLater = e => {
		e.preventDefault();
		this.setState( { bannerVisibilityState: BannerVisibilityState.CLOSED } );
		this.props.onMaybeLater( 'banner-closed-already-donated-maybelater' );
	};

	onAlreadyDonatedGoAway = e => {
		e.preventDefault();
		this.setState( { bannerVisibilityState: BannerVisibilityState.CLOSED } );
		this.props.onCloseBecauseDonated( 'banner-closed-already-donated' );
	};

	// eslint-disable-next-line no-unused-vars
	render( props, state, context ) {
		const SoftClose = props.softClose;
		const Footer = props.footer;
		const campaignProjection = props.campaignProjection;
		const DonationForm = props.donationForm;
		return <div
			className={ classNames(
				'wmde-banner',
				{
					'wmde-banner--hidden': state.bannerVisibilityState === BannerVisibilityState.CLOSED,
					'wmde-banner--visible': state.bannerVisibilityState !== BannerVisibilityState.CLOSED && state.bannerVisibilityState !== BannerVisibilityState.PENDING,
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
					<div className="wmde-banner-wrapper">
						<ButtonClose onClick={ this.onSoftCloseBanner }/>
						<AlreadyDonatedModal
							content={ props.alreadyDonatedContent }
							isVisible={ state.isAlreadyDonatedModalVisible }
							onHide={ this.hideAlreadyDonated }
							onMaybeLater={ this.onAlreadyDonatedMaybeLater }
							onGoAway={ this.onAlreadyDonatedGoAway }
						/>
						<div className="wmde-banner-content">
							<div className="wmde-banner-column-left">
								<div className="wmde-banner-content-headline">
									<span className="wmde-banner-content-headline-text" dangerouslySetInnerHTML={
										{ __html: props.translations[ 'content-headline' ] }
									}></span>
								</div>
								<Slider
									slides={ props.slides( this.dynamicCampaignText ) }
									onSlideChange={ this.onSlideChange }
									registerAutoplay={ this.registerAutoplayCallbacks }
									interval={ SLIDESHOW_SLIDE_INTERVAL }
									previous={ <ChevronLeftIcon fill={ '#990a00' }/> }
									next={ <ChevronRightIcon fill={ '#990a00' }/> }
									sliderOptions={ { loop: false } }
								/>
								<ProgressBar
									formatters={ props.formatters }
									daysLeft={ campaignProjection.getRemainingDays() }
									donationAmount={ campaignProjection.getProjectedDonationSum() }
									goalDonationSum={ campaignProjection.goalDonationSum }
									missingAmount={ campaignProjection.getProjectedRemainingDonationSum() }
									setStartAnimation={ this.registerStartProgressbar }
									isLateProgress={ props.campaignParameters.isLateProgress }
									amountToShowOnRight={ AmountToShowOnRight.TOTAL }/>
							</div>
							<div className="wmde-banner-column-right">
								<DonationForm
									onPage2={ this.onPage2 }
									onSubmit={ props.onSubmit }
									onSubmitRecurring={ () => props.onSubmit( 'submit-recurring' ) }
									onSubmitNonRecurring={ () => props.onSubmit( 'submit-non-recurring' ) }
									onChangeToYearly={ this.onChangeToYearly }
									onFormInteraction={ this.onFormInteraction }
									formItems={props.formItems}
									formStep2={ props.donationFormStep2 }
									bannerName={props.bannerName}
									campaignName={props.campaignName}
									formatters={props.formatters}
									impressionCounts={props.impressionCounts}
									customAmountPlaceholder={ props.translations[ 'custom-amount-placeholder' ] }
								/>
							</div>
						</div>
						<Footer
							showFundsModal={ this.toggleFundsModal }
							showAlreadyDonated={ this.showAlreadyDonated }
						/>
					</div>
					<div
						ref={ this.softCloseTransitionRef }
						className="soft-close-container banner-position--state-finished banner-position banner-position--fixed"
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
