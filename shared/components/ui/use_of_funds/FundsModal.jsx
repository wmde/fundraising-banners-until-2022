// eslint-disable-next-line no-unused-vars
import { Component, h } from 'preact';
import classNames from 'classnames';
import FundsContent from './FundsContent';

export default class FundsModal extends Component {

	render( props ) {
		return <div className={classNames( 'banner_modal', { 'is-visible': props.isFundsModalVisible } )}>
			<div className="banner_modal__background" onClick={props.toggleFundsModal}>
			</div>
			<div className="banner_modal__container">
				<div className="banner_modal_close">
					<button className="banner_modal_close__link" onClick={props.toggleFundsModal}>
						<img src="https://upload.wikimedia.org/wikipedia/commons/b/bf/Icon_close.svg" />
					</button>
				</div>
				<FundsContent {...props} />
			</div>
		</div>;
	}
}
