import { h } from 'preact';
import ImageWithCopyright from '../components/ImageWithCopyright';
import { integerFormatter } from '../../../shared/number_formatter/de';

export default function BannerText( { donorsBase } ) {
	const numberOfDonors = integerFormatter( donorsBase );

	return <div>
		<ImageWithCopyright/>
		<p><strong>Vielen Dank! Zum Glück haben wir es trotz der aktuellen Krisen wieder geschafft.</strong></p>
		<p> Rund { numberOfDonors } großartige Menschen haben in den letzten 57 Tagen auf unsere Spendenbitte reagiert
			und diesem Projekt ihre Wertschätzung erwiesen. Wir wissen das in diesen Zeiten ganz besonders zu schätzen:
			Energiepreise, die durch die Decke gehen, eine zweistellige Inflation und die Wirtschaft auf Talfahrt – das
			macht uns allen zu schaffen. Und dennoch konnten wir unser Spendenziel wieder erreichen. <strong>Dafür
				danken wir Ihnen allen von ganzem Herzen!</strong>
		</p>

		<p>
			Wie so viele Menschen empfinden auch wir die Welt heute als unübersichtlicher denn je. Ob Covid-Pandemie,
			globale Wirtschaftsprobleme oder die angespannte weltpolitische Lage: Die Komplexität der Entwicklungen
			überfordert uns oft. Wie gut, dass Wikipedia uns zu allen Themen gesichertes, neutrales und gut belegtes
			Wissen bietet – kostenlos und werbefrei, auf wohltuend nüchterne und ruhige Art und Weise. Sie ist der
			Fels in der Brandung von Fake-News, Propaganda und interessengeleiteter (Des-)Information.
		</p>

		<p>
			Allerdings steht die Unabhängigkeit der Wikipedia zunehmend unter Druck. Zum Beispiel indem Staaten
			versuchen, unliebsame Fakten zu zensieren – so wie gerade im Fall der russischsprachigen Wikipedia im
			Zusammenhang mit dem Angriffskrieg Russlands auf die Ukraine. Aber auch hierzulande wird immer wieder
			versucht, juristisch Druck auf Ehrenamtliche auszuüben, wenn sie unter Klarnamen in der Wikipedia schreiben
			oder indem ihr selbstgewählter Username attackiert wird.
		</p>

		<p>
			Als globale Gemeinschaft verteidigen wir Wikipedia und ihre Freiwilligen gegen solche Angriffe – mit allen
			uns zur Verfügung stehenden Mitteln. Dafür sind wir auf regelmäßige Unterstützung angewiesen, gerade in
			diesen unsicheren Krisenzeiten. Bisher engagieren sich in Deutschland rund 102.000 Menschen mit einer
			Fördermitgliedschaft und einem jährlichen Durchschnittsbeitrag von 55&nbsp;€ – noch recht wenige angesichts der
			Beliebtheit von Wikipedia und ihres Beitrags zur Allgemeinbildung.
		</p>

		<p>
			Sie können das heute ändern: <strong>Wir laden Sie herzlich ein, diesem Kreis von außergewöhnlichen
			Menschen als neues Fördermitglied beizutreten.</strong> Bereits mit 2 Euro im Monat sind Sie dabei. Helfen
			Sie, die Unabhängigkeit der Wikipedia zu stärken und ihre Weiterentwicklung langfristig zu sichern.
		</p>

		<p>
			<strong>Werden Sie Fördermitglied und unterstützen Sie Wikipedia – gerade jetzt!</strong>
		</p>
	</div>;
}
