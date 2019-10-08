<div id="WMDE_Banner">
	<div class="banner">
		<div class="banner__content">
			<div class="infobox">
				<Text	amountBannerImpressionsInMillion="{amountBannerImpressionsInMillion}"
						numberOfDonors="{numberOfDonors}"
						campaignDaySentence="{campaignDaySentence}"
						weekdayPrepPhrase="{weekdayPrepPhrase}"
						currentDayName="{currentDayName}"/>
				<ProgressBar progressBar="{progressBar}"/>
			</div>
			<Form campaignName="{campaignName}" bannerName={bannerName} />
		</div>
		<div class="close"><button class="close__link">&#x2715;</button></div>
		<Footer campaignName="{campaignName}" bannerName={bannerName} />
	</div>
</div>

<Funds/>

<script>
	import Text from '../components/text.svelte';
	import Form from '../components/form.svelte';
	import ProgressBar from '../components/progressbar.svelte';
	import Footer from '../components/footer.svelte';
	import Funds from '../components/funds.svelte';

	export let weekdayPrepPhrase;
	export let campaignDaySentence;
	export let currentDayName;
	export let campaignName;
	export let bannerName;
	export let amountBannerImpressionsInMillion;
	export let numberOfDonors;
	export let progressBar;
</script>

<style lang="postcss" global>
	@import 'desktop_banner.pcss';
</style>
