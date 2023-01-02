import FormItemsBuilder, {
	AddressTypes,
	Intervals,
	PaymentMethods
} from '../../components/DonationForm/FormItemsBuilder';

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
		AddressTypes.FULL,
		AddressTypes.EMAIL,
		AddressTypes.NO,
	);
	return builder.getItems();
}
