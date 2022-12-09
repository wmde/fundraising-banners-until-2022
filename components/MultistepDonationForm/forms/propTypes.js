import * as PropTypes from 'prop-types';

export const propTypes = {
	isActive: PropTypes.bool.isRequired,
	step: PropTypes.number.isRequired,
	onSubmit: PropTypes.func.isRequired,
	onBack: PropTypes.func.isRequired,
	onNext: PropTypes.func.isRequired,
	trackBannerEvent: PropTypes.func.isRequired,
	formatters: PropTypes.object,
	formItems: PropTypes.array,
	formModel: PropTypes.object,
	errorPosition: PropTypes.symbol,
	scrollToFirstError: PropTypes.func
};
