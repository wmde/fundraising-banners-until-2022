import { h } from 'preact';
import getEnglishOrdinalSuffixOf from '../shared/english_ordinal';

export default function Slides( dynamicCampaignText, progressBar ) {
	const { currentDayName, campaignDaySentence, visitorsVsDonorsSentence, overallImpressionCount } = dynamicCampaignText;

	return [
		{
			content: <div className="carousel-cell-first">
				<p><strong>To all our readers in Germany: </strong></p>
				<p>This { currentDayName }, for the { getEnglishOrdinalSuffixOf( overallImpressionCount ) } time recently, we
					humbly ask you to defend Wikipedia's independence.</p>
				{ progressBar }
			</div>
		},
		{
			content: <div>
				<p>{ campaignDaySentence } 99% of our readers don't give; they simply look the other way.</p>
			</div>
		},
		{
			content: <div>
				<p>We depend on donations averaging about €21.60. { visitorsVsDonorsSentence }</p>
			</div>
		},
		{
			content: <div>
				<p>If everyone reading this gave a small amount, we could keep Wikipedia thriving for years to come.</p>
			</div>
		},
		{
			content: <div>
				<p>Most people donate because Wikipedia is useful. If Wikipedia has given you €5 worth of knowledge
					this year, take a minute to donate. Thank you.</p>
			</div>
		}
	];
}
