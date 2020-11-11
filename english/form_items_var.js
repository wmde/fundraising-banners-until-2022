import FormItemsBuilder, { Intervals, PaymentMethods, AddressType } from './components/ui/form/FormItemsBuilder';

export function createFormItems( translations, amountFormatter ) {
	const builder = new FormItemsBuilder( translations, amountFormatter );
	builder.setIntervals(
		Intervals.ONCE,
		Intervals.MONTHLY,
		Intervals.QUARTERLY,
		Intervals.BIANNUAL,
		Intervals.YEARLY
	);
	builder.setAmounts( 5, 10, 20, 25, 50, 100 );
	builder.setPaymentMethods(
		PaymentMethods.DIRECT_DEBIT,
		PaymentMethods.BANK_TRANSFER,
		PaymentMethods.CREDIT_CARD,
		PaymentMethods.PAYPAL
	);
	builder.setAddressType(
		AddressType.FULL,
		AddressType.EMAIL,
		AddressType.NO
	);
	return builder.getItems();
}
