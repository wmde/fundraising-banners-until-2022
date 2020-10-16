// eslint-disable-next-line no-unused-vars
import { h } from 'preact';

export default function Slides( { currentDayName } ) {
	return <div className="mini-banner-carousel">
		<div className="carousel-cell">
			<p>Liebe Leserinnen und Leser:</p>
			<p>Millionen Menschen nutzen Wikipedia, aber 99 % der Leserinnen und Leser spenden nicht. Wenn alle, die das
				jetzt lesen, einen kleinen Beitrag leisten, wäre unsere Spendenkampagne am
				heutigen { currentDayName } vorbei.</p>
		</div>
		<div className="carousel-cell">
			<p>An diesem { currentDayName } sind Sie in Deutschland gefragt. Schon der Preis
				einer Tasse Kaffee würde genügen.</p>
		</div>
		<div className="carousel-cell">
			<p>Es ist leicht, diese Nachricht zu ignorieren und die meisten werden das wohl tun. Dabei ist
				Spenden mit dem Handy ganz einfach.</p>
		</div>
		<div className="carousel-cell">
			<p>Wenn Sie Wikipedia nützlich finden, nehmen Sie sich an diesem { currentDayName } bitte
				eine Minute Zeit und geben Wikipedia mit Ihrer Spende etwas zurück.</p>
		</div>
	</div>;
}
