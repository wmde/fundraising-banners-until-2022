import FormItemsBuilder, { Intervals, PaymentMethods, AddressType } from './components/ui/form/FormItemsBuilder';

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
		PaymentMethods.DIRECT_DEBIT,
		PaymentMethods.BANK_TRANSFER,
		PaymentMethods.SOFORT
	);
	builder.setAddressType(
		AddressType.FULL,
		AddressType.NO
	);
	return builder.getItems();
}
