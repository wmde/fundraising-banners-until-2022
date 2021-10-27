import { Component, h, createRef } from 'preact';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import ProgressBar from './ui/ProgressBar';
import Slides from './Slides_var';
import Infobox from '../../../shared/components/ui/Infobox';
import CloseIcon from './ui/CloseIcon';
import FundsDistributionInfo from '../../../shared/components/ui/use_of_funds/FundsDistributionInfo';
import FundsModal from '../../../shared/components/ui/use_of_funds/FundsModal';
import TranslationContext from '../../../shared/components/TranslationContext';
import ChevronDownIcon from './ui/ChevronDownIcon';
import ChevronLeftIcon from './ui/ChevronLeftIcon';
import ChevronRightIcon from './ui/ChevronRightIcon';
import SlideState from '../../../shared/slide_state';
import Slider from '../../../shared/components/Slider';
import { BannerType } from '../../../shared/BannerType';
import createDynamicCampaignText from '../create_dynamic_campaign_text';
import BannerText from './BannerText_var';
import debounce from '../../../shared/debounce';

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

export default class Banner extends Component {

	static propTypes = {
		/** callback when banner closes */
		onClose: PropTypes.func,
		/** callback when banner gets submitted */
		onSubmit: PropTypes.func,
		/** */
		registerDisplayBanner: PropTypes.func.isRequired
	}

	bannerRef = createRef();
	slideshowRef = createRef();
	contentRef = createRef();

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
		this.dynamicCampaignText = createDynamicCampaignText( props.campaignParameters, props.campaignProjection, props.formatters, props.translations );
	}

	componentDidMount() {
		this.props.registerDisplayBanner( () => {} );
		this.props.registerResizeBanner( debounce( this.onPageResize.bind( this ), 200 ) );
		this.setState( { bannerVisibilityState: BannerVisibilityState.VISIBLE } );
		this.setContentSize();
		this.addBannerSpace();
		this.startProgressbar();
		this.props.onFinishedTransitioning();
		setTimeout( this.startSliderAutoplay, SLIDESHOW_START_DELAY );
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

		this.setContentSize();
		this.addBannerSpace();
	}

	addBannerSpace() {
		const bannerElement = document.querySelector( '.wmde-banner.banner-position' );
		this.props.skinAdjuster.addSpaceInstantly( bannerElement.offsetHeight );
	}

	setContentSize() {
		let height = this.slideshowRef.current.clientHeight;
		if ( this.state.bannerContentState === BannerContentState.FORM ) {
			height = this.contentRef.current.clientHeight;
		}
		this.setState( { contentSize: `${height}px` } );
	}

	// eslint-disable-next-line no-unused-vars
	componentDidUpdate( previousProps, previousState, snapshot ) {
		if ( previousState.formInteractionSwitcher !== this.state.formInteractionSwitcher ) {
			this.onPageResize();
		}
	}

	closeBanner = e => {
		e.preventDefault();
		this.setState( { bannerVisibilityState: BannerVisibilityState.CLOSED, setCookie: true } );
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
		const DonationForm = props.donationForm;
		const campaignProjection = props.campaignProjection;
		const Footer = props.footer;

		return <div
			className={ classNames( 'wmde-banner', 'banner-position', {
				'wmde-banner--hidden': state.bannerVisibilityState === BannerVisibilityState.CLOSED,
				'wmde-banner--visible': state.bannerVisibilityState === BannerVisibilityState.VISIBLE,
				'wmde-banner--slides': state.bannerContentState === BannerContentState.SLIDES,
				'wmde-banner--form': state.bannerContentState === BannerContentState.FORM,
				'wmde-banner--ctrl': props.bannerType === BannerType.CTRL,
				'wmde-banner--var': props.bannerType === BannerType.VAR
			} ) }
			ref={this.bannerRef}>
			<TranslationContext.Provider value={props.translations}>
				<div className="banner__wrapper">
					<div className="banner__inner">
						<div className="banner__close">
							<a className="close__link" onClick={this.closeBanner}>
								<CloseIcon/>
							</a>
							{ state.setCookie ? <img src="https://bruce.wikipedia.de/close-banner?c=fundraising" alt="" height="0" width="0"/> : '' }
						</div>
						<div className="banner__logo">
							<img src="https://upload.wikimedia.org/wikipedia/commons/1/10/Wikipedia-logo-compressed.png" alt="Wikipedia Logo"/>
						</div>
						<div className="banner__inner-content-size-fitter" style={ `height:${ state.contentSize }` } onTransitionEnd={ () => {
							this.onPageResize();
						} }>
							<div className="banner__slideshow" ref={ this.slideshowRef }>
								<Slider
									slides={ Slides( this.dynamicCampaignText ) }
									onSlideChange={ this.onSlideChange }
									registerAutoplay={ this.registerAutoplayCallbacks }
									interval={ SLIDESHOW_SLIDE_INTERVAL }
									previous={ <ChevronLeftIcon/> }
									next={ <ChevronRightIcon/> }
								/>
								<a className="slideshow-application-of-funds-link" onClick={ this.toggleFundsModal }>
									{ props.translations[ 'use-of-funds-link' ] }
								</a>
								<button className="banner-button__next" onClick={ this.showDonationForm }>{ props.translations[ 'next-button' ] } <ChevronDownIcon/></button>
							</div>
							<div className="banner__content" ref={ this.contentRef }>
								<div className="banner__back">
									<a className="back__link" onClick={ this.showSlides }>
										<ChevronLeftIcon/> { props.translations[ 'back-button' ] }
									</a>
								</div>
								<div className="banner__infobox">
									<Infobox
										formatters={props.formatters}
										campaignParameters={props.campaignParameters}
										campaignProjection={props.campaignProjection}
										bannerText={ BannerText }
										propsForText={ {
											dynamicCampaignText: this.dynamicCampaignText,
											toggleFundsModal: this.toggleFundsModal
										} }/>
								</div>
								<div className="banner__form">
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
									/>
								</div>
							</div>
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
