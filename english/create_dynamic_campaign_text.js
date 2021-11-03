import DayName from '../shared/day_name';
import CampaignDays, { endOfDay, startOfDay } from '../shared/campaign_days';
import CampaignDaySentence from '../shared/campaign_day_sentence';

export default function createDynamicCampaignText( campaignParameters, translations, impressionCounts ) {
	const dayName = new DayName( new Date() );
	const currentDayName = translations[ dayName.getDayNameMessageKey() ];
	const campaignDays = new CampaignDays(
		startOfDay( campaignParameters.startDate ),
		endOfDay( campaignParameters.endDate )
	);
	const campaignDaySentence = new CampaignDaySentence( campaignDays, translations );

	return {
		currentDayName,
		campaignDaySentence: campaignDaySentence.getSentence(),
		overallImpressionCount: impressionCounts.getOverallCount()
	};
}
