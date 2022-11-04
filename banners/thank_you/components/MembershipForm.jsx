import { h } from 'preact';

export default function MembershipForm( props ) {
	return <form
		method="GET"
		action={ props.formAction }
		className="wmde-banner-membership-form"
		id={ props.formId }
	>
		{ Object.entries( props.fields ).map( ( [ k, v ] ) => ( <input key={k} type="hidden" name={k} value={v}/> ) ) }

		<button
			onClick={ () => props.onSubmit( props.formId ) }
			className="wmde-banner-membership-form-button">{props.submitLabel}</button>
	</form>;
}
