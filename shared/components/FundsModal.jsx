// eslint-disable-next-line no-unused-vars
import { Component, h } from 'preact';
import classNames from 'classnames';

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
	showDescription = ( evt ) => {
		let targetElement = evt.target;
		if ( !targetElement.classList.contains( 'banner_modal_accordion' ) ) {
			targetElement = targetElement.parentElement;
		}
		if ( targetElement.classList.contains( 'is-active' ) ) {
			targetElement.classList.remove( 'is-active' );
		} else {
			let accordionElements = Array.from( document.querySelectorAll( '.banner_modal_accordion' ) );
			for ( let element of accordionElements ) {
				element.classList.remove( 'is-active' );
			}
			targetElement.classList.add( 'is-active' );
		}
	};

	render( props ) {
		return <div className={ classNames( 'banner_modal', { 'is-visible': props.isFundsModalVisible } ) }>
			<div className="banner_modal__background" onClick={ props.setToggleFundsModal }>
			</div>
			<div className="banner_modal__content">
				<div className="banner_modal_close">
					<button className="banner_modal_close__link" onClick={ props.setToggleFundsModal }>&#x2715;</button>
				</div>
				<div>
					<span className="banner_modal_title">Mittelverwendung</span>
					<p>
						Die Gemeinnützige Wikimedia Fördergesellschaft mbH ist Empfängerin der Spenden und
						eine 100%ige Tochtergesellschaft von Wikimedia Deutschland – Gesellschaft zur Förderung Freien Wissens e.V.
						Sie hat den Zweck, Gelder an die US-amerikanische Wikimedia Foundation zum Betrieb und Ausbau der
						Wikimedia-Projekte und für internationale Programme weiterzuleiten.
						Ebenso leitet die Fördergesellschaft Gelder an Wikimedia Deutschland weiter.
					</p>
				</div>
				<div>
					{ Object.keys( props.fundsModalData.organizations ).map( ( organizationKey ) => {
						const organization = props.fundsModalData.organizations[ organizationKey ];
						const totalAmount = this.getIntValue( organization.overallAmount );
						return <div key={ organizationKey }>
							<span className="banner_modal_section_title">{ organization.title }</span>
							<span className="banner_modal_section_subtitle">{ this.formatAmount( organization.overallAmount ) } { organization.currencySymbol }</span>
							<p>{ organization.description }</p>
							{ Object.keys( organization.funds ).map( ( fundsKey ) => {
								const fundsData = organization.funds[ fundsKey ];
								const fundsAmount = this.getIntValue( fundsData.amount );
								return <div className="banner_modal_accordion" key={ organizationKey + fundsKey } onClick={ this.showDescription }>
									<div className="banner_modal_accordion_title">{fundsData.title}</div>
									<div style={ 'width:' + ( fundsAmount / totalAmount * 100 ) + '%' } className="banner_modal_accordion_amount">
										{ this.formatAmount( fundsData.amount )} {fundsData.currencySymbol}
									</div>
									<div className="banner_modal_accordion_description">{fundsData.description}</div>
								</div>;
							} ) }
						</div>;
					} ) }
				</div>
				<div>
					{ Object.keys( props.fundsModalData.organizations ).map( ( organizationKey ) => {
						const organization = props.fundsModalData.organizations[ organizationKey ];
						return <div key={ organizationKey + '_url' } className="banner_modal_url">
							<a href={ organization.url }>Jahresplan { organization.title }</a>
						</div>;
					} ) }
				</div>
			</div>
		</div>;
	}
}
