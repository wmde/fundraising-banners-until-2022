// eslint-disable-next-line no-unused-vars
import { h } from 'preact';
import TranslationContext from '../../../shared/components/TranslationContext';
import { useContext } from 'preact/hooks';
import SelectionInput from '../../../shared/components/ui/form/SelectionInput';

export default function Footer( { showFundsModal } ) {
	const Translations = useContext( TranslationContext );

	return <div className="banner__footer">
		<div className="footer">
			<div className="footer__bank">
				<label className="footer__bank-item">Spendenkonto:
					<SelectionInput value={ 'Wikimedia Foerdergesellschaft' }/>
				</label>
				<label className="footer__bank-item">BIC:
					<SelectionInput value={ 'BFSWDE33BER' }/>
				</label>
				<label className="footer__bank-item">IBAN:
					<SelectionInput value={ 'DE33 1002 0500 0001 1947 00' } focusedValue={ 'DE33100205000001194700' }/>
				</label>
			</div>

			<div className="footer__usage">
				<div className="footer__item">
					<a id="application-of-funds-link" className="application-of-funds-link" onClick={ showFundsModal }>
						{ Translations[ 'use-of-funds-link' ] }
					</a>
				</div>
			</div>
		</div>
	</div>;
}
