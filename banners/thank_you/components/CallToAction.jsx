import { h } from 'preact';
import { useContext } from 'preact/hooks';
import TranslationContext from '../../../shared/components/TranslationContext';
import MembershipForm from './MembershipForm';

export default function CallToAction( props ) {
	const Translations = useContext( TranslationContext );
	const fixedAmountParams = {
		...props.defaultFormParams,
		interval: 1,
		fee: 200
	};

	return <div>
		<MembershipForm
			formAction={props.formAction}
			formId="banner-membership-form-with-amount"
			submitLabel={Translations[ 'call-to-action-button-var1' ]}
			fields={fixedAmountParams}
			onSubmit={props.onSubmit}
		/>
		<MembershipForm
			formAction={props.formAction}
			formId="banner-membership-form"
			submitLabel={Translations[ 'call-to-action-button-var2' ]}
			fields={props.defaultFormParams}
			onSubmit={props.onSubmit}
		/>
	</div>;
}
