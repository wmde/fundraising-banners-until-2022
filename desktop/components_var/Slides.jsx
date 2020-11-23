// eslint-disable-next-line no-unused-vars
import { h } from 'preact';

export default function Slides( { campaignDaySentence, visitorsVsDonorsSentence } ) {
	return <div className="mini-banner-carousel banner-carousel">
		<div className="carousel-cell">
			<p className="headline">An alle unsere Leserinnen und Leser in Deutschland.</p>
			<p>Vielleicht kommen wir gerade ungelegen. Aber dennoch: Bitte klicken Sie jetzt nicht weg!</p>
		</div>
		<div className="carousel-cell">
			<p className="headline">{ campaignDaySentence }</p>
			<p>Zum ersten Mal seit langem möchten wir Sie an diesem Donnerstag bescheiden darum bitten,
				die Unabhängigkeit von Wikipedia zu verteidigen.</p>
		</div>
		<div className="carousel-cell">
			<p className="headline">Wikipedia wird durch Spenden finanziert.</p>
			<p>Die durchschnittliche Spende beträgt 22,81 €. Doch schon mit einer Spende von 5 € kann
				Wikipedia sich auch in Zukunft erfolgreich entwickeln.</p>
		</div>
		<div className="carousel-cell">
			<p className="headline">99% unserer Leserinnen und Leser spenden nichts.</p>
			<p>Sie übergehen diesen Aufruf. { visitorsVsDonorsSentence }</p>
		</div>
		<div className="carousel-cell">
			<p className="headline">Die meisten spenden, weil sie Wikipedia nützlich finden.</p>
			<p>Hat Wikipedia Ihnen in diesem Jahr Wissen im Wert von 5 € geschenkt? Dann nehmen Sie sich
				doch bitte eine Minute Zeit und geben Sie etwas zurück. Vielen Dank!</p>
		</div>
	</div>;
}
