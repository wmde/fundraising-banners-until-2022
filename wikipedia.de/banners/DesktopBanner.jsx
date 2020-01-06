// eslint-disable-next-line no-unused-vars
import { h, Component } from 'preact';
import classNames from 'classnames';

import DonationForm from '../components/DonationForm';
import Footer from '../components/Footer';
import Infobox from '../components/Infobox';
import ProgressBar from '../components/ProgressBar';
import FundsModal from '../../shared/components/ui/FundsModal';

export default class DesktopBanner extends Component {

	constructor( props ) {
		super( props );
		this.state = {
			isFundsModalVisible: false
		};
	}

	componentDidMount() {
		if ( this.startAnimation ) {
			this.startAnimation();
		}
	}

	setStartAnimation = ( startAnimation ) => {
		this.startAnimation = startAnimation;
	};

	setToggleFundsModal = () => {
		this.props.trackingData.eventTracker.trackEvent( 'application-of-funds-shown', this.props.trackingData.bannerClickTrackRatio );
		this.setState( { isFundsModalVisible: !this.state.isFundsModalVisible } );
	};

	render( props ) {
		const campaignProjection = props.campaignProjection;
		return <div id="WMDE_Banner" className={classNames( { 'is-hidden': !props.bannerVisible } )}>
			<div className="banner banner--desktop">
				<div className="banner__content">
					<div className="infobox">
						<Infobox amountBannerImpressionsInMillion={props.amountBannerImpressionsInMillion}
							numberOfDonors={props.numberOfDonors}
							campaignDaySentence={props.campaignDaySentence}
							weekdayPrepPhrase={props.weekdayPrepPhrase}
							currentDayName={props.currentDayName}/>
						<ProgressBar
							locale={props.locale}
							daysLeft={campaignProjection.getRemainingDays()}
							donationAmount={campaignProjection.getProjectedDonationSum()}
							goalDonationSum={campaignProjection.goalDonationSum}
							missingAmount={campaignProjection.getProjectedRemainingDonationSum()}
							setStartAnimation={this.setStartAnimation}/>
					</div>
					<DonationForm bannerName={props.bannerName} campaignName={props.campaignName}/>
				</div>
				<div className="close">
					<button className="close__link" onClick={props.closeBanner}>&#x2715;</button>
				</div>
				<Footer setToggleFundsModal={this.setToggleFundsModal}/>
			</div>
			<FundsModal fundsModalData={props.fundsModalData}
				setToggleFundsModal={this.setToggleFundsModal}
				isFundsModalVisible={ this.state.isFundsModalVisible }
				locale={ props.locale }/>
		</div>;
	}
}
