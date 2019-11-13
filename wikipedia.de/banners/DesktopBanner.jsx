import { h, Component } from 'preact';
import classNames from 'classnames';

import DonationForm from '../components/DonationForm';
import Footer from '../components/Footer';
import Funds from '../components/Funds';
import Infobox from '../components/Infobox';
import ProgressBar from '../components/ProgressBar';

export default class DesktopBanner extends Component {

	componentDidMount() {
		if ( this.startAnimation ) {
			this.startAnimation();
		}
	}

	setStartAnimation = ( startAnimation ) => {
		this.startAnimation = startAnimation;
	};

	render( props ) {
		const campaignProjection = props.campaignProjection;
		return <div className={classNames(
				props.Styles.DesktopBanner.banner,
				props.Styles.Colors.backgroundWhite,
				{ [props.Styles.DesktopBanner.bannerIsHidden]: !props.bannerVisible }
				)}>
			<div className={props.Styles.DesktopBanner.banner__wrapper}>
				<div className={props.Styles.DesktopBanner.banner__content}>
					<div className={props.Styles.DesktopBanner.infobox}>
						<Infobox amountBannerImpressionsInMillion={props.amountBannerImpressionsInMillion}
								 numberOfDonors={props.numberOfDonors}
								 campaignDaySentence={props.campaignDaySentence}
								 weekdayPrepPhrase={props.weekdayPrepPhrase}
								 currentDayName={props.currentDayName}
								 Styles={props.Styles}
						/>
						<ProgressBar
							locale={props.locale}
							daysLeft={campaignProjection.getRemainingDays()}
							donationAmount={campaignProjection.getProjectedDonationSum()}
							goalDonationSum={campaignProjection.goalDonationSum}
							missingAmount={campaignProjection.getProjectedRemainingDonationSum()}
							setStartAnimation={this.setStartAnimation}
							Styles={props.Styles}
						/>
					</div>
					<DonationForm bannerName={props.bannerName} campaignName={props.campaignName} Styles={props.Styles}/>
				</div>
				<div className={ props.Styles.CloseButton.close }>
					<button
						className={classNames(
						props.Styles.CloseButton.close__link,
						props.Styles.Colors.dark,
						props.Styles.Colors.backgroundTransparent)}
							onClick={props.closeBanner}>&#x2715;</button>
				</div>
				<Footer bannerName={props.bannerName} campaignName={props.campaignName} Styles={props.Styles}/>
			</div>
			<Funds Styles={props.Styles}/>
		</div>
	}
}