export const Intervals = {
	ONCE: { value: '0', label: 'interval-once' },
	MONTHLY: { value: '1', label: 'interval-monthly' },
	QUARTERLY: { value: '3', label: 'interval-quarterly' },
	BIANNUAL: { value: '6', label: 'interval-biannual' },
	YEARLY: { value: '12', label: 'interval-yearly' }
};

export const PaymentMethods = {
	DIRECT_DEBIT: { value: 'BEZ', label: 'payment-direct-debit' },
	BANK_TRANSFER: { value: 'UEB', label: 'payment-bank-transfer' },
	CREDIT_CARD: { value: 'MCP', label: 'payment-credit-card' },
	PAYPAL: { value: 'PPL', label: 'payment-paypal' },
	SOFORT: { value: 'SUB', label: 'payment-sofort' }
};

export const AddressTypes = {
	FULL: { value: 'person', label: 'address-type-option-full', notice: 'address-type-notice-full' },
	EMAIL: { value: 'email', label: 'address-type-option-email', notice: 'address-type-notice-email' },
	NO: { value: 'anonym', label: 'address-type-option-none', notice: 'address-type-notice-none' }
};

export default class FormItemsBuilder {
	constructor( translations, amountFormatter ) {
		this.formItems = {
			intervals: [],
			amounts: [],
			paymentMethods: [],
			addressType: []
		};

		this.translate = ( { value, label, notice } ) => {
			return { value, label: translations[ label ], notice: notice ? translations[ notice ] : null };
		};
		this.formatAmounts = amount => {
			return { value: String( amount ), label: amountFormatter( amount ) };
		};
	}

	setIntervals( ...intervals ) {
		this.formItems.intervals = intervals.map( this.translate );
	}

	setAmounts( ...amounts ) {
		this.formItems.amounts = amounts.map( this.formatAmounts );
	}

	setPaymentMethods( ...paymentMethods ) {
		this.formItems.paymentMethods = paymentMethods.map( this.translate );
	}

	setAddressType( ...addressType ) {
		this.formItems.addressType = addressType.map( this.translate );
	}

	getItems() {
		return this.formItems;
	}

}
