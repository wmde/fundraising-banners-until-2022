<DesktopBanner
		weekdayPrepPhrase="{weekdayPrepPhrase}"
		campaignDaySentence="{campaignDaySentence}"
		currentDayName="{currentDayName}"
		campaignName="{campaignName}"
		bannerName="{bannerName}"
		amountBannerImpressionsInMillion="{amountBannerImpressionsInMillion}"
		numberOfDonors="{numberOfDonors}"
		progressBar="{progressBar}"
		trackingData="{trackingData}"/>

<MobileBanner
		weekdayPrepPhrase="{weekdayPrepPhrase}"
		campaignDaySentence="{campaignDaySentence}"
		currentDayName="{currentDayName}"
		campaignName="{campaignName}"
		bannerName="{bannerName}"
		amountBannerImpressionsInMillion="{amountBannerImpressionsInMillion}"
		numberOfDonors="{numberOfDonors}"
		progressBar="{progressBar}"
		trackingData="{trackingData}"/>

<script>
	import DesktopBanner from './ctrl/banners/desktop_banner.svelte';
	import MobileBanner from './ctrl/banners/mobile_banner.svelte';
	import { onMount } from 'svelte';
	import { LocalImpressionCount } from '../shared/local_impression_count';

	export let weekdayPrepPhrase;
	export let campaignDaySentence;
	export let currentDayName;
	export let campaignName;
	export let bannerName;
	export let amountBannerImpressionsInMillion;
	export let numberOfDonors;
	export let progressBar;
	export let trackingData;

	onMount( async () => {
		trackingData.eventTracker.recordBannerImpression();
		const impCount = new LocalImpressionCount( bannerName );
		impCount.incrementImpressionCounts();
	} );
</script>

