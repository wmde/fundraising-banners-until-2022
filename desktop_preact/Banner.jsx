// eslint-disable-next-line no-unused-vars
import { Component, h, createRef } from 'preact';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import BannerTransition from '../shared/components/BannerTransition';
import BannerText from './components/BannerText';
import ProgressBar from '../shared/components/ui/ProgressBar';
import DonationForm from '../shared/components/ui/DonationForm';
import Footer from '../shared/components/ui/Footer';
import Infobox from '../shared/components/ui/Infobox';

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
			bannerTop: -350
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
	}

	closeBanner = e => {
		this.props.trackingData.eventTracker.trackBannerEvent( 'banner-closed', 0, 0, this.props.trackingData.bannerCloseTrackRatio );
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

	// eslint-disable-next-line no-unused-vars
	render( props, state, context ) {
		const campaignProjection = props.campaignProjection;
		return <div
			className={classNames(
				'wmde-banner',
				state.displayState === CLOSED ? 'wmde-banner--hidden' : '',
				state.displayState === VISIBLE ? 'wmde-banner--visible' : ''
			)}
			ref={this.ref}>
			<BannerTransition registerDisplayBanner={ this.registerBannerTransition } onFinish={ this.startProgressbar }>
				<div className="banner__wrapper">
					<div className="banner__content">
						<div className="banner__infobox">
							<Infobox>
								<BannerText
									campaignParamters={props.campaignParameters}
									numberOfDonors={props.numberOfDonors}
									campaignDaySentence={props.campaignDaySentence}
									weekdayPrepPhrase={props.weekdayPrepPhrase}
									currentDayName={props.currentDayName}/>
							</Infobox>
							<ProgressBar
								locale={props.locale}
								daysLeft={campaignProjection.getRemainingDays()}
								donationAmount={campaignProjection.getProjectedDonationSum()}
								goalDonationSum={campaignProjection.goalDonationSum}
								missingAmount={campaignProjection.getProjectedRemainingDonationSum()}
								setStartAnimation={this.registerStartProgressbar}/>
						</div>
						<DonationForm bannerName={props.bannerName} campaignName={props.campaignName}/>
					</div>
					<div className="close">
						<a className="close__link" onClick={this.closeBanner}>&#x2715;</a>
					</div>
					{ /* TODO funds modal funktionalitaet implementieren*/}
					<Footer setToggleFundsModal={this.setToggleFundsModal}/>
				</div>
			</BannerTransition>
		</div>;
	}

}
