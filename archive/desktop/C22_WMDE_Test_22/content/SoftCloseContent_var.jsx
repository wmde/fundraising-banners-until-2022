import { h } from 'preact';
import { useContext } from 'preact/hooks';
import TranslationContext from '../../../shared/components/TranslationContext';

export default function SoftCloseContent( props ) {
	const Translations = useContext( TranslationContext );
	const getDaysLeft = daysLeft => {
		return daysLeft + ' ' +
			( daysLeft === 1 ? Translations[ 'day-singular' ] : Translations[ 'day-plural' ] );
	};

	return <div className="wmde-banner-soft-close-prompt">
		Nur noch { getDaysLeft( props.daysLeft ) }, um unser Spendenziel zu erreichen.<br/>
		Vielleicht möchten Sie Wikipedia später unterstützen? Jeder Beitrag hilft.
	</div>;
}
