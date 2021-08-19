import { h } from 'preact';
import ImageWithCopyright from './ImageWithCopyright';

function ShowSteps() {
	return <div>
		<p><strong>Mitmachen ist ganz einfach:</strong></p>

		<p>Schritt 1: Legen Sie ein Benutzerkonto in Wikipedia an.<br/>
			Schritt 2: Lernen Sie, worauf es beim Editieren in Wikipedia ankommt.<br/>
			Schritt 3: Finden Sie Hilfe und lernen Sie die Gemeinschaft hinter dem Projekt kennen.</p>
	</div>;
}

export default function AuthorsMoreInfo( props ) {
	const addTrackingParams = ( url, thxSuffix = '' ) => `${url}&campaign=${props.bannerName.replace( /_thx/, '_thx' + thxSuffix )}`;

	return <div className="more-info__wrapper">
		<div className="more-info__intro">
			<p>Herzlichen Dank!</p>
		</div>
		<div className="more-info__text">
			<ImageWithCopyright/>
			<p>Ich möchte mich von ganzem Herzen bei den wunderbaren {props.numberOfDonors} Menschen bedanken, die in
				den vergangenen Wochen gespendet haben. Mit ihrer Hilfe konnten wir unser Spendenziel erreichen.
				Sie haben unseren Spendenaufruf nicht ignoriert und gezeigt, dass ihnen Wikipedia eine Spende wert ist.
				Das macht diese Menschen für uns ganz besonders.</p>

			<p>Wussten Sie, dass der Schritt vom Lesen zum Schreiben in der Wikipedia gar nicht groß ist?
				Alle können sich beteiligen. Daher meine Bitte an Sie: {' '}
			<a className="more-info__link"
				href={addTrackingParams( 'https://de.wikipedia.org/wiki/Wikipedia:Wikimedia_Deutschland/LerneWikipedia?', '_link' )}>Setzen
					Sie sich für die bekannteste Online-Enzyklopädie der Welt ein, indem Sie Wikipedia aktiv mitgestalten.</a></p>

			{props.showSteps && <ShowSteps/>}

			<p>Korrigieren Sie am Anfang Tippfehler oder falsch gesetzte Satzzeichen. Im Anschluss erstellen Sie mit ein
				wenig Übung und im engen Austausch mit erfahrenen Freiwilligen vielleicht sogar eigene Artikel.
			{' '}<strong>Davon profitieren alle</strong>{' '} – und natürlich auch Sie selbst:
				Als Teil einer engagierten Gemeinschaft verbessern Sie den Zugang zu Wissen und sichern so Wikipedias Zukunft.</p>

			<p><strong>Bilder hochladen, Grammatik verbessern, Rechtschreibfehler korrigieren:</strong>{' '}
				Jeder Beitrag bringt unser gemeinsames Projekt weiter. Und wenn viele Menschen mitmachen, bleibt Wikipedia aktuell und relevant.
				Bringen Sie sich ein und sichern Sie so das Fortbestehen der bekanntesten Online-Enzyklopädie der Welt.</p>

			<p>Probieren Sie es doch einfach aus – werden Sie Wikipedia-Autorin oder -Autor.</p>
		</div>

		<a href={ addTrackingParams( 'https://de.wikipedia.org/wiki/Wikipedia:Wikimedia_Deutschland/LerneWikipedia?' ) }
			className="call-to-action__button">Jetzt ausprobieren</a>

	</div>;
}
