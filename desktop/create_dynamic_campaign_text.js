import DayName from '../shared/day_name';
import CampaignDays, { endOfDay, startOfDay } from '../shared/campaign_days';
import CampaignDaySentence from '../shared/campaign_day_sentence';
import VisitorsVsDonorsSentence from '../shared/visitors_vs_donors_sentence';
import DonorsNeededSentence from './DonorsNeededSentence';

export default function createDynamicCampaignText( campaignParameters, campaignProjection, impressionCounts, formatters, translations ) {
	const dayName = new DayName( new Date() );
	const currentDayName = translations[ dayName.getDayNameMessageKey() ];
	const campaignDays = new CampaignDays(
		startOfDay( campaignParameters.startDate ),
		endOfDay( campaignParameters.endDate )
	);
	// Set urgency threshold to 11 for testing, remove this after 2021-12-22
	const campaignDaySentence = new CampaignDaySentence( campaignDays, translations, 11 );
	const visitorsVsDonorsSentence = new VisitorsVsDonorsSentence(
		campaignParameters.millionImpressionsPerDay,
		formatters.integerFormatter( campaignProjection.getProjectedNumberOfDonors() ),
		campaignDays.getDaysSinceCampaignStart(),
		translations[ 'visitors-vs-donors-sentence' ]
	);
	const donorsNeeded = campaignProjection.getRemainingDonorsNeeded();
	const donorsNeededRoundedUp = donorsNeeded > 100 ? Math.round( campaignProjection.getRemainingDonorsNeeded() / 100 ) * 100 : donorsNeeded;
	const donorsNeededSentence = new DonorsNeededSentence(
		formatters.integerFormatter( donorsNeededRoundedUp ),
		translations[ 'remaining-donors-needed-sentence' ]
	);

	return {
		currentDayName,
		campaignDaySentence: campaignDaySentence.getSentence(),
		visitorsVsDonorsSentence: visitorsVsDonorsSentence.getSentence(),
		donorsNeededSentence: donorsNeededSentence.getSentence(),
		// FIXME: impressionCounts is not a reactive property this variable doesn't get
		//        incremented when the banner presenter updates it, we need to figure that out
		overallImpressionCount: impressionCounts.getOverallCount() + 1
	};
}
