export const GiveAddressOptions = {
	YES: { value: 'person', label: 'give-address-statement-positive' },
	NO: { value: 'anonym', label: 'give-address-statement-negative' }
};

import FormItemsBuilder from '../../../../shared/components/ui/form/FormItemsBuilder';

export default class LocalFormItemsBuilder extends FormItemsBuilder {
	constructor( translations, amountFormatter ) {
		super( translations, amountFormatter );
		this.formItems = {
			giveAddressOptions: []
		};
	}
	setGiveAddressOptions( ...giveAddressOptions ) {
		this.formItems.giveAddressOptions = giveAddressOptions.map( this.translate );
	}
}
