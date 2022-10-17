import { h } from 'preact';
import InfoIcon from '../../../components/Icons/InfoIcon';

export default function Slides( dynamicCampaignText ) {
	const { currentDayName, campaignDaySentence, visitorsVsDonorsSentence } = dynamicCampaignText;
	const animatedVisitorsVsDonorsSentence = visitorsVsDonorsSentence ? <span className="wmde-banner-slider-text-animated-highlight">{ visitorsVsDonorsSentence }</span> : '';

	return [
		{ content: <div>
			<p className="headline">
				<InfoIcon fill={ '#990a00' }/> To all our readers in Germany,
			</p>
			<p>This { currentDayName } we humbly ask you to defend Wikipedia's
				independence. { campaignDaySentence } 99% of our readers don't
				give; they simply look the other way.</p>
		</div> },
		{ content: <div>
			<p>We depend on donations averaging about €22.66. { animatedVisitorsVsDonorsSentence } If
				you donate just €5, Wikipedia could keep thriving for years.</p>
		</div> },
		{ content: <div>
			<p>Most people donate because Wikipedia is useful. If Wikipedia has
				given you €5 worth of knowledge this year, take a minute to
				donate. Thank you.</p>
		</div> }
	];
}
