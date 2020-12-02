// eslint-disable-next-line no-unused-vars
import { Component, h, createRef } from 'preact';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import BannerTransition from '../../shared/components/BannerTransition';
import ProgressBar from '../../shared/components/ui/ProgressBar';
import Infobox from '../../shared/components/ui/Infobox';
import FundsDistributionInfo from '../../shared/components/ui/use_of_funds/FundsDistributionInfo';
import FundsModal from '../../shared/components/ui/use_of_funds/FundsModal';
import TranslationContext from '../../shared/components/TranslationContext';
import SlideState from '../../shared/slide_state';

const PENDING = 0;
const VISIBLE = 1;
const CLOSED = 2;

const SLIDESHOW_START_DELAY = 2000;
const SLIDESHOW_SLIDE_INTERVAL = 10000;

export const BannerType = Object.freeze( {
	CTRL: Symbol( 'ctrl ' ),
	VAR: Symbol( 'var' )
} );

export class Banner extends Component {

	static propTypes = {
		/** callback when banner closes */
		onClose: PropTypes.func,
		/** callback when banner gets submitted */
		onSubmit: PropTypes.func,
		/** callback to register this banner's display function with parent code */
		registerDisplayBanner: PropTypes.func.isRequired
	}

	ref = createRef();

	constructor( props ) {
		super( props );
		this.state = {
			displayState: PENDING,
			isFundsModalVisible: false,
			formInteractionSwitcher: false
		};
		this.slideInBanner = () => {};
		this.startProgressbar = () => {};
		this.startSliderAutoplay = () => {};
		this.stopSliderAutoplay = () => {};
		this.slideState = new SlideState();
	}

	componentDidMount() {

		this.props.registerDisplayBanner(
			() => {
				this.setState( { displayState: VISIBLE } );
				this.slideInBanner();
			}
		);
		this.props.registerResizeBanner( this.adjustSurroundingSpace.bind( this ) );
	}

	// eslint-disable-next-line no-unused-vars
	componentDidUpdate( previousProps, previousState, snapshot ) {
		if ( previousState.formInteractionSwitcher !== this.state.formInteractionSwitcher ) {
			this.adjustSurroundingSpace();
		}
	}

	adjustSurroundingSpace() {
		const bannerElement = document.querySelector( '.wmde-banner .banner-position' );
		this.props.skinAdjuster.addSpaceInstantly( bannerElement.offsetHeight );
	}

	onFinishedTransitioning = () => {
		this.props.onFinishedTransitioning();
		this.startProgressbar();
		setTimeout( this.startSliderAutoplay(), SLIDESHOW_START_DELAY );
	}

	onFormInteraction = () => {
		this.setState( { formInteractionSwitcher: !this.state.formInteractionSwitcher } );
		this.stopSliderAutoplay();
	}

	closeBanner = e => {
		e.preventDefault();
		this.setState( { displayState: CLOSED } );
		this.props.onClose(
			this.slideState.slidesShown,
			this.slideState.currentSlide
		);
	};

	registerBannerTransition = ( cb ) => {
		this.slideInBanner = cb;
	}

	registerStartProgressbar = ( startPb ) => {
		this.startProgressbar = startPb;
	};

	registerAutoplayCallbacks = ( startAutoplay, stopAutoplay ) => {
		this.startSliderAutoplay = startAutoplay;
		this.stopSliderAutoplay = stopAutoplay;
	}

	toggleFundsModal = () => {
		if ( !this.state.isFundsModalVisible ) {
			this.props.trackingData.tracker.trackBannerEvent(
				'application-of-funds-shown',
				this.slideState.slidesShown,
				this.slideState.currentSlide,
				this.props.trackingData.bannerClickTrackRatio
			);
		}
		this.setState( { isFundsModalVisible: !this.state.isFundsModalVisible } );
	};

	fundsModalDonate = () => {
		this.props.trackingData.tracker.trackBannerEvent( 'funds-modal-donate-clicked', 0, 0, this.props.trackingData.bannerClickTrackRatio );
		this.setState( { isFundsModalVisible: false } );
	};

	// eslint-disable-next-line no-unused-vars
	render( props, state, context ) {
		const DonationForm = props.donationForm;
		const campaignProjection = props.campaignProjection;
		const Footer = props.footer;

		return <div
			className={ classNames( {
				'wmde-banner': true,
				'wmde-banner--hidden': state.displayState === CLOSED,
				'wmde-banner--visible': state.displayState === VISIBLE,
				'wmde-banner--ctrl': props.bannerType === BannerType.CTRL,
				'wmde-banner--var': props.bannerType === BannerType.VAR
			} ) }
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
								<div className="infobox-bubble">
									<Infobox
										formatters={props.formatters}
										campaignParameters={props.campaignParameters}
										campaignProjection={props.campaignProjection}
										bannerText={props.bannerText}
										propsForText={ {
											slideshowSlideInterval: SLIDESHOW_SLIDE_INTERVAL,
											onSlideChange: this.slideState.onSlideChange.bind( this.slideState ),
											registerAutoplay: this.registerAutoplayCallbacks
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
									onSubmit={props.onSubmit}
								/>
							</div>
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
