// eslint-disable-next-line no-unused-vars
import { Component, h, createRef } from 'preact';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import BannerTransition from '../shared/components/BannerTransition';
import Infobox from '../shared/components/ui/Infobox';
import FundsModal from '../shared/components/ui/FundsModal';
import TranslationContext from '../shared/components/TranslationContext';

const PENDING = 0;
const VISIBLE = 1;
const CLOSED = 2;

export default class BannerVar extends Component {

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
		this.slideInBanner = () => {
		};
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
		// Uncomment when we have a progress bar during the campaign again
		// this.startProgressbar()
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
		const DonationForm = props.donationForm;

		return <div
			className={ classNames( {
				'wmde-banner': true,
				'wmde-banner--hidden': state.displayState === CLOSED,
				'wmde-banner--visible': state.displayState === VISIBLE,
				'wmde-banner--amount-toggle-open': state.isAmountToggleOpen
			} ) }
			ref={ this.ref }>
			<BannerTransition
				fixed={ true }
				registerDisplayBanner={ this.registerBannerTransition }
				onFinish={ this.onFinishedTransitioning }
				skinAdjuster={ props.skinAdjuster }
			>
				<TranslationContext.Provider value={ props.translations }>
					<div className="banner__wrapper">
						<a className="close__link" onClick={ this.closeBanner }>
							<svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
								{/* eslint-disable-next-line max-len */}
								<path d="M7.08922 5.99887L11.9975 1.09055L10.907 0L5.99867 4.90832L1.09262 0.00223923L0.0020752 1.09279L4.90813 5.99887L0 10.907L1.09054 11.9976L5.99867 7.08941L10.909 11.9998L11.9996 10.9093L7.08922 5.99887Z" fill="black"/>
							</svg>
						</a>
						<div className="banner__content">
							<div className="banner__infobox">
								<Infobox
									formatters={ props.formatters }
									campaignParameters={ props.campaignParameters }
									campaignProjection={ props.campaignProjection }
									bannerText={ props.bannerText }
									propsForText={ { showFundsModal: this.toggleFundsModal } }/>
							</div>
							<div className="banner__form">
								<DonationForm
									formItems={ props.formItems }
									bannerName={ props.bannerName }
									campaignName={ props.campaignName }
									formatters={ props.formatters }
									impressionCounts={ props.impressionCounts }
									onFormInteraction={ this.onFormInteraction }
									onSubmit={props.onSubmit}
									customAmountPlaceholder={ props.translations[ 'custom-amount-placeholder' ] }
									submitLabel={ props.translations[ 'submit-label-short' ] }
									errorPosition={ props.errorPosition }
								/>
							</div>
						</div>
					</div>
				</TranslationContext.Provider>
			</BannerTransition>
			<FundsModal
				fundsModalData={ props.fundsModalData }
				toggleFundsModal={ this.toggleFundsModal }
				isFundsModalVisible={ this.state.isFundsModalVisible }
				locale='de'/>
		</div>;
	}

}
