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
					<div className="banner_modal__section banner_modal__section--two-cols">
						<div>
							<div className="banner_modal__column_info">
								Einen genauen Einblick in die internationalen Aktivitäten finden Sie hier:<br/>
								<a href="#">Jahresplan Wikimedia Foundation</a>
							</div>
							<div className="banner_modal__benefits_list">
								<h2>Was Ihre Spende bewirkt</h2>
								<ul className="banner_modal__icon-list">
									<li className='banner_modal__icon-list_item--hand'>
										Ihre Spende ist ein wichtiger Beitrag, um allen Menschen überall auf der Welt
										und zu jedem Zeitpunkt freien Zugang zu Wissen zu ermöglichen.
									</li>

									<li className='banner_modal__icon-list_item--smartphone'>
										Ihre Spende trägt dazu bei, die sichere, stabile Infrastruktur und einfache
										Bedienbarkeit von Wikipedia auch in Zukunft zu erhalten.
									</li>

									<li className='banner_modal__icon-list_item--world'>
										Ihre Spende unterstützt unsere Bemühungen, weltweit die Bildung regionaler
										Wikipedia-Communities zu fördern.
									</li>

									<li className='banner_modal__icon-list_item--megaphone'>
										Ihre Spende ist die wichtigste Einnahmequelle, die wir haben. Sie stellt sicher,
										dass Wikipedia auch weiterhin von Werbung, kommerziellen Interessen oder
										Drittmitteln unabhängig bleibt.
									</li>

									<li className='banner_modal__icon-list_item--twentyfourseven'>
										Ihre Spende ist nicht zuletzt der Beitrag, den Sie leisten, damit Wikipedia
										immer und überall für Sie persönlich da ist und in einzigartiger Breite Ihre
										Fragen beantworten kann.
									</li>
								</ul>
							</div>
						</div>
						<div>
							<div className="banner_modal__column_info">
								Einen genauen Einblick in die Aktivitäten in Deutschland finden Sie hier:<br/>
								<a href="#">Jahresplan Wikimedia Deutschland</a>
							</div>

						</div>
					</div>
					<div className="banner_modal__section">
						<h2>An wen gehen die Spenden für Wikipedia</h2>
						<div>TODO</div>
					</div>
				</div>
			</div>
		</div>;
	}
}
