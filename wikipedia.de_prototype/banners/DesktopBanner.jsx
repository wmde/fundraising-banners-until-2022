import { h } from 'preact';
import classNames from 'classnames';

import style from './DesktopBanner.pcss';
import DonationForm from '../components/DonationForm';
import Footer from '../components/Footer';
import Funds from '../components/Funds';
import Infobox from '../components/Infobox';

export default function DesktopBanner( props ) {
	return <div id="WMDE_Banner" className={classNames({'is-hidden': !props.bannerVisible})}>
		<div className="banner">
			<div className="banner__content">
				<div className="infobox">
					<Infobox amountBannerImpressionsInMillion={props.amountBannerImpressionsInMillion}
							 numberOfDonors={props.numberOfDonors}
							 campaignDaySentence={props.campaignDaySentence}
							 weekdayPrepPhrase={props.weekdayPrepPhrase}
							 currentDayName={props.currentDayName}/>
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