import { h } from 'preact';
import TranslationContext from '../../shared/TranslationContext';
import { useContext } from 'preact/hooks';
import SelectionInput from './SelectionInput';
import Tick from '../Icons/Tick';

export default function Footer( { showFundsModal, showAlreadyDonated } ) {
	const Translations = useContext( TranslationContext );

	return <div className="wmde-banner-footer">
		<div className="wmde-banner-footer-bank">
			<a href="#" className="wmde-banner-footer-already-donated" onClick={ showAlreadyDonated }>
				<Tick/> { Translations[ 'already-donated-open-link' ] }
			</a>
			<label className="wmde-banner-footer-bank-item account">{ Translations[ 'donation-account' ] }:
				<SelectionInput value={ 'Wikimedia' }/>
			</label>
			<label className="wmde-banner-footer-bank-item bic">BIC:
				<SelectionInput value={ 'BFSWDE33BER' }/>
			</label>
			<label className="wmde-banner-footer-bank-item iban">IBAN:
				<SelectionInput value={ 'DE33 1002 0500 0001 1947 00' } focusedValue={ 'DE33100205000001194700' }/>
			</label>
		</div>

		<div className="wmde-banner-footer-usage">
			<div className="wmde-banner-footer-item">
				<a id="application-of-funds-link" className="wmde-banner-footer-usage-link t-use-of-funds-link" onClick={ showFundsModal }>
					{ Translations[ 'use-of-funds-link' ] }
				</a>
			</div>
		</div>
	</div>;
}
