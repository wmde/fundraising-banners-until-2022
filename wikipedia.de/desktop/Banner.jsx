// eslint-disable-next-line no-unused-vars
import { Component, h, createRef } from 'preact';
import TranslationContext from '../../shared/components/TranslationContext';
import classNames from 'classnames';
import Infobox from '../../shared/components/ui/Infobox';
import ProgressBar from '../../shared/components/ui/ProgressBar';
import DonationForm from '../../shared/components/ui/form/DonationForm';
import Footer from '../../shared/components/ui/Footer';
import FundsModal from '../../shared/components/ui/use_of_funds/FundsModal';
import FundsDistributionInfo from '../../shared/components/ui/use_of_funds/FundsDistributionInfo';
import PropTypes from 'prop-types';

const PENDING = 0;
const VISIBLE = 1;
const CLOSED = 2;

export const BannerType = Object.freeze( {
	CTRL: Symbol( 'ctrl ' ),
	VAR: Symbol( 'var' )
} );

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
			isFundsModalVisible: false,
			setCookie: false,

			// trigger for banner resize events
			formInteractionSwitcher: false
		};
	}

	componentDidMount() {
		this.props.registerDisplayBanner(
			() => {}
		);
		this.props.registerResizeBanner( this.adjustSurroundingSpace.bind( this ) );
		this.adjustSurroundingSpace();
		this.startProgressbar();
		this.props.onFinishedTransitioning();
		this.setState( { displayState: VISIBLE } );
	}

	adjustSurroundingSpace() {
		const bannerElement = document.querySelector( '.wmde-banner.banner-position' );
		this.props.skinAdjuster.addSpaceInstantly( bannerElement.offsetHeight );
	}

	// eslint-disable-next-line no-unused-vars
	componentDidUpdate( previousProps, previousState, snapshot ) {
		if ( previousState.formInteractionSwitcher !== this.state.formInteractionSwitcher ) {
			this.adjustSurroundingSpace();
		}
	}

	closeBanner = e => {
		this.props.trackingData.tracker.trackBannerEvent( 'banner-closed', 0, 0, this.props.trackingData.bannerCloseTrackRatio );
		e.preventDefault();
		this.setState( { displayState: CLOSED, setCookie: true } );
		this.props.onClose();
	};

	registerStartProgressbar = ( startPb ) => {
		this.startProgressbar = startPb;
	};

	toggleFundsModal = () => {
		this.props.trackingData.tracker.trackBannerEvent( 'application-of-funds-shown', 0, 0, this.props.trackingData.bannerClickTrackRatio );
		this.setState( { isFundsModalVisible: !this.state.isFundsModalVisible } );
	};

	onFormInteraction = () => {
		this.setState( { showLanguageWarning: true, formInteractionSwitcher: !this.state.formInteractionSwitcher } );
	}

	// eslint-disable-next-line no-unused-vars
	render( props, state, context ) {
		const campaignProjection = props.campaignProjection;
		return <div
			className={ classNames(
				'wmde-banner',
				'banner-position',
				{
					'wmde-banner--hidden': state.displayState === CLOSED,
					'wmde-banner--visible': state.displayState === VISIBLE,
					'wmde-banner--ctrl': props.bannerType === BannerType.CTRL,
					'wmde-banner--var': props.bannerType === BannerType.VAR
				}
			) }
			ref={ this.ref }>
			<TranslationContext.Provider value={ props.translations }>
				<div className="banner__wrapper">
					<div className="banner__content">
						<div className="banner__infobox">
							<Infobox
								formatters={ props.formatters }
								campaignParameters={ props.campaignParameters }
								campaignProjection={ props.campaignProjection }
								bannerText={ props.bannerText }/>
							<ProgressBar
								formatters={ props.formatters }
								daysLeft={ campaignProjection.getRemainingDays() }
								donationAmount={ campaignProjection.getProjectedDonationSum() }
								goalDonationSum={ campaignProjection.goalDonationSum }
								missingAmount={ campaignProjection.getProjectedRemainingDonationSum() }
								setStartAnimation={ this.registerStartProgressbar }/>
						</div>
						<DonationForm
							formItems={ props.formItems }
							bannerName={ props.bannerName }
							campaignName={ props.campaignName }
							formatters={ props.formatters }
							impressionCounts={ props.impressionCounts }
							onFormInteraction={ this.onFormInteraction }
							customAmountPlaceholder={ props.translations[ 'custom-amount-placeholder' ] }
							onSubmit={ () => {} }
						/>
					</div>
					<div className="close">
						<a className="close__link" onClick={ this.closeBanner }>&#x2715;</a>
						{ state.setCookie ? <img src="https://bruce.wikipedia.de/close-banner?c=fundraising" alt="" height="0" width="0"/> : '' }
					</div>
					<Footer showFundsModal={ this.toggleFundsModal }/>
				</div>
			</TranslationContext.Provider>
			<FundsModal
				fundsModalData={ props.fundsModalData }
				toggleFundsModal={ this.toggleFundsModal }
				isFundsModalVisible={ this.state.isFundsModalVisible }
				locale='de'>
				<FundsDistributionInfo />
			</FundsModal>
		</div>;
	}
}
