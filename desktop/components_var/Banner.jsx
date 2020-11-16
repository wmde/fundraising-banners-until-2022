// eslint-disable-next-line no-unused-vars
import { Component, h, createRef } from 'preact';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import BannerTransition from '../../shared/components/BannerTransition';
import ProgressBar from './ui/ProgressBar';
import Slides from './Slides';
import Infobox from '../components/ui/Infobox';
import CloseIcon from './ui/CloseIcon';
import FundsDistributionInfo from '../../shared/components/ui/use_of_funds/FundsDistributionInfo';
import FundsModal from '../../shared/components/ui/use_of_funds/FundsModal';
import TranslationContext from '../../shared/components/TranslationContext';
import { Slider } from '../../shared/banner_slider';
import debounce from '../../shared/debounce';
import ChevronDownIcon from './ui/ChevronDownIcon';
import ChevronLeftIcon from './ui/ChevronLeftIcon';
import ChevronRightIcon from './ui/ChevronRightIcon';
import BannerReopen from './BannerReopen';

const SLIDESHOW_START_DELAY = 2000;

const BannerVisibilityState = Object.freeze( {
	PENDING: Symbol( 'pending' ),
	VISIBLE: Symbol( 'visible' ),
	MINIMISED: Symbol( 'minimised' ),
	CLOSED: Symbol( 'closed' )
} );

const BannerContentState = Object.freeze( {
	SLIDES: Symbol( 'slides' ),
	FORM: Symbol( 'form' )
} );

export const BannerType = Object.freeze( {
	CTRL: Symbol( 'ctrl' ),
	VAR: Symbol( 'var' )
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
	}

	componentDidMount() {
		this.props.registerDisplayBanner(
			() => {
				this.setState( { bannerVisibilityState: BannerVisibilityState.VISIBLE } );
				this.slideInBanner();
			}
		);
		this.props.registerResizeBanner( debounce( this.onPageResize.bind( this ), 200 ) );
		this.bannerSlider = new Slider( this.props.sliderAutoPlaySpeed );
		this.bannerSlider.initialize();
		this.bannerSlider.disableAutoplay();
		this.setContentSize();
	}

	onPageResize() {
		if ( this.state.bannerVisibilityState !== BannerVisibilityState.VISIBLE ) {
			return;
		}

		this.setContentSize();
		this.addBannerSpace();

		if ( this.state.bannerContentState === BannerContentState.SLIDES ) {
			this.bannerSlider.resize();
		}
	}

	addBannerSpace() {
		const bannerElement = document.querySelector( '.wmde-banner .banner-position' );
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
			this.adjustSurroundingSpace();
		}
	}

	onFinishedTransitioning = () => {
		this.props.onFinishedTransitioning();
		this.startProgressbar();
		this.bannerSlider.enableAutoplayAfter( SLIDESHOW_START_DELAY );
	}

	minimiseBanner = e => {
		e.preventDefault();
		this.setState( { bannerVisibilityState: BannerVisibilityState.MINIMISED } );
		this.props.skinAdjuster.removeSpace();
		this.props.trackingData.tracker.trackBannerEvent(
			'banner-minimised',
			this.bannerSlider.getViewedSlides(),
			this.bannerSlider.getCurrentSlide(),
			this.props.trackingData.bannerClickTrackRatio
		);
	}

	maximiseBanner = e => {
		e.preventDefault();
		this.setState( { bannerVisibilityState: BannerVisibilityState.VISIBLE }, this.addBannerSpace );
	}

	closeBanner = e => {
		e.preventDefault();
		this.setState( { bannerVisibilityState: BannerVisibilityState.CLOSED } );
		this.props.onClose(
			this.bannerSlider.getViewedSlides(),
			this.bannerSlider.getCurrentSlide()
		);
	};

	registerBannerTransition = ( cb ) => {
		this.slideInBanner = cb;
	}

	registerStartProgressbar = ( startPb ) => {
		this.startProgressbar = startPb;
	};

	toggleFundsModal = () => {
		if ( !this.state.isFundsModalVisible ) {
			this.props.trackingData.tracker.trackBannerEvent(
				'application-of-funds-shown',
				this.bannerSlider.getViewedSlides(),
				this.bannerSlider.getCurrentSlide(),
				this.props.trackingData.bannerClickTrackRatio
			);
		}
		this.setState( { isFundsModalVisible: !this.state.isFundsModalVisible } );
	};

	fundsModalDonate = () => {
		this.props.trackingData.tracker.trackBannerEvent(
			'funds-modal-donate-clicked',
			this.bannerSlider.getViewedSlides(),
			this.bannerSlider.getCurrentSlide(),
			this.props.trackingData.bannerClickTrackRatio
		);
		this.setState( { isFundsModalVisible: false } );
	};

	onFormInteraction = () => {
		this.setState( { showLanguageWarning: true, formInteractionSwitcher: !this.state.formInteractionSwitcher } );
	}

	bannerSliderNext = e => {
		e.preventDefault();
		this.bannerSlider.next();
	}

	bannerSliderPrevious = e => {
		e.preventDefault();
		this.bannerSlider.previous();
	}

	showDonationForm = e => {
		e.preventDefault();
		this.setState( { bannerContentState: BannerContentState.FORM }, this.setContentSize );
	}

	showSlides = e => {
		e.preventDefault();
		this.setState( { bannerContentState: BannerContentState.SLIDES }, this.setContentSize );
	}

	// eslint-disable-next-line no-unused-vars
	render( props, state, context ) {
		const DonationForm = props.donationForm;
		const campaignProjection = props.campaignProjection;

		return <div
			className={ classNames( {
				'wmde-banner': true,
				'wmde-banner--hidden': state.bannerVisibilityState === BannerVisibilityState.CLOSED,
				'wmde-banner--minimised': state.bannerVisibilityState === BannerVisibilityState.MINIMISED,
				'wmde-banner--visible': state.bannerVisibilityState === BannerVisibilityState.VISIBLE,
				'wmde-banner--slides': state.bannerContentState === BannerContentState.SLIDES,
				'wmde-banner--form': state.bannerContentState === BannerContentState.FORM,
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
						<BannerReopen
							maximiseBanner={ this.maximiseBanner }
							closeBanner={ this.closeBanner }
						/>
						<div className="banner__inner">
							<div className="banner__close">
								<a className="close__link" onClick={ this.minimiseBanner }>
									{ props.translations[ 'close-button' ] } <CloseIcon/>
								</a>
							</div>
							<div className="banner__logo">
								<img
									src="https://upload.wikimedia.org/wikipedia/commons/1/10/Wikipedia-logo-compressed.png"
									alt="Wikipedia Logo"/>
							</div>
							<div className="banner__inner-content-size-fitter" style={ `height:${ state.contentSize }` } onTransitionEnd={ () => {
								this.onPageResize();
							} }>
								<div className="banner__slideshow" ref={ this.slideshowRef }>
									<button className="slideshow-previous" onClick={ this.bannerSliderPrevious }><ChevronLeftIcon/></button>
									<Infobox
										campaignParameters={ props.campaignParameters }
										campaignProjection={ campaignProjection }
										formatters={ props.formatters }
										bannerText={ Slides }
										propsForText={{
											formattedGoalDonationSumNumeric: props.formatters.millionFormatterNumeric( campaignProjection.goalDonationSum )
										}}
									/>
									<button className="slideshow-next" onClick={ this.bannerSliderNext }><ChevronRightIcon/></button>
									<a className="slideshow-application-of-funds-link" onClick={ this.toggleFundsModal }>
										{ props.translations[ 'use-of-funds-link' ] }
									</a>
									<button className="banner-button__next" onClick={ this.showDonationForm }>{ props.translations[ 'next-button' ] } <ChevronDownIcon/></button>
								</div>
								<div className="banner__content" ref={ this.contentRef }>
									<div className="banner__infobox">
										<Infobox
											formatters={props.formatters}
											campaignParameters={props.campaignParameters}
											campaignProjection={props.campaignProjection}
											bannerText={props.bannerText}
											propsForText={ {
												overallImpressionCount: props.impressionCounts.getOverallCount(),
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
											onSubmit={props.onSubmit}
											customAmountPlaceholder={ props.translations[ 'custom-amount-placeholder' ] }
											buttonText={ props.buttonText }
											errorPosition={ props.errorPosition }
											bannerType={ props.bannerType }
										/>
									</div>
								</div>
							</div>
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
				fundsModalData={props.fundsModalData}
				toggleFundsModal={ this.toggleFundsModal }
				isFundsModalVisible={ this.state.isFundsModalVisible }
				onCallToAction={ this.fundsModalDonate }
				locale='de'>
				<FundsDistributionInfo/>
			</FundsModal>
		</div>;
	}

}
