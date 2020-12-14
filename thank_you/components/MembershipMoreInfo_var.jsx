// eslint-disable-next-line no-unused-vars
import { h } from 'preact';
import ImageWithCopyright from './ImageWithCopyright';
import { integerFormatter } from '../../shared/number_formatter/de';

export default function MembershipMoreInfo( props ) {
	const numberOfDonors = integerFormatter( props.campaignParameters.donationProjection.donorsBase );

	const incentiveABTestURLParam = 'incentive=1';
	const addTrackingParams = url =>
		`${url}&piwik_campaign=${props.campaignName}&piwik_kwd=${props.bannerName}&bImpCount=
		${props.impressionCounts.bannerCount}&${incentiveABTestURLParam}`;
	const formAction = addTrackingParams( 'https://spenden.wikimedia.de/apply-for-membership?type=sustaining' );

	return <div className="more-info__wrapper">
		<div className="more-info__intro">
			<p>Herzlichen Dank – und herzliche Einladung</p>
		</div>
		<div className="more-info__text">
			<ImageWithCopyright/>
			<p>Ich bin sehr glücklich darüber, dass wir auch diesmal wieder unser Spendenziel erreichen
				konnten. Ermöglicht wurde dies von den großartigen {numberOfDonors} Menschen, die unser
				Spendenbanner nicht weggeklickt haben. Sie haben mit ihrer Unterstützung den vielen
				Ehrenamtlichen, die Wikipedia zu einer einzigartigen Wissensplattform machen, ihre
				Wertschätzung erwiesen. <strong>Dafür danke ich allen Spenderinnen und Spendern von ganzem Herzen!</strong>
			</p>

			<p>
				Am 15. Januar 2021 feiert Wikipedia ihren 20. Geburtstag. In den zwei Jahrzehnten ihres Bestehens
				hat sie sich zur größten Online-Enzyklopädie der Welt entwickelt. Aber mehr noch: Sie ist
				heute – in einem Internet, das zunehmend von Interessen und Algorithmen dominiert wird – die wichtigste
				neutrale und glaubwürdige Wissensplattform im Netz. Und zugleich ein Service, den
				die meisten als Selbstverständlichkeit betrachten.
			</p>

			<p>
				Wikipedia zählt heute zu den Top-10-Webseiten weltweit. Dabei ist sie als einzige in dieser
				Liga nicht profitorientiert und erwirtschaftet auch nicht ihre laufenden Kosten auf
				kommerzielle Weise – beispielsweise durch den Verkauf der Inhalte, durch die Nutzung
				persönlicher Daten oder durch Werbung. Es sind die Spenden ihrer Nutzerinnen und Nutzer, die
				die Zukunft von Wikipedia sichern.
			</p>

			<p>
				Hier liegt auch der Grund für meine große Erleichterung. Vom Erfolg unserer alljährlichen
				Spendenkampagne hängt letztlich alles ab. Umso wichtiger ist es, dass mehr Menschen uns regelmäßig
				unterstützen. In Deutschland engagieren sich bereits rund 80.000 Menschen mit einer
				Fördermitgliedschaft.
				<strong> Heute möchte ich Sie herzlich einladen, diesem Kreis von außergewöhnlichen
					Menschen als neues Fördermitglied beizutreten. </strong>
				Bereits mit 2 Euro im Monat sind Sie dabei.
				Als Dankeschön erhalten Sie einen exklusiven Wikipedia-Stoffbeutel.
			</p>

			<p>
				<strong>Werden Sie jetzt Fördermitglied – und machen Sie ab dem Jubiläumsjahr 2021
					mehr für Wikipedia möglich!</strong>
			</p>
		</div>

		<div className="call-to-action">
			<div className="call-to-action__item">
				<form
					method="GET"
					name="impCountForm"
					action={ formAction }
				>
					<input type="hidden" name="incentive" value="1"/>
					<input type="hidden" name="bImpCount" value={ props.impressionCounts.bannerCount }/>
					<input type="hidden" name="piwik_campaign" value={ props.campaignName }/>
					<input type="hidden" name="piwik_kwd" value={ props.bannerName }/>
					<input type="hidden" name="type" value="sustaining"/>
					<button
						onClick={ props.onSubmit }
						className="call-to-action__button">Jetzt Fördermitglied werden</button>
				</form>
			</div>
			<ul className="call-to-action__item">
				<li>Mitgliedsbeiträge sind steuerlich absetzbar</li>
				<li>Automatische Zuwendungsbescheinigung</li>
				<li>Wikipedia-Stoffbeutel als Begrüßungsgeschenk</li>
				<li>Kein Risiko: Kündigung jederzeit fristlos möglich</li>
			</ul>
		</div>
		<p>
			<a className="more-info__link"
				href={ addTrackingParams( 'https://www.wikimedia.de/mitglieder/?' ) }
				onClick={ props.onSubmit }>
				Weitere Informationen auf unserer Webseite
			</a>
		</p>
	</div>;
}
