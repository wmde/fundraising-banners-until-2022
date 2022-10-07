import { h } from 'preact';
import getEnglishOrdinalSuffixOf from '../../../shared/english_ordinal';
import InfoIcon from '../../../components/Icons/InfoIcon';

export default function BannerText( props ) {
	const { currentDayName, campaignDaySentence, visitorsVsDonorsSentence, overallImpressionCount } = props.dynamicCampaignText;
	const animatedVisitorsVsDonorsSentence = visitorsVsDonorsSentence ? <span className="wmde-banner-text-animated-highlight">{ visitorsVsDonorsSentence }</span> : '';

	return <div>
		<p>
			<strong><InfoIcon/> To all our readers in Germany, </strong>
		</p>
		<p>
			It might be a little awkward, so we'll get straight to the point. { campaignDaySentence } This { currentDayName }, for
			the { getEnglishOrdinalSuffixOf( overallImpressionCount ) } time recently, we humbly ask you to defend Wikipedia's
			independence. 99% of our readers don't give; they simply look the other way. We depend on donations averaging about
			€21.60. { animatedVisitorsVsDonorsSentence } If you donate just €5,
			Wikipedia could keep thriving for years. Most people donate because Wikipedia is useful. If Wikipedia has
			given you €5 worth of knowledge this year, take a minute to donate. Show the volunteers who bring you reliable,
			neutral information that their work matters. Thank you.
		</p>
	</div>;
}
