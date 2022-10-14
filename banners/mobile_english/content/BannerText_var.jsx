import { h } from 'preact';

export default function BannerText( props ) {
	const { currentDayName, campaignDaySentence, visitorsVsDonorsSentence } = props.dynamicCampaignText;
	const animatedVisitorsVsDonorsSentence = visitorsVsDonorsSentence ? <span className="wmde-banner-text-animated-highlight">{ visitorsVsDonorsSentence }</span> : '';

	return <div className="banner-text">
		<p className="banner-text-title">
			Hi,
		</p>
		<p>
			This { currentDayName } we humbly ask you to defend Wikipedia's independence. { campaignDaySentence } 99%
			of our readers don't give; they simply look the other way. We depend on donations averaging about
			€22.66. { animatedVisitorsVsDonorsSentence } If you donate just €5, Wikipedia could keep thriving for
			years. Most people donate because Wikipedia is useful. If Wikipedia has given you €5 worth of knowledge
			this year, take a minute to donate. Thank you.
		</p>
	</div>;
}
