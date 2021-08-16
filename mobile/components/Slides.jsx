// eslint-disable-next-line no-unused-vars
import { h } from 'preact';

export default function Slides( { campaignDaySentence, currentDayName, visitorsVsDonorsSentence } ) {

	return <div className="navigation-wrapper">
		<div className="mini-banner-carousel">
			<div className="carousel-cell keen-slider__slide">
				<p>An alle unsere Leserinnen und Leser in Deutschland. Vielleicht kommen wir gerade ungelegen,
					aber dennoch: Bitte klicken Sie jetzt nicht weg! { campaignDaySentence }</p>
			</div>
			<div className="carousel-cell keen-slider__slide">
				<p>Zum ersten Mal seit langem möchten wir Sie an diesem { currentDayName } bescheiden darum bitten,
					die Unabhängigkeit von Wikipedia zu verteidigen.</p>
			</div>
			<div className="carousel-cell keen-slider__slide">
				<p>Wikipedia wird durch Spenden von durchschnittlich 21,60&nbsp;€ finanziert.{ ' ' }
					<span className="text-highlight">{ visitorsVsDonorsSentence }</span>
				</p>
			</div>
			<div className="carousel-cell keen-slider__slide">
				<p>Insgesamt spenden 99% unserer Leserinnen und Leser nichts – sie
					übergehen diesen Aufruf. <span className="text-highlight">Doch schon mit einer
					Spende von 5&nbsp;€ kann Wikipedia sich auch in Zukunft erfolgreich entwickeln.</span>
				</p>
			</div>
			<div className="carousel-cell keen-slider__slide">
				<p>Hat Wikipedia Ihnen in diesem Jahr Wissen im Wert einer Tasse Kaffee geschenkt?
					<span className="text-highlight"> Dann nehmen Sie sich doch bitte eine Minute Zeit und geben Sie etwas zurück.</span>
				</p>
			</div>
		</div>

		<div id="dots-navigation">
		</div>

	</div>;
}
