import { h } from 'preact';
import InfoIcon from '../../../components/Icons/InfoIcon';

export default function BannerText( props ) {
	const { currentDayName, campaignDaySentence, visitorsVsDonorsSentence } = props.dynamicCampaignText;
	const animatedVisitorsVsDonorsSentence = visitorsVsDonorsSentence ? <span className="wmde-banner-text-animated-highlight">{ visitorsVsDonorsSentence }</span> : '';

	return <div>
		<p>
			<strong><InfoIcon/> To all our readers in Germany, </strong>
		</p>
		<p>
			It might be a little awkward, so we'll get straight to the point. This { currentDayName } we humbly ask
			you to defend Wikipedia's independence. { campaignDaySentence } 99% of our readers don't give; they simply
			look the other way. We depend on donations averaging about €22.66. { animatedVisitorsVsDonorsSentence } If
			you donate just €5, Wikipedia could keep thriving for years. If Wikipedia has given you €5 worth of
			knowledge this year, take a minute to donate. Thank you.
		</p>
	</div>;
}
