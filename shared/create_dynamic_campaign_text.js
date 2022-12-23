import DayName from './day_name';
import CampaignDays, { endOfDay, startOfDay } from './campaign_days';
import CampaignDaySentence from './campaign_day_sentence';
import VisitorsVsDonorsSentence from './visitors_vs_donors_sentence';
import DonorsNeededSentence from './DonorsNeededSentence';
import { getDaysLeft } from './days_left';

export default function createDynamicCampaignText( campaignParameters, campaignProjection, impressionCounts, formatters, translations ) {
	const date = new Date();
	const dayName = new DayName( date );
	const currentDayName = translations[ dayName.getDayNameMessageKey() ];
	const currentDate = translations[ 'month-name-' + ( date.getMonth() + 1 ) ] + ' ' + formatters.dayOfMonthFormatter( date.getDate() );
	const campaignDays = new CampaignDays(
		startOfDay( campaignParameters.startDate ),
		endOfDay( campaignParameters.endDate )
	);
	// Set urgency threshold to 11 for testing, remove this after 2021-12-22
	const campaignDaySentence = new CampaignDaySentence( campaignDays, translations, 11 );
	const visitorsVsDonorsSentence = new VisitorsVsDonorsSentence(
		campaignParameters.millionImpressionsPerDay,
		formatters.integerFormatter( campaignProjection.getProjectedNumberOfDonors() ),
		translations[ 'visitors-vs-donors-sentence' ] ?? '',
		translations[ 'visitors-vs-donors-sentence-no-impressions' ] ?? ''
	);
	const donorsNeeded = campaignProjection.getRemainingDonorsNeeded();
	const donorsNeededRoundedUp = donorsNeeded > 100 ? Math.round( campaignProjection.getRemainingDonorsNeeded() / 100 ) * 100 : donorsNeeded;
	const donorsNeededSentence = new DonorsNeededSentence(
		formatters.integerFormatter( donorsNeededRoundedUp ),
		translations[ 'remaining-donors-needed-sentence' ] ?? ''
	);

	const daysLeft = getDaysLeft( campaignDays.getNumberOfDaysUntilCampaignEnd(), translations );
	const differenceToDonationTarget = formatters.millionFormatterNumeric( campaignProjection.getProjectedRemainingDonationSum() );
	const numberOfDonors = formatters.integerFormatter( campaignProjection.getProjectedNumberOfDonors() );

	return {
		currentDayName,
		currentDate,
		daysLeft,
		differenceToDonationTarget,
		numberOfDonors,
		campaignDaySentence: campaignDaySentence.getSentence(),
		visitorsVsDonorsSentence: visitorsVsDonorsSentence.getSentence(),
		donorsNeededSentence: donorsNeededSentence.getSentence(),
		// FIXME: impressionCounts is not a reactive property this variable doesn't get
		//        incremented when the banner presenter updates it, we need to figure that out
		overallImpressionCount: impressionCounts.getOverallCount() + 1,
		goalDonationSum: formatters.millionFormatterNumeric( campaignProjection.goalDonationSum )
	};
}
