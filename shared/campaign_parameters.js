import * as DevGlobalBannerSettings from './global_banner_settings';

export class HtmlDataCampaignParameters {
	constructor( element ) {
		this.element = element;
	}
	canProvideParameters() {
		return !!this.element;
	}
	getParameters() {
		const data = this.element.dataset;
		return {
			donationProjection: {
				goalDonationSum: Number( data.goalDonationSum ),
				baseDate: data.donationsDateBase,
				baseDonationSum: Number( data.donationsCollectedBase ),
				donorsBase: Number( data.donorsBase ),
				donationAmountPerMinute: Number( data.donationsPerMinute ),
				donorsPerMinute: Number( data.donorsPerMinute )
			},
			millionImpressionsPerDay: data.millionImpressionsPerDay,
			startDate: data.campaignStartDate,
			endDate: data.campaignEndDate
		};
	}
}

/**
 * Default parameters to try things out
 */
export class DevCampaignParameters {
	canProvideParameters() {
		return true;
	}
	getParameters() {
		return {
			donationProjection: {
				goalDonationSum: DevGlobalBannerSettings.goalDonationSum,
				baseDate: DevGlobalBannerSettings[ 'donations-date-base' ],
				baseDonationSum: DevGlobalBannerSettings[ 'donations-collected-base' ],
				donorsBase: DevGlobalBannerSettings[ 'donators-base' ],
				donationAmountPerMinute: DevGlobalBannerSettings[ 'appr-donations-per-minute' ],
				donorsPerMinute: DevGlobalBannerSettings[ 'appr-donators-per-minute' ]
			},
			millionImpressionsPerDay: DevGlobalBannerSettings[ 'impressions-per-day-in-million' ],
			startDate: DevGlobalBannerSettings[ 'campaign-start-date' ],
			endDate: DevGlobalBannerSettings[ 'campaign-end-date' ]
		};
	}
}

export function createCampaignParameters( paramSources ) {
	const paramCandidates = paramSources || [
		new HtmlDataCampaignParameters( document.getElementById( 'wmde-campaign-parameters' ) ),
		new DevCampaignParameters()
	];
	while ( paramCandidates.length > 0 ) {
		let paramCandidate = paramCandidates.shift();
		if ( paramCandidate.canProvideParameters() ) {
			return paramCandidate.getParameters();
		}
	}
}
