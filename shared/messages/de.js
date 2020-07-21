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

	// This is for the B20 02 desktop var test
	'submit-label-short': 'Weiter',
	'submit-label-default': 'Weiter zur Adresseingabe',
	'submit-label-paypal': 'Weiter zu PayPal',
	'submit-label-credit-card': 'Weiter zur Dateneingabe',
	'submit-label-bank-transfer': 'Weiter zur Kontoverbindung',
	'address-type-label-default': 'Möchten Sie Ihre Kontaktdaten angeben?',
	// eslint-disable-next-line max-len
	'address-type-label-nein': 'Ihre Kontaktdaten benötigen wir für die Bestätigungsemail und Ihre Zuwendungsbescheinigung. Zudem können wir Sie auf Wunsch informieren, wenn Wikipedia in Zukunft Ihre Hilfe benötigt.',
	'address-type-label-disabled': 'Für Lastschriften ist die Angabe einer Adresse erforderlich.'
};

export default Translations;
