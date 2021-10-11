// eslint-disable-next-line no-unused-vars
import { h, Fragment } from 'preact';
import PropTypes from 'prop-types';

export default function SubmitValues( props ) {
	let addressType = props.addressType || '';
	return <Fragment>
		<input type="hidden" name="addressType" value={ addressType } />
		<input type="hidden" name="amount" value={ props.amount } />
		<input type="hidden" name="interval" value={ props.interval } />
		<input type="hidden" name="paymentType" value={ props.paymentType } />
	</Fragment>;
}

SubmitValues.propTypes = {
	addressType: PropTypes.string,
	amount: PropTypes.string.isRequired,
	interval: PropTypes.string.isRequired,
	paymentType: PropTypes.string.isRequired
};
