// eslint-disable-next-line no-unused-vars
import { h } from 'preact';

import TranslationContext from '../../shared/components/TranslationContext';
import { useContext } from 'preact/hooks';

export default function ButtonTextCtrl() {
	const Translations = useContext( TranslationContext );

	return <span>{ Translations[ 'submit-label' ] }</span>;
}
