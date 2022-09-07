import { h } from 'preact';
import getEnglishOrdinalSuffixOf from '../../../shared/english_ordinal';

export default function Slides( dynamicCampaignText ) {
	const { currentDayName, campaignDaySentence, overallImpressionCount, visitorsVsDonorsSentence } = dynamicCampaignText;
	const Icon = <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
		<circle cx="8" cy="8" r="8" fill="#2B6DA0"/>
		<path d="M8.80003 5.73332V11.7173H10.2667V13.0667H5.96937V11.7173H7.33337V7.19999H5.8667V5.73332H8.80003ZM7.33337 2.79999H8.80003V4.26665H7.33337V2.79999Z" fill="white"/>
	</svg>;

	return [
		{ content: <div>
			<p className="headline">
				{ Icon } To all our readers in Germany,
			</p>
			<p>This { currentDayName }, for the { getEnglishOrdinalSuffixOf(
				overallImpressionCount ) } time recently, we humbly ask you to
			defend Wikipedia's independence. { campaignDaySentence } 99%
			of our readers don't give; they simply look the other way.</p>

		</div> },
		{ content: <div>
			<p>If you are an exceptional reader who has already donated, we sincerely thank you. We depend on donations
				averaging about €21.60. {visitorsVsDonorsSentence}
			</p>
		</div> },
		{ content: <div>
			<p>If you donate just €5, Wikipedia could keep thriving for years. Most people donate
				because Wikipedia is useful. If Wikipedia has given you €5 worth of knowledge this year,
				take a minute to donate. Thank you.
			</p>
		</div> }
	];
}
