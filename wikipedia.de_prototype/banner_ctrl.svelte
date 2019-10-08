<DesktopBanner
		weekdayPrepPhrase="{weekdayPrepPhrase}"
		campaignDaySentence="{campaignDaySentence}"
		currentDayName="{currentDayName}"
		campaignName="{campaignName}"
		bannerName="{bannerName}"
		amountBannerImpressionsInMillion="{amountBannerImpressionsInMillion}"
		numberOfDonors="{numberOfDonors}"
		progressBar="{progressBar}"/>

<MobileBanner
		weekdayPrepPhrase="{weekdayPrepPhrase}"
		campaignDaySentence="{campaignDaySentence}"
		currentDayName="{currentDayName}"
		campaignName="{campaignName}"
		bannerName="{bannerName}"
		amountBannerImpressionsInMillion="{amountBannerImpressionsInMillion}"
		numberOfDonors="{numberOfDonors}"
		progressBar="{progressBar}"/>

<script>
	import DesktopBanner from './ctrl/banners/desktop_banner.svelte';
	import MobileBanner from './ctrl/banners/mobile_banner.svelte';

	export let weekdayPrepPhrase;
	export let campaignDaySentence;
	export let currentDayName;
	export let campaignName;
	export let bannerName;
	export let amountBannerImpressionsInMillion;
	export let numberOfDonors;
	export let progressBar;
</script>

