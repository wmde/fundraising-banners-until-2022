import { h } from 'preact';
import { useEffect, useRef } from 'preact/hooks';

export default function SubmitForm( props ) {
	const { addressType, interval, numericAmount, paymentMethod } = props.submitValues;
	const formRef = useRef();

	useEffect( () => {
		if ( props.submit > 0 ) {
			formRef.current.submit();
		}
	}, [ props.submit ] );

	return <form method="post" name="donationForm" action={ props.formAction } ref={ formRef }>
		<input type="hidden" name="addressType" value={ addressType || '' } />
		<input type="hidden" name="interval" value={ interval } />
		<input type="hidden" name="amount" value={ props.amountFormatter( numericAmount ) } />
		<input type="hidden" name="paymentType" value={ paymentMethod } />
	</form>;
}
