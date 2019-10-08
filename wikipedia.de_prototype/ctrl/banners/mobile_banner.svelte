<div class="mini-banner">
	<div class="mini-banner-box">
		<div class="mini-banner-content">
			<div class="banner-headline">
				<div>
					<span>Die Wikimedia-Spendenkampagne</span>
				</div>
			</div>
			<div id="mini-banner-close-button" class="banner-close-button"></div>
			<div class="mini-banner-carousel">
				<div class="carousel-cell">
					<p>Liebe Leserinnen und Leser, an diesem { currentDayName } sind Sie in Deutschland gefragt:</p>
				</div>
				<div class="carousel-cell">
					<p>Über { amountBannerImpressionsInMillion } Millionen Mal wird unser Spendenaufruf täglich angezeigt, aber nur { numberOfDonors } Menschen haben bisher gespendet. Schon der Preis einer Tasse Kaffee würde genügen.</p>
				</div>
				<div class="carousel-cell">
					<p class="goal-headline">Unser Spendenziel: 8,1&nbsp;Millionen&nbsp;Euro</p>
					{@html progressBar }
				</div>
				<div class="carousel-cell">
					<p>Wenn alle, die das jetzt lesen, einen kleinen Beitrag leisten, wäre unser Spendenziel bereits am heutigen { currentDayName } erreicht.</p>
				</div>
				<div class="carousel-cell">
					<p>Es ist leicht, diese Nachricht zu ignorieren und die meisten werden das wohl tun.</p>
				</div>
				<div class="carousel-cell">
					<p>Wenn Sie Wikipedia nützlich finden, nehmen Sie sich an diesem { currentDayName } bitte eine Minute Zeit und geben Wikipedia mit Ihrer Spende etwas zurück.</p>
				</div>
			</div>
			<div class="mini-banner-tab">
				<div class="mini-banner-tab-inner">
					Jetzt spenden
				</div>
			</div>
		</div>
	</div>
</div>

<Funds/>

<script>
	import Funds from '../components/funds.svelte';
	import { Slider } from '../../../shared/banner_slider';
	import { onMount } from 'svelte';

	export let weekdayPrepPhrase;
	export let campaignDaySentence;
	export let currentDayName;
	export let campaignName;
	export let bannerName;
	export let amountBannerImpressionsInMillion;
	export let numberOfDonors;
	export let progressBar;

	const sliderAutoPlaySpeed = 5000;
	const fullscreenBannerSlideInSpeed = 1250;

	/**
	 * Slider wrapper object holding a Flickity-based slider
	 * @type {Slider}
	 */
	const bannerSlider = new Slider( sliderAutoPlaySpeed );

	onMount(async () => {
		bannerSlider.initialize();
		bannerSlider.enableAutoplay();
	});
</script>

<style lang="postcss" global>
	@import 'mobile_banner.pcss';
</style>
