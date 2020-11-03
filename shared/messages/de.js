const Translations = {
	'LANGUAGE': 'de',
	'no-interval-message': 'Bitte wählen Sie zuerst ein Zahlungsintervall.',
	'amount-empty-message': 'Bitte wählen Sie einen Betrag aus.',
	'amount-too-low-message': '1 € muss es mindestens sein.',
	'amount-too-high-message': 'Es darf nicht mehr als 99999 € sein.',
	'no-payment-type-message': 'Bitte wählen Sie eine Zahlungsweise aus.',
	// eslint-disable-next-line max-len
	'address-type-info-message': 'Ihre Kontaktdaten benötigen wir für die Bestätigungsemail und Ihre Zuwendungsbescheinigung. Zudem können wir Sie informieren, wenn Wikipedia in Zukunft Ihre Hilfe benötigt. ',
	'no-address-type-message': 'Bitte wählen Sie aus, ob Sie Kontaktdaten angeben wollen.',
	'anonymous-BEZ-info-message': 'Für Lastschriften ist die Angabe einer Adresse erforderlich.',
	'sms-info-message': 'SMS mit "WIKI" an die 81190. Kosten zzgl. einer Standard-SMS.',
	'sms-payment-message': '5 € per SMS',
	'custom-amount-placeholder': 'Wunschbetrag',
	'custom-amount-placeholder-short': 'anderer',
	'submit-label': 'Weiter, um Spende abzuschließen',
	'use-of-funds-link': 'Wohin geht meine Spende?',
	'prefix-days-left': 'Nur noch',
	'suffix-days-left': '',
	'day-singular': 'Tag',
	'day-plural': 'Tage',
	'day-name-prefix-this': 'an diesem',
	'day-name-prefix-todays': 'am heutigen',
	'day-name-monday': 'Montag',
	'day-name-tuesday': 'Dienstag',
	'day-name-wednesday': 'Mittwoch',
	'day-name-thursday': 'Donnerstag',
	'day-name-friday': 'Freitag',
	'day-name-saturday': 'Samstag',
	'day-name-sunday': 'Sonntag',
	'day-name-st-nicholas-day': 'Nikolaustag',
	'day-name-christmas-eve': 'Weihnachtsfeiertag',
	'day-name-christmas-day': '1. Weihnachtsfeiertag',
	'day-name-2nd-christmas-day': '2. Weihnachtsfeiertag',
	'amount-missing': 'Es fehlen',
	'amount-total': 'Spendenziel:',
	'campaign-day-before-campaign': 'Heute bitten wir Sie um Ihre Unterstützung.',
	'campaign-day-first-day': 'Heute beginnt unsere Spendenkampagne.',
	'campaign-day-nth-day': 'Heute ist der {{days}}. Tag unserer Spendenkampagne.',
	'campaign-day-only-n-days': 'Es bleiben nur noch {{days}} Tage, um Wikipedia in diesem Jahr zu unterstützen.',
	'campaign-day-last-day': 'Es bleibt nur noch ein Tag, um Wikipedia in diesem Jahr zu unterstützen.',

	'interval-once': 'einmalig',
	'interval-monthly': 'monatlich',
	'interval-quarterly': 'vierteljährlich',
	'interval-biannual': 'halbjährlich',
	'interval-yearly': 'jährlich',

	'payment-direct-debit': 'Lastschrift',
	'payment-bank-transfer': 'Überweisung',
	'payment-credit-card': 'Kreditkarte',
	'payment-paypal': 'PayPal',
	'payment-sofort': 'Sofortüberweisung',

	'donation-account': 'Spendenkonto',

	// the following lines are only for the ipad & desktop var test, remove if not in use anymore
	'give-address-statement-positive': 'Ja',
	'give-address-statement-negative': 'Nein',

	// This is for C20_WMDE_Mobile_Test_03 and C20_WMDE_Test_09
	'address-type-label': 'Möchten Sie Ihre Kontaktdaten angeben?',
	'address-type-option-full': 'Vollständige Kontaktdaten',
	'address-type-option-email': 'Nur E-Mail-Adresse',
	'address-type-option-none': 'Gar keine Kontaktdaten',
	'address-type-notice-full': 'Für Spendenquittung per Post und Bestätigung per E-Mail',
	'address-type-notice-email': 'Für Bestätigung per E-Mail',
	'address-type-notice-direct-debit': 'Für Lastschriften ist die Angabe einer Adresse erforderlich.',
	'address-type-error-message': 'Bitte wählen Sie aus, ob Sie Kontaktdaten angeben möchten.',
	'submit-label-paypal': 'Weiter zu PayPal',
	'submit-label-credit-card': 'Weiter zur Dateneingabe',
	'submit-label-sofort': 'Weiter zu Sofort',
	'submit-label-bank-transfer': 'Weiter zur Bankverbindung',
	// End of C20_WMDE_Mobile_Test_03 and C20_WMDE_Test_09

	// This is for the B20 02 desktop var test
	'submit-label-short': 'Weiter',
	'submit-label-default': 'Weiter zur Adresseingabe',
	// eslint-disable-next-line max-len
	'address-type-notice-nein': 'Ihre Kontaktdaten benötigen wir für die Bestätigungsemail und Ihre Spendenquittung. Zudem können wir Sie auf Wunsch informieren, wenn Wikipedia in Zukunft Ihre Hilfe benötigt.',
	'address-type-notice-disabled': 'Für Lastschriften ist die Angabe einer Adresse erforderlich.',

	// For the collage banner
	// eslint-disable-next-line max-len
	'bank-account-tooltip': 'Kontoinhaberin ist die Wikimedia Fördergesellschaft. Sie ist die unabhängige gemeinnützige Organisation, die in Deutschland Spenden für Wikipedia und andere Wikimedia-Projekte sammelt.',

	// for B20_WPDE_desktop_01_var, B20_WMDE_mobile_en_01 text test, remove if not used anymore
	'visitors-vs-donors-sentence': '{{millionImpressionsPerDay}} Millionen Mal wird unser Spendenaufruf täglich angezeigt,' +
		' aber erst {{totalNumberOfDonors}} Menschen haben bisher gespendet.'
};

export default Translations;
