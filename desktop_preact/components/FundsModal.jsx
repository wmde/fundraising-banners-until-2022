// eslint-disable-next-line no-unused-vars
import { Component, h } from 'preact';
import classNames from 'classnames';
import FundsDistributionInfo from './FundsDistributionInfo';

export default class FundsModal extends Component {
	constructor( props ) {
		super( props );
		this.locale = props.locale;
	}

	formatAmount = function ( amount ) {
		if ( this.locale === 'de' ) {
			return amount.replace( / /g, '.' );
		}
		return amount.replace( / /g, ',' );
	};
	getIntValue = function ( stringValue ) {
		return parseInt( stringValue.replace( / /g, '' ) );
	};

	render( props ) {
		return <div className={classNames( 'banner_modal', { 'is-visible': props.isFundsModalVisible } )}>
			<div className="banner_modal__background" onClick={props.toggleFundsModal}>
			</div>
			<div className="banner_modal__container">
				<div className="banner_modal_close">
					<button className="banner_modal_close__link" onClick={props.toggleFundsModal}>&#x2715;</button>
				</div>
				<div className="banner_modal__content">
					<div className="banner_modal__section">
						<div className="banner_modal__section_intro">
							<h2>Wofür wird Ihre Spende verwendet?</h2>
							<div>
								Für eine organisatorisch und technisch stets verlässliche Wikipedia, heute und in
								Zukunft. Für freien Zugang zu umfassendem, vertrauenswürdigem Wissen immer und überall.
								Also für Sie – und alle Menschen weltweit.
							</div>
						</div>
						<FundsDistributionInfo />
					</div>
					<div className="banner_modal__section" style="background:grey">Section 2 (2 cols)</div>
					<div className="banner_modal__section">Section 3</div>
				</div>
			</div>
		</div>;
	}
}
