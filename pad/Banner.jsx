// eslint-disable-next-line no-unused-vars
import { Component, h, createRef } from 'preact';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import BannerTransition from '../shared/components/BannerTransition';
import ProgressBar from '../shared/components/ui/ProgressBar';
import Footer from './components/ui/Footer';
import Infobox from '../shared/components/ui/Infobox';
import TranslationContext from '../shared/components/TranslationContext';
import { LocalImpressionCount } from '../shared/local_impression_count';
import { CampaignProjection } from '../shared/campaign_projection';

const PENDING = 0;
const VISIBLE = 1;
const CLOSED = 2;

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

	onFormInteraction = () => {
		this.setState( { showLanguageWarning: true, formInteractionSwitcher: !this.state.formInteractionSwitcher } );
	}

	// eslint-disable-next-line no-unused-vars
	render( props, state, context ) {
		const campaignProjection = props.campaignProjection;
		const DonationForm = props.donationForm;
		return <div
			className={classNames(
				'wmde-banner',
				state.displayState === CLOSED ? 'wmde-banner--hidden' : '',
				state.displayState === VISIBLE ? 'wmde-banner--visible' : ''
			)}
			ref={this.ref}>
			<BannerTransition
				fixed={ true }
				registerDisplayBanner={ this.registerBannerTransition }
				onFinish={ this.startProgressbar }
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
									bannerText={props.bannerText}/>
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
							/>
						</div>
						<div className="close">
							<a className="close__link" onClick={this.closeBanner}>&#x2715;</a>
						</div>
						<Footer
							bannerName={props.bannerName}
							campaignName={props.campaignName}
						/>
					</div>
				</TranslationContext.Provider>
			</BannerTransition>
		</div>;
	}

}
