import * as DevGlobalBannerSettings from './global_banner_settings';

// TODO make banners smaller by splitting this in a version for wp.de and wp.org,
//   injecting the right code via webpack

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
				donorsPerMinute: Number( data.donorsPerMinute ),
				averageAmountPerDonation: Number( data.averageAmountPerDonation )
			},
			millionImpressionsPerDay: Number( data.millionImpressionsPerDay ),
			startDate: data.campaignStartDate,
			endDate: data.campaignEndDate,
			numberOfMembers: Number( data.numberOfMembers ),
			isLateProgress: data.isLateProgress === 'true',
			useOfFundsProvisional: data.useOfFundsProvisional === 'true',
			useOfFundsFigures: {
				software: Number( data.useOfFundsSoftware ),
				international: Number( data.useOfFundsInternational ),
				communities: Number( data.useOfFundsCommunities ),
				society: Number( data.useOfFundsSociety ),
				operative: Number( data.useOfFundsOperative )
			}
		};
	}
}

export class WindowCampaignParameters {
	canProvideParameters() {
		return typeof window.GlobalBannerSettings !== 'undefined';
	}

	getParameters() {
		return {
			donationProjection: {
				goalDonationSum: window.GlobalBannerSettings.goalDonationSum,
				baseDate: window.GlobalBannerSettings[ 'donations-date-base' ],
				baseDonationSum: window.GlobalBannerSettings[ 'donations-collected-base' ],
				donorsBase: window.GlobalBannerSettings[ 'donators-base' ],
				donationAmountPerMinute: window.GlobalBannerSettings[ 'appr-donations-per-minute' ],
				donorsPerMinute: window.GlobalBannerSettings[ 'appr-donators-per-minute' ],
				averageAmountPerDonation: window.GlobalBannerSettings[ 'average-amount-per-donation' ]
			},
			millionImpressionsPerDay: window.GlobalBannerSettings[ 'impressions-per-day-in-million' ],
			startDate: window.GlobalBannerSettings[ 'campaign-start-date' ],
			endDate: window.GlobalBannerSettings[ 'campaign-end-date' ],
			numberOfMembers: window.GlobalBannerSettings.numberOfMembers,
			isLateProgress: window.GlobalBannerSettings[ 'is-late-progress' ],
			useOfFundsProvisional: window.GlobalBannerSettings[ 'use-of-funds-provisional' ],
			useOfFundsFigures: window.GlobalBannerSettings[ 'use-of-funds-figures' ]
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
				donorsPerMinute: DevGlobalBannerSettings[ 'appr-donators-per-minute' ],
				averageAmountPerDonation: DevGlobalBannerSettings[ 'average-amount-per-donation' ]
			},
			millionImpressionsPerDay: DevGlobalBannerSettings[ 'impressions-per-day-in-million' ],
			startDate: DevGlobalBannerSettings[ 'campaign-start-date' ],
			endDate: DevGlobalBannerSettings[ 'campaign-end-date' ],
			numberOfMembers: DevGlobalBannerSettings.numberOfMembers,
			isLateProgress: DevGlobalBannerSettings[ 'is-late-progress' ],
			useOfFundsProvisional: DevGlobalBannerSettings[ 'use-of-funds-provisional' ],
			useOfFundsFigures: DevGlobalBannerSettings[ 'use-of-funds-figures' ]
		};
	}
}

export function createCampaignParameters( paramSources ) {
	const paramCandidates = paramSources || [
		new HtmlDataCampaignParameters( document.getElementById( 'wmde-campaign-parameters' ) ),
		new WindowCampaignParameters(),
		new DevCampaignParameters()
	];
	while ( paramCandidates.length > 0 ) {
		let paramCandidate = paramCandidates.shift();
		if ( paramCandidate.canProvideParameters() ) {
			return paramCandidate.getParameters();
		}
	}
}
