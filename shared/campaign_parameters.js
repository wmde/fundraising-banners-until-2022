import * as DevGlobalBannerSettings from './global_banner_settings';


/**
 * Legacy class for slow migration
 * @deprecated
 */
export class GlobalCampaignParameters {
	canProvideParameters() {
		return !!window.GlobalBannerSettings;
	}
	getParameters() {
		return {
			goalSum: window.GlobalBannerSettings.goalSum,
			donationProjection: {
				baseDate: window.GlobalBannerSettings['donations-date-base'],
				baseDonationSum: window.GlobalBannerSettings['donations-collected-base'],
				donorsBase: window.GlobalBannerSettings['donators-base'],
				donationAmountPerMinute: window.GlobalBannerSettings[ 'appr-donations-per-minute' ],
				donorsPerMinute: window.GlobalBannerSettings[ 'appr-donators-per-minute' ]
			},
			millionImpressionsPerDay: window.GlobalBannerSettings['impressions-per-day-in-million'],
			startDate: window.GlobalBannerSettings['campaign-start-date'],
			endDate: window.GlobalBannerSettings['campaign-end-date']
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
			goalSum: DevGlobalBannerSettings.goalSum,
			donationProjection: {
				baseDate: DevGlobalBannerSettings['donations-date-base'],
				baseDonationSum: DevGlobalBannerSettings['donations-collected-base'],
				donorsBase: DevGlobalBannerSettings['donators-base'],
				donationAmountPerMinute: DevGlobalBannerSettings[ 'appr-donations-per-minute' ],
				donorsPerMinute: DevGlobalBannerSettings[ 'appr-donators-per-minute' ]
			},
			millionImpressionsPerDay: DevGlobalBannerSettings['impressions-per-day-in-million'],
			startDate: DevGlobalBannerSettings['campaign-start-date'],
			endDate: DevGlobalBannerSettings['campaign-end-date']
		}
	}
}

export function createCampaignParameters() {
	const paramCandidates = [ new GlobalCampaignParameters(), new DevCampaignParameters() ];
	while ( paramCandidates.length > 0 ) {
		let paramCandidate = paramCandidates.shift();
		if ( paramCandidate.canProvideParameters() ) {
			return paramCandidate.getParameters();
		}
	}
}

