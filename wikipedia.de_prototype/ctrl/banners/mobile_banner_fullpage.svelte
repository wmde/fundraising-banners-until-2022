<div id="frbanner" class="frbanner" class:visible={isFullPageVisible} >
	<div id="frbanner-window" class="frbanner-window">
		<div id="modal-signup" class="cf">
			<div class="infobox">
				<div class="close"><button class="close__link" on:click={closeBanner}>&#x2715;</button></div>
				<Text	amountBannerImpressionsInMillion="{amountBannerImpressionsInMillion}"
						 numberOfDonors="{numberOfDonors}"
						 campaignDaySentence="{campaignDaySentence}"
						 weekdayPrepPhrase="{weekdayPrepPhrase}"
						 currentDayName="{currentDayName}"/>
				<ProgressBar progressBar="{progressBar}"/>
				<div class="call-to-action">
					Jetzt sind Sie <span class="call-to-action__optional-text">in Deutschland</span> gefragt.
				</div>
				<Form campaignName="{campaignName}" bannerName={bannerName} />
				<div class="smallprint" id="frbanner-smallprint">
					<div class="smallprint">
						<span>
							<a href="https://spenden.wikimedia.de/spenden/Impressum?piwik_campaign={campaignName}&piwik_kwd={bannerName}_link&skin=0&da=0&dsn=0" target="_blank">Impressum</a>
						</span>
						<span class="separator"> | </span>
						<span>
							<a href="https://spenden.wikimedia.de/spenden/Datenschutz?piwik_campaign={campaignName}&piwik_kwd={bannerName}_link&skin=0&da=0&dsn=0" target="_blank">Datenschutz</a>
						</span>
						<span class="separator"> | </span>
						<span>
							<a href="https://spenden.wikimedia.de/use-of-funds?piwik_campaign={campaignName}&piwik_kwd={bannerName}_link&skin=0&da=0&dsn=0" target="_blank">Wohin geht meine Spende?</a>
						</span>
					</div>
				</div>
			</div>
		</div>
	</div>
</div>

<script>
	import Text from '../components/text.svelte';
	import Form from '../components/form.svelte';
	import ProgressBar from '../components/progressbar.svelte';

	export let weekdayPrepPhrase;
	export let campaignDaySentence;
	export let currentDayName;
	export let campaignName;
	export let bannerName;
	export let amountBannerImpressionsInMillion;
	export let numberOfDonors;
	export let progressBar;
	export let isFullPageVisible;

	function closeBanner(  ) {
		isFullPageVisible = false;
	}
</script>

<style lang="postcss" global>
	@import 'mobile_banner_fullpage.pcss';
</style>
