// eslint-disable-next-line no-unused-vars
import { h } from 'preact';
import DayName from '../../day_name';
import TranslationContext from '../TranslationContext';
import CampaignDays, { endOfDay, startOfDay } from '../../campaign_days';
import CampaignDaySentence from '../../campaign_day_sentence';
import { useContext } from 'preact/hooks';
import VisitorsVsDonorsSentence from '../../visitors_vs_donors_sentence';

export default function Infobox( { campaignParameters, campaignProjection, formatters, bannerText, propsForText, visitorsVsDonorsSentenceKey } ) {

	const BannerText = bannerText;
	const Translations = useContext( TranslationContext );

	const dayName = new DayName( new Date() );
	const currentDayName = Translations[ dayName.getDayNameMessageKey() ];
	const weekdayPrepPhrase = dayName.isSpecialDayName() ? Translations[ 'day-name-prefix-todays' ] : Translations[ 'day-name-prefix-this' ];
	const campaignDays = new CampaignDays(
		startOfDay( campaignParameters.startDate ),
		endOfDay( campaignParameters.endDate )
	);
	const campaignDaySentence = new CampaignDaySentence( campaignDays, Translations );
	const visitorsVsDonorsSentence = new VisitorsVsDonorsSentence(
		campaignParameters.millionImpressionsPerDay,
		formatters.integerFormatter( campaignProjection.getProjectedNumberOfDonors() ),
		campaignDays.getDaysSinceCampaignStart(),
		Translations[ visitorsVsDonorsSentenceKey || 'visitors-vs-donors-sentence' ]
	);
	const additionalProps = propsForText || {};

	return <div className="infobox">
		<BannerText
			{...additionalProps}
			campaignParameters={ campaignParameters }
			numberOfDonors={ formatters.integerFormatter( campaignProjection.getProjectedNumberOfDonors() ) }
			campaignDaySentence={ campaignDaySentence.getSentence() }
			visitorsVsDonorsSentence={ visitorsVsDonorsSentence.getSentence() }
			weekdayPrepPhrase={ weekdayPrepPhrase }
			currentDayName={ currentDayName }
		/>
	</div>;
}
