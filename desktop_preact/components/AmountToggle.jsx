// eslint-disable-next-line no-unused-vars
import { h } from 'preact';
import { useContext } from 'preact/hooks';
import TranslationContext from '../../shared/components/TranslationContext';

export default function AmountToggle( props ) {
	const Translations = useContext( TranslationContext );

	return <div>
		<a className="amount-toggle" onClick={ props.toggleAmount }>
			<span className="amount-toggle-open">{ Translations[ 'amount-toggle-open' ] }</span>
			<span className="amount-toggle-close">{ Translations[ 'amount-toggle-close' ] }</span>
		</a>
	</div>;
}
