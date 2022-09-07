import { h } from 'preact';
import CloseIconDefault from '../Icons/CloseIconDefault';

export default function ButtonClose( { onClick, icon } ) {
	return <div className="wmde-banner-close">
		<a className="wmde-banner-close-link" onClick={ onClick }>
			{ icon || <CloseIconDefault/> }
		</a>
	</div>;
}
