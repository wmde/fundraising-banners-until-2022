import { h } from 'preact';
import classNames from 'classnames';
import FundsContent from './FundsContent';
import * as PropTypes from 'prop-types';

export default function FundsModal( props ) {
	return <div className={classNames( 'banner_modal', { 'is-visible': props.isFundsModalVisible } )}>
		<div className="banner_modal__background" onClick={props.toggleFundsModal}>
		</div>
		<div className="banner_modal__container">
			<div className="banner_modal_close">
				<button className="banner_modal_close__link" onClick={props.toggleFundsModal}>
					<img src="https://upload.wikimedia.org/wikipedia/commons/b/bf/Icon_close.svg" />
				</button>
			</div>
			<div className="banner_modal__content">
				<FundsContent {...props} />
			</div>
		</div>
	</div>;
}

FundsModal.propTypes = {
	isFundsModalVisible: PropTypes.bool.isRequired,
	toggleFundsModal: PropTypes.func.isRequired,
	/**
	 * Special handling function for "donate now" button, defaults to toggleFundsModal
	 */
	onCallToAction: PropTypes.func,
	/**
	 * Translatable contents
	 */
	useOfFundsText: PropTypes.object,
	locale: PropTypes.string
};
