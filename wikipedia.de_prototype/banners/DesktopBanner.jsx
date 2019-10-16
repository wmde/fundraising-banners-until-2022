import { h } from 'preact'
import style from './DesktopBanner.pcss'
import Infobox from '../components/Infobox';

export default function DesktopBanner( props ) {
	return <div id="WMDE_Banner" className={props.showBanner}>
		<div className="banner">
			<div className="banner__content">
				<Infobox amountBannerImpressionsInMillion={props.amountBannerImpressionsInMillion}
						 numberOfDonors={props.numberOfDonors}
						 campaignDaySentence={props.campaignDaySentence}
						 weekdayPrepPhrase={props.weekdayPrepPhrase}
						 currentDayName={props.currentDayName}/>
				<div>Form goes here</div>
			</div>
			<div className="close">
				<button className="close__link" onclick={props.closeBanner}>&#x2715;</button>
			</div>

		</div>

	</div>
}