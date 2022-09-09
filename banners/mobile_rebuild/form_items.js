import FormItemsBuilder, { Intervals, PaymentMethods } from '../../components/DonationForm/FormItemsBuilder';

export function createFormItems( translations, amountFormatter ) {
	const builder = new FormItemsBuilder( translations, amountFormatter );
	builder.setIntervals(
		Intervals.ONCE,
		Intervals.MONTHLY,
		Intervals.YEARLY
	);
	builder.setAmounts( 5, 15, 25, 50, 100 );
	builder.setPaymentMethods(
		PaymentMethods.PAYPAL,
		PaymentMethods.CREDIT_CARD,
		{ ...PaymentMethods.DIRECT_DEBIT, notice: 'address-type-notice-direct-debit' },
		PaymentMethods.BANK_TRANSFER,
		PaymentMethods.SOFORT
	);
	return builder.getItems();
}
