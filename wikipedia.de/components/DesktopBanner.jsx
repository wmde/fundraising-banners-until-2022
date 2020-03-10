// eslint-disable-next-line no-unused-vars
import { h, Component } from 'preact';
import classNames from 'classnames';

import DonationForm from '../../shared/components/ui/form/DonationForm';
import Footer from '../../shared/components/ui/Footer';
import Infobox from '../../shared/components/ui/Infobox';
import ProgressBar from '../../shared/components/ui/ProgressBar';
import FundsModal from '../../shared/components/ui/FundsModal';

export default class DesktopBanner extends Component {

	constructor( props ) {
		super( props );
		this.state = {
			isFundsModalVisible: false,
			setCookie: false
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
		this.props.trackingData.eventTracker.trackEvent(
			'application-of-funds-shown', this.props.trackingData.bannerClickTrackRatio );
		this.setState( { isFundsModalVisible: !this.state.isFundsModalVisible } );
	};

	closeBanner = e => {
		this.setState( { setCookie: true } );
		this.props.closeBanner( e );
	};

	render( props, state ) {
		const campaignProjection = props.campaignProjection;
		return <div className={classNames( 'wmde-wrapper', { 'is-hidden': !props.bannerVisible } )}>
			<div className="banner banner--desktop">
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
					/>
				</div>
				<div className="close">
					<button className="close__link" onClick={this.closeBanner}>&#x2715;</button>
					{ state.setCookie ? <img src="https://bruce.wikipedia.de/close-banner?c=fundraising" alt="" height="0" width="0"/> : '' }
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
