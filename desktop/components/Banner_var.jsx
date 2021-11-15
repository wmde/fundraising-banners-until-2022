import { Component, createRef, h } from 'preact';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import BannerTransition from '../../shared/components/BannerTransition';
import ProgressBar from './ui/ProgressBar';
import CloseIcon from './ui/CloseIcon';
import ClockIcon from './ui/ClockIcon';
import FundsDistributionInfo from '../../shared/components/ui/use_of_funds/FundsDistributionInfo';
import FundsModal from '../../shared/components/ui/use_of_funds/FundsModal';
import TranslationContext from '../../shared/components/TranslationContext';
import debounce from '../../shared/debounce';
import SlideState from '../../shared/slide_state';
import { BannerType } from '../BannerType';
import ContentSlideshow from './ui/ContentSlideshow';
import ContentForm from './ui/ContentForm';
import ChevronLeftIcon from './ui/ChevronLeftIcon';
import createDynamicCampaignText from '../create_dynamic_campaign_text';

const SLIDESHOW_START_DELAY = 2000;
const SLIDESHOW_SLIDE_INTERVAL = 10000;

const BannerVisibilityState = Object.freeze( {
	PENDING: Symbol( 'pending' ),
	VISIBLE: Symbol( 'visible' ),
	CLOSED: Symbol( 'closed' )
} );

const BannerContentState = Object.freeze( {
	SLIDES: Symbol( 'slides' ),
	FORM: Symbol( 'form' )
} );

export class Banner extends Component {

	static propTypes = {
		/** callback when banner closes */
		onClose: PropTypes.func,
		/** callback when banner gets submitted */
		onSubmit: PropTypes.func,
		/** */
		registerDisplayBanner: PropTypes.func.isRequired
	}

	bannerRef = createRef();
	contentSlideshowRef = createRef();
	contentFormRef = createRef();

	constructor( props ) {
		super( props );
		this.state = {
			bannerVisibilityState: BannerVisibilityState.PENDING,
			bannerContentState: BannerContentState.SLIDES,
			isFundsModalVisible: false,
			contentSize: 'auto',

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
				if ( this.props.minimisedPersistence.isMinimised() ) {
					this.trackBannerEventWithDimensions( 'restored-from-maybe-later' );
				}
			}
		);
		this.props.registerResizeBanner( debounce( this.onPageResize.bind( this ), 200 ) );
		this.setContentSize();
	}

	trackBannerEvent( eventName ) {
		this.props.trackingData.tracker.trackBannerEvent(
			eventName,
			this.slideState.slidesShown,
			this.slideState.currentSlide + 1,
			this.props.trackingData.bannerClickTrackRatio
		);
	}

	trackBannerEventWithViewport( eventName ) {
		this.props.trackingData.tracker.trackViewportData(
			eventName,
			this.props.getBannerDimensions(),
			1
		);
	}

	trackBannerEventWithDimensions( eventName ) {
		this.props.trackingData.tracker.trackViewPortDimensions(
			eventName,
			this.props.getBannerDimensions(),
			1
		);
	}

	onPageResize() {
		if ( this.state.bannerVisibilityState !== BannerVisibilityState.VISIBLE ) {
			return;
		}

		this.setContentSize();
		this.addBannerSpace();
	}

	addBannerSpace() {
		const bannerElement = document.querySelector( '.wmde-banner .banner-position' );
		this.props.skinAdjuster.addSpaceInstantly( bannerElement.offsetHeight );
	}

	setContentSize() {
		let height;
		switch ( this.state.bannerContentState ) {
			case BannerContentState.FORM:
				height = this.contentFormRef.current.clientHeight;
				break;
			default:
				height = this.contentSlideshowRef.current.clientHeight;
				break;
		}
		this.setState( { contentSize: `${height}px` } );
	}

	// eslint-disable-next-line no-unused-vars
	componentDidUpdate( previousProps, previousState, snapshot ) {
		if ( previousState.formInteractionSwitcher !== this.state.formInteractionSwitcher ) {
			this.onPageResize();
		}
	}

	onFinishedTransitioning = () => {
		this.props.onFinishedTransitioning();
		this.startProgressbar();
		setTimeout( this.startSliderAutoplay, SLIDESHOW_START_DELAY );
		this.onPageResize();
	}

	closeBanner = e => {
		e.preventDefault();
		this.setState( { bannerVisibilityState: BannerVisibilityState.CLOSED } );
		this.props.minimisedPersistence.removeMinimised();
		this.props.onClose();
	};

	closeBannerWithReminder = e => {
		e.preventDefault();
		this.trackBannerEventWithViewport( 'minimised-' + this.props.bannerName );
		this.props.minimisedPersistence.setMinimised();
		this.setState( { bannerVisibilityState: BannerVisibilityState.CLOSED } );
		this.stopSliderAutoplay();
		this.props.onMaybeLater();
	}

	submitBanner = () => {
		const restoredPostfix = this.props.minimisedPersistence.isMinimised() ? '-from-maybe-later' : '';
		this.trackBannerEventWithDimensions( 'submit' + restoredPostfix );
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
			this.trackBannerEvent( 'application-of-funds-shown' );
		}
		this.setState( { isFundsModalVisible: !this.state.isFundsModalVisible } );
	};

	fundsModalDonate = () => {
		this.trackBannerEvent( 'funds-modal-donate-clicked' );
		this.setState( { isFundsModalVisible: false, bannerContentState: BannerContentState.FORM }, this.setContentSize );
	};

	onFormInteraction = () => {
		this.setState( { showLanguageWarning: true, formInteractionSwitcher: !this.state.formInteractionSwitcher } );
	}

	showDonationForm = e => {
		e.preventDefault();
		this.trackBannerEvent( 'desktop-banner-expanded' );
		this.setState( { bannerContentState: BannerContentState.FORM }, this.setContentSize );
		this.stopSliderAutoplay();
	}

	showSlides = e => {
		e.preventDefault();
		this.setState( { bannerContentState: BannerContentState.SLIDES }, this.setContentSize );
	}

	onSlideChange = ( index ) => {
		this.slideState.onSlideChange( index );
	}

	// eslint-disable-next-line no-unused-vars
	render( props, state, context ) {
		const campaignProjection = props.campaignProjection;
		const Footer = props.footer;

		return <div
			className={ classNames( {
				'wmde-banner': true,
				'wmde-banner--hidden': state.bannerVisibilityState === BannerVisibilityState.CLOSED,
				'wmde-banner--visible': state.bannerVisibilityState === BannerVisibilityState.VISIBLE,
				'wmde-banner--content-slides': state.bannerContentState === BannerContentState.SLIDES,
				'wmde-banner--content-form': state.bannerContentState === BannerContentState.FORM,
				'wmde-banner--ctrl': props.bannerType === BannerType.CTRL,
				'wmde-banner--var': props.bannerType === BannerType.VAR
			} ) }
			ref={this.bannerRef}>
			<BannerTransition
				fixed={ true }
				registerDisplayBanner={ this.registerBannerTransition }
				onFinish={ this.onFinishedTransitioning }
				skinAdjuster={ props.skinAdjuster }
				transitionSpeed={ 1000 }
			>
				<TranslationContext.Provider value={props.translations}>
					<div className="banner__wrapper">
						<div className="banner__inner">
							<div className="banner__navigation">
								<div className="banner__back">
									<a className="back__link" onClick={ this.showSlides }>
										<ChevronLeftIcon/> { props.translations[ 'back-button' ] }
									</a>
								</div>
								<div className="banner__close">
									<a className="minimise-link" onClick={ this.closeBannerWithReminder }>
										<ClockIcon/> <span className="minimise-link-text">{ props.translations[ 'minimise-button' ] }</span>
									</a>
									<a className="close-link" onClick={ this.closeBanner }>
										<CloseIcon/>
									</a>
								</div>
							</div>
							<div className="banner__logo">
								<img src="https://upload.wikimedia.org/wikipedia/commons/1/10/Wikipedia-logo-compressed.png" alt="Wikipedia Logo"/>
							</div>
							<div className="banner__inner-content-size-fitter" style={ `height:${ state.contentSize }` } onTransitionEnd={ () => {
								this.onPageResize();
							} }>
								<ContentSlideshow
									ref={ this.contentSlideshowRef }
									campaignParameters={ props.campaignParameters }
									campaignProjection={ props.campaignProjection }
									formatters={ props.formatters }
									slideshowSlideInterval={ SLIDESHOW_SLIDE_INTERVAL }
									toggleFundsModal={ this.toggleFundsModal }
									showDonationForm={ this.showDonationForm }
									registerAutoplayCallbacks={ this.registerAutoplayCallbacks }
									onSlideChange={ this.onSlideChange }
									dynamicCampaignText={ this.dynamicCampaignText }
								/>
								<ContentForm
									ref={ this.contentFormRef }
									formatters={ props.formatters }
									campaignParameters={ props.campaignParameters }
									campaignProjection={ props.campaignProjection }
									bannerText={ props.bannerText }
									propsForText={ {
										dynamicCampaignText: this.dynamicCampaignText,
										toggleFundsModal: this.toggleFundsModal
									} }
									donationForm={ props.donationForm }
									formItems={ props.formItems }
									bannerName={ props.bannerName }
									campaignName={ props.campaignName }
									impressionCounts={ props.impressionCounts }
									onFormInteraction={ this.onFormInteraction }
									onSubmit={ this.submitBanner }
									buttonText={ props.buttonText }
									errorPosition={ props.errorPosition }
								/>
							</div>
							<Footer/>
						</div>
						<ProgressBar
							formatters={props.formatters}
							daysLeft={campaignProjection.getRemainingDays()}
							donationAmount={campaignProjection.getProjectedDonationSum()}
							goalDonationSum={campaignProjection.goalDonationSum}
							missingAmount={campaignProjection.getProjectedRemainingDonationSum()}
							setStartAnimation={this.registerStartProgressbar}
						/>
					</div>
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
