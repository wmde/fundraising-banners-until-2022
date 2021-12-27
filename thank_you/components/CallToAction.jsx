import { h } from 'preact';
import { useContext } from 'preact/hooks';
import TranslationContext from '../../shared/components/TranslationContext';
import MembershipForm from './MembershipForm';

export default function CallToAction( props ) {
	const Translations = useContext( TranslationContext );

	return <div className="call-to-action__wrapper">
		<MembershipForm
			formAction={props.formAction}
			formId="banner-membership-form"
			submitLabel={Translations[ 'call-to-action-button' ]}
			fields={props.defaultFormParams}
			onSubmit={props.onSubmit}
		/>
	</div>;
}
