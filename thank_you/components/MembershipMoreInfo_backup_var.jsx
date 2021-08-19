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
			<p>Ich möchte mich von ganzem Herzen bei den wunderbaren {numberOfDonors} Menschen bedanken, die in den
				vergangenen Wochen gespendet haben. Mit ihrer Hilfe konnten wir unser Spendenziel erreichen. Sie
				haben unseren Spendenaufruf nicht ignoriert und gezeigt, dass ihnen Wikipedia eine Spende wert
				ist. Das macht diese Menschen für uns ganz besonders.
				Wikipedias Unabhängigkeit wird durch Spenden ermöglicht. Es gibt darüber hinaus einen kleinen
				Kreis von derzeit rund 80.000 Menschen in Deutschland, die das Projekt nachhaltig mit einer
				Mitgliedschaft unterstützen. Zusammen können wir
			</p>

			<ul className="more-info__list">
				<li>die Freiwilligen bestmöglich unterstützen.</li>
				<li>die technische Infrastruktur sichern und optimieren.</li>
				<li>die rechtlichen Rahmenbedingungen für Wikipedia verbessern.</li>
			</ul>

			<p>
				Damit wir den freien Zugang zu Wissen dauerhaft etablieren können, müssen wir Menschen wie Sie von
				einer regelmäßigen Förderung Wikipedias überzeugen. Die Fördermitgliedschaft ist Ihre Möglichkeit,
				Wikipedia langfristig zu sichern. Sie erhalten dabei Zugang zu der Welt hinter Wikipedia: Einblicke
				in die Arbeit der Freiwilligen, Einladungen zu regionalen Veranstaltungen und
				Hintergrundinformationen, warum wir mit Museen zusammenarbeiten oder wir fordern, dass öffentlich
				finanzierte Publikationen für Wikipedia nutzbar sein müssen.
				Schon 2 Euro monatlich – der Preis eines Kaffees – ermöglichen uns, Wikipedias Erfolgsgeschichte
				fortzuführen. Sie sehen: Ein kleiner Beitrag kann so viel bewirken. Daher meine Bitte an Sie: Fördern
				Sie Wikipedia ab jetzt regelmäßig. Als Dankeschön erhalten Sie auf Wunsch einen Stoffbeutel mit dem
				markanten Wikipedia-Logo, damit Sie Ihre Begeisterung für Wissen auch nach außen tragen können.
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
