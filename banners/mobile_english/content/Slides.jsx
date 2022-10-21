import { h } from 'preact';

export default function Slides( dynamicCampaignText, progressBar ) {
	const { currentDayName, campaignDaySentence, visitorsVsDonorsSentence, goalDonationSum } = dynamicCampaignText;

	const animatedVisitorsVsDonorsSentence = visitorsVsDonorsSentence ? <span className="wmde-banner-slider-text-animated-highlight">{ visitorsVsDonorsSentence }</span> : '';

	return [
		{
			content: <div>
				<p><strong>Our donation target: { goalDonationSum } million euros</strong></p>
				{ progressBar }
			</div>
		},
		{
			content: <div className="carousel-cell-first">
				<p><strong>To all our readers in Germany: </strong></p>
				<p>This { currentDayName }, we humbly ask you to defend Wikipedia's independence. { campaignDaySentence }</p>
			</div>
		},
		{
			content: <div>
				<p>99% of our readers don't give; they simply look the other way. We depend on
					donations averaging about €22.66.</p>
			</div>
		},
		{
			content: <div>
				<p>{ animatedVisitorsVsDonorsSentence } If you donate just €5, Wikipedia could keep thriving for years.</p>
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
