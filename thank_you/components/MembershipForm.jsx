import { h } from 'preact';

export default function MembershipForm( props ) {
	return <form
		method="GET"
		action={ props.formAction }
		className="call-to-action__form"
		id={ props.formId }
	>
		{ Object.entries( props.fields ).map( ( [ k, v ] ) => ( <input key={k} type="hidden" name={k} value={v}/> ) ) }

		<button
			onClick={ ( e ) => props.onSubmit( props.formId, e ) }
			className="call-to-action__button">{props.submitLabel}</button>
	</form>;
}
