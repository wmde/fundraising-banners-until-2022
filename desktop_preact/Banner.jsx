// eslint-disable-next-line no-unused-vars
import { Component, h, createRef } from 'preact';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import BannerTransition from '../shared/components/BannerTransition';
import ProgressBar from './components/ProgressBar';
import AmountToggle from './components/AmountToggle';
import DonationForm from '../shared/components/ui/form/DonationForm';
import Footer from '../shared/components/ui/Footer';
import Infobox from '../shared/components/ui/Infobox';
import FundsModal from './components/FundsModal';
import TranslationContext from '../shared/components/TranslationContext';

const PENDING = 0;
const VISIBLE = 1;
const CLOSED = 2;

export default class Banner extends Component {

	static propTypes = {
		/** callback when banner closes */
		onClose: PropTypes.func,
		/** */
		registerDisplayBanner: PropTypes.func.isRequired
	}

	ref = createRef();

	constructor( props ) {
		super( props );
		this.state = {
			displayState: PENDING,
			isAmountToggleOpen: false,
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
		this.props.skinAdjuster.addSpaceInstantly( bannerElement.offsetHeight );
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

	toggleAmountVisibility = () => {
		this.setState( { isAmountToggleOpen: !this.state.isAmountToggleOpen } );
	}

	onFormInteraction = () => {
		this.setState( { showLanguageWarning: true, formInteractionSwitcher: !this.state.formInteractionSwitcher } );
	}

	// eslint-disable-next-line no-unused-vars
	render( props, state, context ) {
		const campaignProjection = props.campaignProjection;

		return <div
			className={ classNames( {
				'wmde-banner': true,
				'wmde-banner--hidden': state.displayState === CLOSED,
				'wmde-banner--visible': state.displayState === VISIBLE,
				'wmde-banner--amount-toggle-open': state.isAmountToggleOpen
			} ) }
			ref={this.ref}>
			<BannerTransition
				fixed={ true }
				registerDisplayBanner={ this.registerBannerTransition }
				onFinish={ this.onFinishedTransitioning }
				skinAdjuster={ props.skinAdjuster }
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
									propsForText={ { showFundsModal: this.toggleFundsModal } }/>
							</div>
							<div className="banner__form">
								<div className="banner__form-header">
									Jetzt Spenden
									<a className="close__link" onClick={this.closeBanner}>
										<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
											<rect className="close__link-background" x="0.5" y="0.5" width="23" height="23" rx="4.5"/>
											<path d="M5.54695 4.13965L19.622 18.2146L18.2147 19.6219L4.13965 5.54695L5.54695 4.13965Z" fill="#202122"/>
											<path d="M19.6203 5.54499L5.54524 19.62L4.13794 18.2127L18.2129 4.1377L19.6203 5.54499Z" fill="#202122"/>
										</svg>
									</a>
								</div>
								<DonationForm
									formItems={props.formItems}
									bannerName={props.bannerName}
									campaignName={props.campaignName}
									formatters={props.formatters}
									impressionCounts={props.impressionCounts}
									onFormInteraction={this.onFormInteraction}
									customAmountPlaceholder={ props.translations[ 'custom-amount-placeholder-short' ] }
									submitLabel={props.translations[ 'submit-label-short' ]}
									amountToggle={ AmountToggle( { toggleAmount: this.toggleAmountVisibility } ) }
									errorPosition={ props.errorPosition }
								/>
								<Footer/>
							</div>
						</div>
						<div className="banner__progress">
							<ProgressBar
								formatters={props.formatters}
								daysLeft={campaignProjection.getRemainingDays()}
								donationAmount={campaignProjection.getProjectedDonationSum()}
								goalDonationSum={campaignProjection.goalDonationSum}
								missingAmount={campaignProjection.getProjectedRemainingDonationSum()}
								setStartAnimation={this.registerStartProgressbar}/>
						</div>
					</div>
				</TranslationContext.Provider>
			</BannerTransition>
			<FundsModal
				fundsModalData={props.fundsModalData}
				toggleFundsModal={ this.toggleFundsModal }
				isFundsModalVisible={ this.state.isFundsModalVisible }
				locale='de'/>
		</div>;
	}

}
