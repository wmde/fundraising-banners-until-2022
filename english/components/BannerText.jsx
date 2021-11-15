import { h } from 'preact';
import getEnglishOrdinalSuffixOf from '../../shared/english_ordinal';

export default function BannerText( props ) {
	const { currentDayName, campaignDaySentence, overallImpressionCount, visitorsVsDonorsSentence } = props;

	return <div className="banner-text">

		<p>
			<span className="banner-headline">
				<img className="info-icon" height="16" width="16" src="https://upload.wikimedia.org/wikipedia/commons/9/93/Info-icon-black-on-yellow.svg" alt="info_icon" />
				<strong> To all our readers in Germany, </strong>
			</span>
			It might be a little awkward, so we'll get straight to the point.{ ' ' }
			{ campaignDaySentence } This { currentDayName }, for the { getEnglishOrdinalSuffixOf( overallImpressionCount ) } time recently, we humbly
			ask you to defend Wikipedia's independence. 99% of our readers don't give; they simply look
			the other way. If you are an exceptional reader who has already donated, we
			sincerely thank you. We depend on donations averaging about €21.60.{ ' ' }
			{ visitorsVsDonorsSentence }

			<span className="text__highlight text__headline--bold"> If you donate just €5, Wikipedia
						could keep thriving for years. </span>

			Most people donate because Wikipedia is useful. If Wikipedia has given you €5 worth of knowledge
			this year, take a minute to donate. Show the volunteers who bring you reliable, neutral
			information that their work matters. Thank you.
		</p>

	</div>;
}
