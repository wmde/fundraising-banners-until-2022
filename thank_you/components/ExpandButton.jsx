import { h } from 'preact';
import classNames from 'classnames';

export default function ExpandButton( props ) {
	return <div className={classNames( 'expand-button', props.expanded ? 'expand-button--expanded' : 'expand-button--collapsed' )}
		onClick={this.props.toggleExpansion}>
		{
			props.expanded ? 'Dankestext schließen' : props.expandText
		}
	</div>;
}
