import { h } from 'preact';
import CloseIconDefault from '../Icons/CloseIconDefault';

export default function ButtonClose( { onClick, icon, testLabel } ) {
	return <div className="wmde-banner-close">
		<a className={ `wmde-banner-close-link ${ testLabel || 't-close-main-banner' }` } onClick={ onClick }>
			{ icon || <CloseIconDefault/> }
		</a>
	</div>;
}
