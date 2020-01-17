import FormItemsBuilder, { Intervals, PaymentMethods } from '../shared/components/ui/form/FormItemsBuilder';

export function createFormItems( translations, amountFormatter ) {
	const builder = new FormItemsBuilder( translations, amountFormatter );
	builder.setIntervals(
		Intervals.ONCE,
		Intervals.MONTHLY,
		Intervals.YEARLY
	);
	builder.setAmounts( 5, 15, 25, 50, 100 );
	builder.setPaymentMethods(
		PaymentMethods.DIRECT_DEBIT,
		PaymentMethods.BANK_TRANSFER,
		PaymentMethods.CREDIT_CARD,
		PaymentMethods.PAYPAL,
		PaymentMethods.SOFORT
	);
	return builder.getItems();
}
