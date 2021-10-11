import { h } from 'preact';
import { slideOneContent, slideThreeContent, slideTwoContent } from './ModalContent';

export default function Slides( currentDayName, showModal ) {
	return [
		{
			content: <div className="carousel-cell-first">
				<p>Haben Sie heute gefunden, wonach Sie gesucht haben?</p>
				<p>
					<button onClick={ () => showModal( slideOneContent ) }>Warum fragen wir das?</button>
				</p>
			</div>
		},
		{
			content: <div>
				<p>Dass Wikipedia immer für Sie da ist, kostet jedes Jahr viel Geld. Nur durch Spenden kann
					dieser Service gesichert werden.</p>
				<p>
					<button onClick={ () => showModal( slideTwoContent ) }>Wofür wird das Geld gebraucht?</button>
				</p>
			</div>
		},
		{
			content: <div>
				<p>Millionen Menschen nutzen Wikipedia, aber 99&nbsp;% der Leserinnen und Leser spenden nicht.</p>
				<p>
					<button onClick={ () => showModal( slideThreeContent ) }>Was kann meine Spende beitragen?</button>
				</p>
			</div>
		},
		{
			content: <div>
				<p>Würden alle, die das jetzt lesen, nur den Wert einer Tasse Kaffee spenden, wäre unser Spendenziel
					bereits am heutigen Mittwoch erreicht. Jeder Beitrag zählt. Vielen Dank!</p>
			</div>
		}
	];
}
