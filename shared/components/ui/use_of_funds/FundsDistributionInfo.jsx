// eslint-disable-next-line no-unused-vars
import { Component, h } from 'preact';
import classNames from 'classnames';

const applicationOfFundsDistribution = [
	{
		id: 'software',
		title: 'Software',
		percentage: 20
	},
	{
		id: 'international',
		title: 'International und Technik',
		percentage: 20
	},
	{
		id: 'communities',
		title: 'Communities',
		percentage: 10
	},
	{
		id: 'society',
		title: 'Gesellschaftliches',
		percentage: 15
	},
	{
		id: 'operative',
		title: 'Operative Kosten',
		percentage: 35
	}
];

export default class FundsDistributionInfo extends Component {
	constructor( props ) {
		super( props );
		this.state = {
			activeInfo: 'communities'
		};
	}

	setActive = ( evt ) => {
		const matched = evt.target.className.match( /funds_distribution_info_item--(\w+)/ );
		if ( matched ) {
			this.setState( { activeInfo: matched[ 1 ] } );
		}
	};

	render( props, state ) {
		const isActive = name => state.activeInfo === name;
		return <div className="funds_distribution_info">

			<div className="funds_distribution_info__graph">
				{applicationOfFundsDistribution.map( fundsItem => <div
					className={classNames(
						'funds_distribution_info_item',
						'funds_distribution_info_item--' + fundsItem.id,
						{ active: isActive( fundsItem.id ) }
					)}
					key={fundsItem.id}
					onMouseEnter={this.setActive}
					style={
						{
							width: fundsItem.percentage + '%',
							flexBase: fundsItem.percentage + '%'
						}}>
					<div className="funds_distribution_info_item__title">{fundsItem.title}</div>
					<div className="funds_distribution_info_item__box">{fundsItem.percentage}%</div>
				</div> )}
			</div>

			<div className={classNames( 'funds_distribution_info__text', { active: isActive( 'software' ) } ) }>
				Aktuelle Daten der Welt sind das Rückgrat von Wikipedia & Co. Damit alle Wikipedia-Sprachversionen
				einfach auf einen gemeinsamen Datenpool zugreifen können, entwickeln unsere Softwareentwicklerinnen
				und -entwickler in Deutschland und weltweit eine sichere und verlässliche technische Infrastruktur.
				Damit wird die Ergänzung und Aktualisierung von Wikipedia-Artikeln mit neuesten Daten enorm erleichtert.
			</div>

			<div className={classNames( 'funds_distribution_info__text', { active: isActive( 'international' ) } ) }>
				Wikipedia ist ein globales Projekt. Deshalb leisten wir einen substanziellen Beitrag zur Finanzierung
				der internationalen Aktivitäten für die Weiterentwicklung von Wikipedia. Zudem finanzieren wir auf diese
				Weise die globale Server-Infrastruktur mit, auf der alle Wikimedia-Projekte – also auch die
				deutschsprachige Wikipedia – laufen.
			</div>

			<div className={classNames( 'funds_distribution_info__text', { active: isActive( 'communities' ) } ) }>
					Indem wir die ehrenamtlichen Autorinnen und Autoren bei ihrer Arbeit unterstützen, bestärken wir sie in
					ihrem Engagement für Wikipedia. Deshalb pflegen wir z. B. eine „technische Wunschliste“ für die stetige
					Verbesserung unserer Software, fördern die Einrichtung lokaler Wikipedia-Standorte, finanzieren digitale
					Zugänge zu Fachzeitschriften und helfen bei der Durchführung von Veranstaltungen.
			</div>

			<div className={classNames( 'funds_distribution_info__text', { active: isActive( 'society' ) } ) }>
					Durch unser zivilgesellschaftliches Engagement auf EU-und Bundesebene sowie unsere Zusammenarbeit mit
					Kultur-, Bildungs- und Wissenschaftsinstitutionen machen wir mehr Inhalte für die Wikimedia-Projekte
					frei verfügbar – und heben auf diese Weise viele unerschlossene Schätze.
			</div>

			<div className={classNames( 'funds_distribution_info__text', { active: isActive( 'operative' ) } ) }>
					Die Mitarbeitenden in unserer Geschäftsstelle in Berlin stellen sicher, dass unsere organisatorischen
					und finanziellen Prozesse zuverlässig funktionieren. Sie sorgen z. B. dafür, dass unsere Projekte in der
					Öffentlichkeit bekannter werden. Und sie kümmern sich um die Bearbeitung der eingehenden Spenden
					einschließlich dem Versand der Spendenbescheinigungen.
			</div>

		</div>;
	}
}
