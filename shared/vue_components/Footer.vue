<template>
	<div class="banner__footer">
		<div class="footer">
			<div class="footer__item">
				<span>{{ $translations[ 'donation-account' ] }} Wikimedia</span>
			</div>
			<div class="footer__item">
				<span>BIC</span>
				<span class="footer__importantinfo">BFSWDE33BER</span>
			</div>
			<div class="footer__item">
				<span>IBAN</span>
				<span class="footer__importantinfo"><span
					class="iban-block">
					<span>DE33</span><span>1002</span><span>0500</span><span>0001</span><span>1947</span><span>00</span></span></span>
			</div>

			<div class="footer__item footer__item--rightflex footer__usage">
				<a id="application-of-funds-link" class="application-of-funds-link"
				v-on:click="onShowApplicationOfFunds">{{ $translations[ 'use-of-funds-link' ] }}
				</a>
			</div>
		</div>
	</div>
</template>

<script>
export default {
	name: "Footer",
	methods: {
		onShowApplicationOfFunds() {
			// TODO Show application of funds here
		}
	}
}
</script>

<style scoped>

</style>