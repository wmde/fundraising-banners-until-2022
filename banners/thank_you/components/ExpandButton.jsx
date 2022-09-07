import { h } from 'preact';
import classNames from 'classnames';
import { useContext } from 'preact/hooks';
import TranslationContext from '../../../shared/components/TranslationContext';

export default function ExpandButton( props ) {
	const Translations = useContext( TranslationContext );
	return <div className={classNames( 'expand-button', props.expanded ? 'expand-button--expanded' : 'expand-button--collapsed' )}
		onClick={this.props.toggleExpansion}>
		{
			props.expanded ? Translations[ 'expand-button-collapse-action' ] : Translations[ 'expand-button-expand-action' ]
		}
	</div>;
}
