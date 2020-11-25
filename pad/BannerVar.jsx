// eslint-disable-next-line no-unused-vars
import { Component, h, createRef } from 'preact';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import BannerTransition from '../shared/components/BannerTransition';
import ProgressBar from '../shared/components/ui/ProgressBar';
import Footer from '../shared/components/ui/EasySelectFooter';
import Infobox from '../shared/components/ui/Infobox';
import TranslationContext from '../shared/components/TranslationContext';
import { LocalImpressionCount } from '../shared/local_impression_count';
import { CampaignProjection } from '../shared/campaign_projection';
import FundsDistributionInfo from '../shared/components/ui/use_of_funds/FundsDistributionInfo';
import FundsModal from '../shared/components/ui/use_of_funds/FundsModal';
import { Slider } from '../shared/banner_slider';
import { BannerType } from './BannerType';

const PENDING = 0;
const VISIBLE = 1;
const CLOSED = 2;

const SLIDESHOW_START_DELAY = 2000;

export default class Banner extends Component {

	static propTypes = {
		bannerName: PropTypes.string,
		campaignName: PropTypes.string,

		campaignParameters: PropTypes.object,
		campaignProjection: PropTypes.instanceOf( CampaignProjection ),
		formatters: PropTypes.object,
		bannerText: PropTypes.elementType,
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
	}

	ref = createRef();

	constructor( props ) {
		super( props );
		this.state = {
			displayState: PENDING,
			isFundsModalVisible: false,

			// trigger for banner resize events
			formInteractionSwitcher: false
		};
		this.slideInBanner = () => {};
	}

	componentDidMount() {
		this.bannerSlider = new Slider( this.props.sliderAutoPlaySpeed, { adaptiveHeight: false, setGallerySize: false } );
		this.bannerSlider.initialize();
		this.bannerSlider.disableAutoplay();

		this.props.registerDisplayBanner(
			() => {
				this.setState( { displayState: VISIBLE } );
				this.slideInBanner();
			}
		);
		this.props.registerResizeBanner( this.onPageResize.bind( this ) );
	}

	onPageResize() {
		const bannerElement = document.querySelector( '.wmde-banner .banner-position' );
		this.props.skinAdjuster.addSpaceInstantly( bannerElement.offsetHeight );
		this.bannerSlider.resize();
	}

	// eslint-disable-next-line no-unused-vars
	componentDidUpdate( previousProps, previousState, snapshot ) {
		if ( previousState.formInteractionSwitcher !== this.state.formInteractionSwitcher ) {
			this.adjustSurroundingSpace();
		}
	}

	onFinishedTransitioning = () => {
		this.startProgressbar();
		this.bannerSlider.enableAutoplayAfter( SLIDESHOW_START_DELAY );
		this.props.onFinishedTransitioning();
	}

	closeBanner = e => {
		e.preventDefault();
		this.setState( { displayState: CLOSED } );
		this.props.onClose(
			this.bannerSlider.getViewedSlides(),
			this.bannerSlider.getCurrentSlide(),
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

	// eslint-disable-next-line no-unused-vars
	render( props, state, context ) {
		const campaignProjection = props.campaignProjection;
		const DonationForm = props.donationForm;
		return <div
			className={ classNames(
				'wmde-banner',
				{
					'wmde-banner--hidden': state.displayState === CLOSED,
					'wmde-banner--visible': state.displayState === VISIBLE,
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
					<div className="banner__wrapper">
						<div className="banner__content">
							<div className="banner__infobox">
								<Infobox
									formatters={props.formatters}
									campaignParameters={props.campaignParameters}
									campaignProjection={props.campaignProjection}
									bannerText={props.bannerText}
									propsForText={ {
										bannerSliderNext: this.bannerSliderNext,
										bannerSliderPrevious: this.bannerSliderPrevious
									} }
								/>
								<ProgressBar
									formatters={props.formatters}
									daysLeft={campaignProjection.getRemainingDays()}
									donationAmount={campaignProjection.getProjectedDonationSum()}
									goalDonationSum={campaignProjection.goalDonationSum}
									missingAmount={campaignProjection.getProjectedRemainingDonationSum()}
									setStartAnimation={this.registerStartProgressbar}/>
							</div>
							<DonationForm
								formItems={props.formItems}
								bannerName={props.bannerName}
								campaignName={props.campaignName}
								formatters={props.formatters}
								impressionCounts={props.impressionCounts}
								onFormInteraction={this.onFormInteraction}
								customAmountPlaceholder={ props.translations[ 'custom-amount-placeholder' ] }
								onSubmit={props.onSubmit}
							/>
						</div>
						<div className="close">
							<a className="close__link" onClick={this.closeBanner}>&#x2715;</a>
						</div>
						<Footer showFundsModal={ this.toggleFundsModal }/>
					</div>
				</TranslationContext.Provider>
			</BannerTransition>
			<FundsModal
				toggleFundsModal={ this.toggleFundsModal }
				isFundsModalVisible={ this.state.isFundsModalVisible }
				useOfFundsText={ props.useOfFundsText }
				locale='de'>
				<FundsDistributionInfo
					applicationOfFundsData={ props.useOfFundsText.applicationOfFundsData } />
			</FundsModal>
		</div>;
	}

}
