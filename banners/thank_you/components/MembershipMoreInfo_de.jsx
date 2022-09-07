import { h } from 'preact';
import ImageWithCopyright from './ImageWithCopyright';
import { integerFormatter } from '../../../shared/number_formatter/de';

export default function MembershipMoreInfo( props ) {
	const numberOfDonors = integerFormatter( props.campaignParameters.donationProjection.donorsBase );
	const MoreInfoCallToAction = props.moreInfoCallToAction;
	const addTrackingParams = url =>
		`${url}piwik_campaign=${props.campaignName}&piwik_kwd=${props.bannerName}&bImpCount=
		${props.impressionCounts.bannerCount}`;
	const formAction = 'https://spenden.wikimedia.de/apply-for-membership?';
	const formParams = {
		bImpCount: props.impressionCounts.bannerCount,
		piwik_campaign: props.campaignName,
		piwik_kwd: props.bannerName,
		type: 'sustaining'
	};

	return <div className="more-info__wrapper">
		<div className="more-info__intro">
			<p>Es ist geschafft! Aber es war wirklich knapp.</p>
		</div>
		<div className="more-info__text">
			<ImageWithCopyright/>
			<p> {numberOfDonors} großartige Menschen haben in den letzten Wochen auf unsere Spendenbitte reagiert
				und diesem Projekt ihre Wertschätzung erwiesen. <strong>Ihnen allen danke ich von ganzem Herzen! </strong>
				Doch ich bin ganz offen: Es war diesmal deutlich schwieriger als sonst. Unser Spendenziel haben wir
				erst in den letzten Tagen erreicht. Das macht mich nachdenklich.
			</p>

			<p>
				Wir erleben komplizierte Zeiten: Bald zwei Jahre Covid19-Pandemie erschöpfen mich und wohl
				viele andere auch. In Diskussionen zählen Fakten immer weniger. Zugleich schwindet das Vertrauen in
				die Orientierung gebende Kraft von Institutionen. Dieses Klima beeinflusst auch die
				Spendenbereitschaft für Wikipedia.
			</p>

			<p>
				Dabei ist Wikipedia als die größte unabhängige Wissensplattform eine der vertrauenswürdigsten
				Institutionen im Internet – gesichertem, gut belegtem Wissen verpflichtet. Zugleich ist sie ein
				offener, transparenter Debattenraum, in dem über Quellen, Darstellungen und Formulierungen diskutiert
				wird. Dass Menschen überhaupt kontrovers miteinander sprechen, ist heute wertvoller denn je.
			</p>

			<p>
				Wikipedia zählt zu den Top-10-Webseiten weltweit und ist als einzige in dieser Liga nicht profitorientiert.
				Sie ist frei von Werbung, verkauft keine persönlichen Daten – und vor allem ist ihre Nutzung kostenlos.
				Die Existenz und Zukunft von Wikipedia hängt entscheidend vom Erfolg unserer alljährlichen
				Spendenkampagne ab. Ein Erfolg, der in diesem Jahr lange nicht gesichert war!
			</p>

			<p>
				Umso wichtiger, dass noch viel mehr Menschen uns regelmäßig unterstützen. In Deutschland engagieren
				sich bisher rund 90.000 Menschen mit einer Fördermitgliedschaft und einem jährlichen Durchschnittsbeitrag
				von 52,70&nbsp;€ – noch recht wenige angesichts der Beliebtheit von Wikipedia und
				ihres Beitrags zur Allgemeinbildung. Sie können das heute ändern: Ich lade Sie herzlich ein, diesem
				Kreis von außergewöhnlichen Menschen als neues Fördermitglied beizutreten.
				Bereits mit 2 Euro im Monat sind Sie dabei. Helfen Sie, die Institution Wikipedia zu stärken und ihre
				Weiterentwicklung langfristig zu sichern.
			</p>

			<p>
				<strong>Werden Sie Fördermitglied – und unterstützen Sie Wikipedia gerade jetzt!</strong>
			</p>
		</div>

		<div className="call-to-action">
			<ul className="call-to-action__item">
				<li>Mitgliedsbeiträge sind steuerlich absetzbar</li>
				<li>Automatische Zuwendungsbescheinigung</li>
				<li>Kein Risiko: Kündigung jederzeit fristlos möglich</li>
				<li>Auf Wunsch: Unser exklusiver Wikipedia-Stoffbeutel</li>
			</ul>
			<div className="call-to-action__item">
				<MoreInfoCallToAction
					formAction={formAction}
					defaultFormParams={formParams}
					onSubmit={props.onSubmit}
				/>
			</div>
		</div>
		<p>
			<a className="more-info__link"
				href={ addTrackingParams( 'https://www.wikimedia.de/mitglieder/?' ) }>
				Weitere Informationen auf unserer Webseite
			</a>
		</p>
	</div>;
}
