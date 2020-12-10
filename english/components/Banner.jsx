// eslint-disable-next-line no-unused-vars
import { Component, h, createRef } from 'preact';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import BannerTransition from '../../shared/components/BannerTransition';
import ProgressBar from '../../shared/components/ui/ProgressBar';
import Footer from '../../shared/components/ui/EasySelectFooter';
import Infobox from '../../shared/components/ui/Infobox';
import FundsModal from '../../shared/components/ui/use_of_funds/FundsModal';
import FundsDistributionInfo from '../../shared/components/ui/use_of_funds/FundsDistributionInfo';
import TranslationContext from '../../shared/components/TranslationContext';
import { CampaignProjection } from '../../shared/campaign_projection';
import { LocalImpressionCount } from '../../shared/local_impression_count';
import LanguageWarningBox from '../../shared/components/ui/LanguageWarningBox';

const PENDING = 0;
const VISIBLE = 1;
const CLOSED = 2;

export const BannerType = Object.freeze( {
	CTRL: Symbol( 'ctrl ' ),
	VAR: Symbol( 'var' )
} );

export default class Banner extends Component {

	static propTypes = {
		bannerName: PropTypes.string,
		campaignName: PropTypes.string,

		campaignParameters: PropTypes.object,
		campaignProjection: PropTypes.instanceOf( CampaignProjection ),
		formatters: PropTypes.object,
		bannerText: PropTypes.elementType,
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
		/** callback when banner gets submitted */
		onSubmit: PropTypes.func,
		/** Callback to register a displayBanner function with the BannerPresenter */
		registerDisplayBanner: PropTypes.func.isRequired
	}

	ref = createRef();

	constructor( props ) {
		super( props );
		this.state = {
			displayState: PENDING,
			showLanguageWarning: false,
			isFundsModalVisible: false,

			// trigger for banner resize events
			formInteractionSwitcher: false
		};
		this.slideInBanner = () => {};
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

	adjustSurroundingSpace() {
		const bannerElement = document.querySelector( '.wmde-banner .banner-position' );
		const languageWarningElement = document.querySelector( '.wmde-banner .lang-warning' );
		languageWarningElement.style.top = bannerElement.offsetHeight;
		this.props.skinAdjuster.addSpaceInstantly( bannerElement.offsetHeight + languageWarningElement.offsetHeight );
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
	}

	closeBanner = e => {
		e.preventDefault();
		this.setState( { displayState: CLOSED } );
		this.props.onClose();
	};

	registerBannerTransition = ( cb ) => {
		this.slideInBanner = cb;
	}

	registerStartProgressbar = ( startPb ) => {
		this.startProgressbar = startPb;
	};

	toggleFundsModal = () => {
		if ( !this.state.isFundsModalVisible ) {
			this.props.trackingData.tracker.trackBannerEvent( 'application-of-funds-shown', 0, 0, this.props.trackingData.bannerClickTrackRatio );
		}
		this.setState( { isFundsModalVisible: !this.state.isFundsModalVisible } );
	};

	onFormInteraction = () => {
		this.setState( { showLanguageWarning: true, formInteractionSwitcher: !this.state.formInteractionSwitcher } );
	}

	// eslint-disable-next-line no-unused-vars
	render( props, state, context ) {
		const DonationForm = props.donationForm;
		const campaignProjection = props.campaignProjection;
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
						<div className="close">
							<a className="close__link" onClick={this.closeBanner}>&#x2715;</a>
						</div>
						<div className="banner__content">
							<div className="banner__infobox">
								<div className="infobox-bubble">
									<Infobox
										formatters={props.formatters}
										campaignParameters={props.campaignParameters}
										campaignProjection={props.campaignProjection}
										bannerText={props.bannerText}
										propsForText={ { overallImpressionCount: props.impressionCounts.getOverallCount() } }
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
						<Footer showFundsModal={ this.toggleFundsModal }/>
						<LanguageWarningBox
							show={state.showLanguageWarning}
						/>
					</div>
				</TranslationContext.Provider>
			</BannerTransition>
			<FundsModal
				toggleFundsModal={ this.toggleFundsModal }
				isFundsModalVisible={ this.state.isFundsModalVisible }
				useOfFundsText={ props.useOfFundsText }
				locale='en'>
				<FundsDistributionInfo
					applicationOfFundsData={ props.useOfFundsText.applicationOfFundsData } />
			</FundsModal>
		</div>;
	}

}
