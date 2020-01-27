// eslint-disable-next-line no-unused-vars
import { h } from 'preact';
import DayName from '../../day_name';
import TranslationContext from '../TranslationContext';
import CampaignDays, { endOfDay, startOfDay } from '../../campaign_days';
import CampaignDaySentence from '../../campaign_day_sentence';
import { useContext } from 'preact/hooks';

export default function Infobox( { campaignParameters, campaignProjection, formatters, bannerText, currentDate } ) {

	const BannerText = bannerText;
	const Translations = useContext( TranslationContext );

	const dayName = new DayName( currentDate || new Date() );
	const currentDayName = Translations[ dayName.getDayNameMessageKey() ];
	const weekdayPrepPhrase = dayName.isSpecialDayName() ? Translations[ 'day-name-prefix-todays' ] : Translations[ 'day-name-prefix-this' ];
	const campaignDays = new CampaignDays(
		startOfDay( campaignParameters.startDate ),
		endOfDay( campaignParameters.endDate ),
		currentDate || new Date()
	);
	const campaignDaySentence = new CampaignDaySentence( campaignDays, Translations );

	return <div className="infobox">
		<BannerText
			campaignParamters={ campaignParameters }
			numberOfDonors={ formatters.integerFormatter( campaignProjection.getProjectedNumberOfDonors() ) }
			campaignDaySentence={ campaignDaySentence.getSentence() }
			weekdayPrepPhrase={ weekdayPrepPhrase }
			currentDayName={ currentDayName }
		/>
	</div>;
}
