import { h } from 'preact';
import InfoIcon from './ui/InfoIcon';
import getEnglishOrdinalSuffixOf from '../../shared/english_ordinal';

export default function Slides( dynamicCampaignText ) {
	const { currentDayName, campaignDaySentence, visitorsVsDonorsSentence, overallImpressionCount } = dynamicCampaignText;

	return [
		{ content: <div>
			<p className="headline">
				<InfoIcon/> <strong>To all our readers in Germany,</strong>
			</p>
			<p>It might be a little awkward, so we'll get straight to the point. { campaignDaySentence } This { currentDayName }, for
				the { getEnglishOrdinalSuffixOf( overallImpressionCount ) } time recently, we humbly ask you to defend Wikipedia's independence.</p>
		</div> },
		{ content: <div>
			<p>99% of our readers don't give; they simply look the
				other way. If you are an exceptional reader who has already donated, we sincerely thank you. We depend on donations
				averaging about €21.60. <span className="text-animated-highlight">{ visitorsVsDonorsSentence }</span></p>
		</div> },
		{ content: <div>
			<p>If you donate just €5, Wikipedia could keep thriving for years. If Wikipedia has given you €5 worth of knowledge
				this year, take a minute to donate. Show the volunteers who bring you reliable, neutral information that their work matters. Thank you.</p>
		</div> }
	];
}
