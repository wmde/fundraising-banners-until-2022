import { Component, h } from 'preact';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import BannerTransition from '../../shared/components/BannerTransition';
import ProgressBar from '../../shared/components/ui/ProgressBar';
import Slider from '../../shared/components/Slider';
import Slides from './Slides';
import SlideState from '../../shared/slide_state';
import ChevronLeftIcon from './ui/ChevronLeftIcon_var';
import ChevronRightIcon from './ui/ChevronRightIcon_var';
import debounce from '../../shared/debounce';
import TranslationContext from '../../shared/components/TranslationContext';
import FundsDistributionInfo from '../../shared/components/ui/use_of_funds/FundsDistributionInfo';
import FundsModal from '../../shared/components/ui/use_of_funds/FundsModal';
import Footer from '../../shared/components/ui/EasySelectFooter';
import { BannerType } from '../../shared/BannerType';
import createDynamicCampaignText from '../create_dynamic_campaign_text';

const SLIDESHOW_START_DELAY = 2000;
const SLIDESHOW_SLIDE_INTERVAL = 10000;

const BannerVisibilityState = Object.freeze( {
	PENDING: Symbol( 'pending' ),
	VISIBLE: Symbol( 'visible' ),
	CLOSED: Symbol( 'closed' )
} );

export default class Banner extends Component {

	static propTypes = {
		/** callback when banner closes */
		onClose: PropTypes.func,
		/** Callback to register a displayBanner function with the BannerPresenter */
		registerDisplayBanner: PropTypes.func.isRequired,
		/** callback when banner gets submitted */
		onSubmit: PropTypes.func
	}

	constructor( props ) {
		super( props );
		this.state = {
			bannerVisibilityState: BannerVisibilityState.PENDING,
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
			}
		);
		this.props.registerResizeBanner( debounce( this.onPageResize.bind( this ), 200 ) );
	}

	trackBannerEvent( eventName ) {
		this.props.trackingData.tracker.trackBannerEvent(
			eventName,
			this.slideState.slidesShown,
			this.slideState.currentSlide + 1,
			this.props.trackingData.bannerClickTrackRatio
		);
	}

	onPageResize() {
		if ( this.state.bannerVisibilityState !== BannerVisibilityState.VISIBLE ) {
			return;
		}
		this.addBannerSpace();
	}

	addBannerSpace() {
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
		this.props.onFinishedTransitioning();
		this.startProgressbar();
		setTimeout( this.startSliderAutoplay, SLIDESHOW_START_DELAY );
	}

	onSubmit = () => {
		this.trackBannerEvent( 'submit' );
		this.props.onSubmit();
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
			this.trackBannerEvent( 'application-of-funds-shown' );
		}
		this.setState( { isFundsModalVisible: !this.state.isFundsModalVisible } );
	};

	fundsModalDonate = () => {
		this.trackBannerEvent( 'funds-modal-donate-clicked' );
		this.setState( { isFundsModalVisible: false } );
	};

	onFormInteraction = () => {
		this.stopSliderAutoplay();
		this.setState( { showLanguageWarning: false, formInteractionSwitcher: !this.state.formInteractionSwitcher } );
	}

	onSlideChange = ( index ) => {
		this.slideState.onSlideChange( index );
	}

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
					'wmde-banner--ctrl': props.bannerType === BannerType.CTRL,
					'wmde-banner--var': props.bannerType === BannerType.VAR
				}
			) }>
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
							<a className="close__link" onClick={this.closeBanner}>&#x2715;</a>
						</div>
						<div className="banner__content">
							<div className="banner__slideshow">
								<Slider
									slides={ Slides( this.dynamicCampaignText ) }
									onSlideChange={ this.onSlideChange }
									registerAutoplay={ this.registerAutoplayCallbacks }
									interval={ SLIDESHOW_SLIDE_INTERVAL }
									previous={ <ChevronLeftIcon/> }
									next={ <ChevronRightIcon/> }
								/>
							</div>
							<div className="banner__form">
								<DonationForm
									formItems={props.formItems}
									bannerName={props.bannerName}
									campaignName={props.campaignName}
									formatters={props.formatters}
									impressionCounts={props.impressionCounts}
									onFormInteraction={this.onFormInteraction}
									customAmountPlaceholder={ props.translations[ 'custom-amount-placeholder' ] }
									onSubmit={ this.onSubmit }
									showFundsModal={ this.toggleFundsModal }
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
							setStartAnimation={this.registerStartProgressbar}/>
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
					applicationOfFundsData={ props.useOfFundsText.applicationOfFundsData } />
			</FundsModal>
		</div>;
	}
}
