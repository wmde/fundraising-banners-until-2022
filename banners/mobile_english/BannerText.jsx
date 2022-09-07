import { h } from 'preact';
import getEnglishOrdinalSuffixOf from '../../shared/english_ordinal';

export default function BannerText( props ) {
	const { currentDayName, campaignDaySentence, visitorsVsDonorsSentence, overallImpressionCount } = props.dynamicCampaignText;
	return <div className="banner-text">
		<p className="text__headline">
			To all our readers in Germany,
		</p>
		<p>
			This { currentDayName }, for the { getEnglishOrdinalSuffixOf( overallImpressionCount ) } time recently, we humbly
			ask you to defend Wikipedia's independence. { campaignDaySentence } 99% of our readers don't give; they simply look
			the other way. If you are an exceptional reader who has already donated, we sincerely thank you. We depend on
			donations averaging about €21.60. { visitorsVsDonorsSentence } If you donate just €5, Wikipedia could keep thriving
			for years. Most people donate because Wikipedia is useful. If Wikipedia has given you €5 worth of knowledge this
			year, take a minute to donate. Thank you.
		</p>
	</div>;
}
