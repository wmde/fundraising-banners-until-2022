<div class="form">
	<form id="WMDE_Banner-form" method="post" name="donationForm"
			action="https://spenden.wikimedia.de/donation/new?piwik_campaign={campaignName}&piwik_kwd={bannerName}&skin=0&dsn=0">
		<div class="form-field-group">
			<div class="{ 'select-group-container' + (paymentIntervalIsValid ? '' : ' select-group-container--with-error') }">
				<div id="WMDE_Banner-frequency" class="WMDE-Banner-frequency select-group">
				{#each intervals as { value, label }}
					<label class="select-group__option select-group__option--thirdwidth">
						<input type="radio" bind:group="{paymentInterval}" on:change="{intervalSelected}" name="periode" value="{value}" class="select-group__input">
						<span class="select-group__state">{label}</span>
					</label>
				{/each}
			</div>
			<span id="WMDE_Banner-frequency-error-text" class="select-group__errormessage">Bitte wählen Sie zuerst ein Zahlungsintervall.</span>
		</div>

		<div class="{ 'select-group-container' + ( amountIsValid ? '' : ' select-group-container--with-error' ) }">
			<div id="WMDE_Banner-amounts" class="WMDE-Banner-amounts select-group">
			{#each amounts as { value }, i}
				<label id="amount_label_{i}" class="select-group__option select-group__option--quarterwidth">
					<input type="radio" name="betrag_auswahl" bind:group="{selectedAmount}" on:change="{amountSelected}" class="select-group__input" value="{value}">
					<span class="select-group__state">{value} €</span>
				</label>
			{/each}
			<label class="select-group__option select-group__option--halfwidth">
				<input type="text" name="amountGiven" bind:value="{customAmount}" on:change="{amountTyped}" size="3"
					   autocomplete="off" value="" placeholder="Wunschbetrag" class="select-group__custom-input">
			</label>
			</div>
			<span id="WMDE_Banner-amounts-error-text" class='select-group__errormessage'>Bitte geben Sie einen Spendenbetrag von min. 1€ ein.</span>
		</div>

		<div class="form-field-group">
			<div class="{ 'select-group-container' + ( paymentMethodIsValid ? '' : ' select-group-container--with-error' ) }">
				<div id="WMDE_Banner-payment-type" class="WMDE-Banner-payment select-group">
					{#each paymentMethods as { value, label }}
						<label class="select-group__option select-group__option--halfwidth">
							<input type="radio" bind:group="{paymentMethod}"
								on:change="{paymentMethodSelected}"
								name="zahlweise" value="{value}"
								class="select-group__input">
								<span class="select-group__state">{label}</span>
						</label>
					{/each}
					<div class="sms-box">
						<label class="select-group__option select-group__option--halfwidth">
							<a href="sms:81190" class="select-group__state">5 € per SMS</a>
						</label>
						<span>SMS mit "WIKI" an die 81190. Kosten zzgl. einer Standard-SMS.</span>
					</div>
				</div>
				<span id="WMDE_Banner-payment-type-error-text"
					  class="select-group__errormessage">Bitte wählen Sie eine Zahlmethode aus.</span>
			</div>

			<div id="WMDE_Banner-submit" class="WMDE-Banner-submit button-group">
				<button class="button-group__button" on:click="{validateForm}">
					<span class="button-group__label">Weiter, um Spende abzuschließen</span>
				</button>
			</div>
		</div>

		<input type="hidden" id="amount" name="betrag" value="{amount}"/>
		<input type="hidden" id="impCount" name="impCount" value="{impCount.overallCount}"/>
		<input type="hidden" id="bImpCount" name="bImpCount" value="{impCount.bannerCount}"/>
	</form>
</div>

<script>
	import { formatAmount } from '../../../shared/format_amount.js'
	import { LocalImpressionCount } from '../../../shared/local_impression_count';

	export let campaignName;
	export let bannerName;

	let paymentInterval = null;
	let selectedAmount = null;
	let customAmount = null;
	let amount = 0;
	let paymentMethod = null;

	let paymentIntervalIsValid = true;
	let amountIsValid = true;
	let paymentMethodIsValid = true;
	let impCount = new LocalImpressionCount( bannerName );

	const intervals = [
		{ value: '0', label: 'einmalig' },
		{ value: '1', label: 'monatlich' },
		{ value: '12', label: 'jährlich' },
	];

	const amounts = [
		{ value: '5' },
		{ value: '10' },
		{ value: '20' },
		{ value: '25' },
		{ value: '50' },
		{ value: '100' },
	];

	const paymentMethods = [
		{ value: 'BEZ', label: 'Lastschrift' },
		{ value: 'UEB', label: 'Überweisung' },
		{ value: 'MCP', label: 'Kreditkarte' },
		{ value: 'PPL', label: 'PayPal' },
	];

	function validateForm( event ) {
		if ( paymentInterval === null ) {
			paymentIntervalIsValid = false;
		}
		if ( Number( amount ) <= 0 ) {
			amountIsValid = false;
		}
		if ( paymentMethod === null ) {
			paymentMethodIsValid = false;
		}

		if ( !paymentIntervalIsValid || !amountIsValid || !paymentMethodIsValid ) {
            event.preventDefault();
		}
	}

	function intervalSelected() {
		paymentIntervalIsValid = true;
	}

function amountSelected(evt) {
		amount = amountSelected;
		amountIsValid = true;
		customAmount = null;
	}

	function amountTyped(  ) {
		const germanAmount = formatAmount( customAmount ).replace( '.', ',' );
		amount = germanAmount;
		customAmount = germanAmount + ' €';
		selectedAmount = null;
		if ( Number( amount ) > 0 ) {
			amountIsValid = true;
		}
	}

	function paymentMethodSelected() {
		paymentMethodIsValid = true;
	}
</script>

<style lang="postcss" global>
	@import "form.pcss";
</style>

