const Translations = {
	'LANGUAGE': 'en',
	'no-interval-message': 'How often would you like to donate?',
	'amount-empty-message': 'How much would you like to donate?',
	'amount-too-low-message': 'The donation needs to be at least 1 Euro.',
	'amount-too-high-message': 'The donation cannot be more than 99999 Euros',
	'no-payment-type-message': 'How would you like to pay your donation?',
	'address-type-info-message': 'Please notice that we cannot provide a donation receipt without your address.',
	'no-type-statement-message': 'Do you want to provide your address?',
	'anonymous-BEZ-info-message': 'We need your address for a debit payment.',
	'sms-info-message': 'Text "WIKI" to 81190. Additional costs for sending text messages may apply.',
	'sms-payment-message': '5 € by text message',
	'custom-amount-placeholder': 'Other amount',
	'custom-amount-placeholder-short': 'other',
	'submit-label-short': 'Proceed',
	'submit-label': 'Proceed with the donation',
	'use-of-funds-link': 'Where does my donation go?',
	'prefix-days-left': 'Only',
	'suffix-days-left': 'left',
	'day-singular': 'day',
	'day-plural': 'days',
	'day-name-prefix-this': 'on this',
	'day-name-prefix-todays': 'on today\'s',
	'day-name-monday': 'Monday',
	'day-name-tuesday': 'Tuesday',
	'day-name-wednesday': 'Wednesday',
	'day-name-thursday': 'Thursday',
	'day-name-friday': 'Friday',
	'day-name-saturday': 'Saturday',
	'day-name-sunday': 'Sunday',
	'day-name-st-nicholas-day': 'St Nicholas Day',
	'day-name-christmas-eve': 'Christmas Day',
	'day-name-christmas-day': 'Christmas Day',
	'day-name-2nd-christmas-day': 'Christmas Day',
	'amount-missing': 'Still missing',
	'amount-total': 'Donation target:',
	'campaign-day-before-campaign': 'Today we ask for your support.',
	'campaign-day-first-day': 'Today our fundraising campaign starts.',
	'campaign-day-nth-day': 'This is the {{days}} day of our campaign.',
	'campaign-day-only-n-days': 'Only {{days}} days left to donate for Wikipedia this year.',
	'campaign-day-last-day': 'Today is the final day of our donation campaign.',

	'interval-once': 'one-time',
	'interval-monthly': 'monthly',
	'interval-quarterly': 'quarterly',
	'interval-biannual': 'semi-yearly',
	'interval-yearly': 'yearly',

	'payment-direct-debit': 'Direct Debit',
	'payment-bank-transfer': 'Bank Transfer',
	'payment-credit-card': 'Credit Card',
	'payment-paypal': 'PayPal',
	'payment-sofort': 'Sofortüberweisung',

	'donation-account': 'Donation account',

	// the following 2 lines are only for the ipad var test, remove if not in use anymore
	'give-address-statement-positive': 'Yes',
	'give-address-statement-negative': 'No',

	// For the collage banner
	'bank-account-tooltip': '',

	// for B20_WMDE_en_01_var text test, B20_WMDE_mobile_en_01 remove if not used anymore
	'visitors-vs-donors-sentence': 'Our fundraising appeal is displayed over {{millionImpressionsPerDay}} million ' +
		'times a day, but currently only {{totalNumberOfDonors}} people have donated.',

	// This is for the forms with address type
	'address-type-label': 'Do you want to provide your address data?',
	'address-type-option-full': 'Full address data',
	'address-type-notice-full': 'You will receive a donation receipt by mail. You will also receive an e-mail confirmation of your donation.',
	'address-type-option-email': 'Only e-mail address',
	'address-type-notice-email': 'for e-mail confirmation',
	'address-type-option-none': 'No address data',
	'address-type-notice-none': 'You waive the donation receipt and an e-mail confirmation of your donation. We will not contact you when Wikipedia needs help again.',
	'address-type-notice-direct-debit': 'A postal address is necessary for donating by direct-debit.',
	'address-type-error-message': 'Please choose an option.',
	'submit-label-paypal': 'Proceed with PayPal',
	'submit-label-credit-card': 'Proceed with credit card',
	'submit-label-sofort': 'Proceed with Sofort-Überweisung',
	'submit-label-bank-transfer': 'Proceed with bank transfer',
	'submit-label-default': 'Proceed with the donation',
	'address-type-notice-disabled': 'A postal address is necessary for donating by direct-debit.'
	// End of forms with address type

};

export default Translations;
