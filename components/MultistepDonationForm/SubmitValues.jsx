import { h, Fragment } from 'preact';
import PropTypes from 'prop-types';

export default function SubmitValues( props ) {
	return <Fragment>
		<input type="hidden" name="addressType" value={ props.submitValues.addressType || '' } />
		<input type="hidden" name="amount" value={ props.formatter( props.submitValues.amount ) } />
		<input type="hidden" name="interval" value={ props.submitValues.interval } />
		<input type="hidden" name="paymentType" value={ props.submitValues.paymentMethod } />
	</Fragment>;
}

SubmitValues.propTypes = {
	submitValues: PropTypes.object,
	formatter: PropTypes.func.isRequired
};
