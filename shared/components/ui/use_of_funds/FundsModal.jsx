// eslint-disable-next-line no-unused-vars
import { Component, h } from 'preact';
import classNames from 'classnames';
import CompanyBudgets from './CompanyBudgets';

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
						{props.children}
					</div>
					<div className="banner_modal__section banner_modal__section--two-cols">
						<div className="banner_modal__column">
							<div className="banner_modal__column_info banner_modal__column_info--benefits_list">
								Einen genauen Einblick in unsere internationalen Aktivitäten finden Sie hier:<br/>
								<a href="#" target="_blank">Jahresplan Wikimedia Foundation</a>
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
						<div className="banner_modal__column">
							<div className="banner_modal__column_info">
								Einen genauen Einblick in unsere Aktivitäten in Deutschland finden Sie hier:<br/>
								<a href="#" target="_blank">Jahresplan Wikimedia Deutschland</a>
							</div>
							<div className="banner_modal__comparison">
								<h2>Warum wir nur 9.000.000 € brauchen</h2>
								<div>
									<p>
										Unser Spendenziel von 9 Millionen € ist ein wichtiger Teil unserer für das Jahr
										2020 geplanten Gesamteinnahmen. Das ist zweifelsohne viel Geld.
									</p>

									<p>
										Berücksichtigt man allerdings, dass Wikipedia auf Platz 5 der weltweit
										meistbesuchten Webseiten steht, so relativieren sich diese Zahlen. Denn im
										Vergleich zu anderen Top-Webseiten benötigen wir ein außergewöhnlich geringes
										Budget für den laufenden Betrieb und für Investitionen in die Zukunft.
									</p>

									<p>
										Dies ist allein deshalb möglich, weil Wikipedia kein „Geschäftsmodell“ verfolgt,
										alle Beiträge in Wikipedia ehrenamtlich erstellt werden und wir weltweit nur
										rund 500 Mitarbeitende haben. Zudem sind wir gemeinnützig, das verpflichtet uns
										zu einem verantwortungsbewussten und effizienten Umgang mit den Einnahmen.
									</p>
									<p><strong>Vergleich der Jahresbudgets</strong></p>
								</div>
								<CompanyBudgets/>
							</div>
						</div>
					</div>
					<div className="banner_modal__section banner_modal__section--orgchart">
						<div className="banner_modal__orgchart_text">
							<h2>An wen gehen die Spenden für Wikipedia?</h2>
							<div>
								<p>
									Spenden aus Deutschland gehen an die {' '}<span
										className="banner_modal__org banner_modal__org--wmfg"> Wikimedia Fördergesellschaft </span>{' '} in
									Berlin. Ihr einziger Zweck ist es, Spenden für Wikipedia zu sammeln und an den {' '}<span
										className="banner_modal__org banner_modal__org--wmde">Verein Wikimedia Deutschland </span>{' '} sowie
									an die {' '}<span className="banner_modal__org banner_modal__org--wmf"> Wikimedia Foundation </span>{' '} weiterzuleiten.
								</p>

								<p>
									Die Fördergesellschaft ist eine Tochter von Wikimedia Deutschland. Ein großer
									Vorteil für Spenderinnen und Spender: Beide sind als gemeinnützig anerkannt und
									damit berechtigt, steuerabzugsfähige Spendenquittungen auszustellen.</p>

								<p>
									Die internationale Wikimedia Foundation ist eine gemeinnützige Organisation, die
									weltweit Wikipedia und damit verbundene Projekte betreibt, voranbringt und
									entwickelt.
								</p>

							</div>
						</div>
						<div className="banner_modal__orgchart_image">
							<img src="https://upload.wikimedia.org/wikipedia/commons/2/2e/WMDE-funds-forwarding.gif"/>
						</div>
					</div>
					<div className="banner_model__section banner_modal__section--call_to_action">
						<button className="banner_modal__button" onClick={props.toggleFundsModal}>Jetzt spenden</button>
					</div>
				</div>
			</div>
		</div>;
	}
}