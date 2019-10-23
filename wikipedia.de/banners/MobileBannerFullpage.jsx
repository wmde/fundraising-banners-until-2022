import { h } from 'preact';
import classNames from 'classnames';

import style from './MobileBannerFullpage.pcss'
import DonationForm from '../components/DonationForm';
import Infobox from '../components/Infobox';

export default function MobileBannerFullpage( props ) {
	const trackingParams = `piwik_campaign=${props.campaignName}&piwik_kwd=${props.bannerName}_link`;
	return <div id="frbanner" className={ classNames('frbanner', { 'visible': props.isFullPageVisible && props.bannerVisible }) }>
		<div id="frbanner-window" className="frbanner-window">
			<div id="modal-signup" className="cf">
				<div className="infobox">
					<div className="close">
						<button className="close__link" onClick={props.closeBanner}>&#x2715;</button>
					</div>
					<Infobox amountBannerImpressionsInMillion={props.amountBannerImpressionsInMillion}
						  numberOfDonors={props.numberOfDonors}
						  campaignDaySentence={props.campaignDaySentence}
						  weekdayPrepPhrase={props.weekdayPrepPhrase}
						  currentDayName={props.currentDayName}
						  animateHighlightTrigger={props.animateHighlightTrigger}
					/>
					<div className="call-to-action">
						Jetzt sind Sie <span className="call-to-action__optional-text">in Deutschland</span> gefragt.
					</div>
					<DonationForm campaignName={props.campaignName} bannerName={props.bannerName}/>
					<div className="smallprint" id="frbanner-smallprint">
						<div className="smallprint">
						<span>
							<a href={ `https://spenden.wikimedia.de/spenden/Impressum?${trackingParams}&skin=2&da=0` }
							   target="_blank">Impressum</a>
						</span>
							<span className="separator"> | </span>
							<span>
							<a href={ `https://spenden.wikimedia.de/spenden/Datenschutz?${trackingParams}&skin=2&da=0` }
							   target="_blank">Datenschutz</a>
						</span>
							<span className="separator"> | </span>
							<span>
							<a href={ `https://spenden.wikimedia.de/use-of-funds?${trackingParams}&skin=0&da=0&dsn=0` }
							   target="_blank">Wohin geht meine Spende?</a>
						</span>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>

}