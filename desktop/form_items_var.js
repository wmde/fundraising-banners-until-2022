import LocalFormItemsBuilder, { Intervals, PaymentMethods } from './components_var/ui/form/FormItemsBuilder';

export function createFormItems( translations, amountFormatter ) {
	const builder = new LocalFormItemsBuilder( translations, amountFormatter );
	builder.setIntervals(
		Intervals.ONCE,
		Intervals.MONTHLY,
		Intervals.QUARTERLY,
		Intervals.YEARLY
	);
	builder.setAmounts( 5, 10, 20, 25, 50, 100 );
	builder.setPaymentMethods(
		PaymentMethods.DIRECT_DEBIT,
		PaymentMethods.BANK_TRANSFER,
		PaymentMethods.CREDIT_CARD,
		PaymentMethods.PAYPAL
	);
	return builder.getItems();
}
