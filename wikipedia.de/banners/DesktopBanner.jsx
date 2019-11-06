import { h } from 'preact';
import classNames from 'classnames';

import style from './DesktopBanner.pcss';
import DonationForm from '../components/DonationForm';
import Footer from '../components/Footer';
import Funds from '../components/Funds';
import Infobox from '../components/Infobox';
import ProgressBarDesktop from '../components/ProgressBarDesktop';

export default function DesktopBanner( props ) {
	const campaignProjection = props.campaignProjection;
	return <div id="WMDE_Banner" className={classNames({'is-hidden': !props.bannerVisible})}>
		<div className="banner">
			<div className="banner__content">
				<div className="infobox">
					<Infobox amountBannerImpressionsInMillion={props.amountBannerImpressionsInMillion}
							 numberOfDonors={props.numberOfDonors}
							 campaignDaySentence={props.campaignDaySentence}
							 weekdayPrepPhrase={props.weekdayPrepPhrase}
							 currentDayName={props.currentDayName}/>
							 <ProgressBarDesktop
								 locale={props.locale}
								 daysLeft={campaignProjection.getRemainingDays()}
								 donationAmount={campaignProjection.getProjectedDonationSum()}
								 goalDonationSum={campaignProjection.goalDonationSum}
								 missingAmount={campaignProjection.getProjectedRemainingDonationSum()}
								 setStartAnimation={this.props.setStartAnimation} />
				</div>
				<DonationForm bannerName={props.bannerName} campaignName={props.campaignName} />
			</div>
			<div className="close">
				<button className="close__link" onClick={props.closeBanner}>&#x2715;</button>
			</div>
			<Footer bannerName={props.bannerName} campaignName={props.campaignName} />
		</div>
		<Funds/>
	</div>
}