import { h } from 'preact';
import TranslationContext from '../../shared/components/TranslationContext';
import { useContext } from 'preact/hooks';
import SelectionInput from '../../shared/components/ui/form/SelectionInput';

export default function Bank() {
	const Translations = useContext( TranslationContext );

	return <div className="banner__bank">
		<label className="banner__bank-item account">{ Translations[ 'donation-account' ] }:
			<SelectionInput value={ 'Wikimedia' }/>
		</label>
		<label className="banner__bank-item bic">BIC:
			<SelectionInput value={ 'BFSWDE33BER' }/>
		</label>
		<label className="banner__bank-item iban">IBAN:
			<SelectionInput value={ 'DE33 1002 0500 0001 1947 00' } focusedValue={ 'DE33100205000001194700' }/>
		</label>
	</div>;
}
