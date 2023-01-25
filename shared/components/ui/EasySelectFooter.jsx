import { h } from 'preact';
import TranslationContext from '../../components/TranslationContext';
import { useContext } from 'preact/hooks';
import SelectionInput from './form/SelectionInput';

export default function EasySelectFooter( { showFundsModal } ) {
	const Translations = useContext( TranslationContext );

	return <div className="banner__footer">
		<div className="footer">
			<div className="footer__bank">
				<label className="footer__bank-item account">{ Translations[ 'donation-account' ] }:
					<SelectionInput value={ 'Wikimedia' }/>
				</label>
				<label className="footer__bank-item bic">BIC:
					<SelectionInput value={ 'BFSWDE33BER' }/>
				</label>
				<label className="footer__bank-item iban">IBAN:
					<SelectionInput value={ 'DE33 1002 0500 0001 1947 00' } focusedValue={ 'DE33100205000001194700' }/>
				</label>
			</div>

			<div className="footer__usage">
				<div className="footer__item">
					<a id="application-of-funds-link" className="application-of-funds-link t-use-of-funds-link" onClick={ showFundsModal }>
						{ Translations[ 'use-of-funds-link' ] }
					</a>
				</div>
			</div>
		</div>
	</div>;
}
