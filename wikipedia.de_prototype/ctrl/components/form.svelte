<div class="form">
	<form id="WMDE_Banner-form" method="post" name="donationForm"
			action="https://spenden.wikimedia.de/donation/new?piwik_campaign={campaignName}&piwik_kwd={bannerName}&skin=0&dsn=0">
		<div class="form-field-group">
			<div class="select-group-container">
				<div id="WMDE_Banner-frequency" class="WMDE-Banner-frequency select-group">
				{#each intervals as { value, label }}
					<label class="select-group__option select-group__option--thirdwidth">
						<input type="radio" id="interval_{value}" name="interval" value="{value}" class="select-group__input">
						<span class="select-group__state">{label}</span>
					</label>
				{/each}
			</div>
			<span id="WMDE_Banner-frequency-error-text" class="select-group__errormessage">TODO no-interval-message</span>
		</div>

		<div class="select-group-container">
			<div id="WMDE_Banner-amounts" class="WMDE-Banner-amounts select-group">
			{#each amounts as { value }, i}
				<label id="amount_label_{i}" class="select-group__option select-group__option--quarterwidth">
					<input type="radio" name="betrag_auswahl" id="field-amount_total_{i}" class="select-group__input" value="{value}">
					<span class="select-group__state">{value} €</span>
				</label>
			{/each}
			<label class="select-group__option select-group__option--halfwidth">
				<input type="text" name="amountGiven" id="amount-other-input" size="3"
					   autocomplete="off" value="" placeholder="Wunschbetrag" class="select-group__custom-input">
			</label>
			</div>
			<span id="WMDE_Banner-amounts-error-text" class='select-group__errormessage'>TODOamount-empty-message</span>
		</div>

		<div class="form-field-group">
			<div class="select-group-container">
				<div id="WMDE_Banner-payment-type" class="WMDE-Banner-payment select-group">
					{#each paymentMethods as { value, label }}
						<label class="select-group__option select-group__option--halfwidth">
							<input type="radio" name="zahlweise" value="{value}" class="select-group__input">
							<span class="select-group__state">{label}</span>
						</label>
					{/each}
				</div>
				<span id="WMDE_Banner-payment-type-error-text"
					  class="select-group__errormessage">TODOno-payment-type-message</span>
			</div>

			<div id="WMDE_Banner-submit" class="WMDE-Banner-submit button-group">
				<button class="button-group__button">
					<span class="button-group__label">Weiter, um Spende abzuschließen</span>
				</button>
			</div>
		</div>

		<input type="hidden" id="periode" name="periode" value="0"/>
		<input type="hidden" id="intervalType" name="intervalType" value="0"/>
		<input type="hidden" id="impCount" name="impCount" value=""/>
		<input type="hidden" id="bImpCount" name="bImpCount" value=""/>
	</form>
</div>

<script>
	export let campaignName;
	export let bannerName;

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
</script>

<style lang="postcss" global>
	@import "form.pcss";
</style>

