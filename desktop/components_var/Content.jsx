// eslint-disable-next-line no-unused-vars
import { h } from 'preact';
import Rocket from './images/Rocket';
import Lightbulb from './images/Lightbulb';
import Hand from './images/Hand';
import Bubble from './images/Bubble';

export const PAGE_1 = {
	image: Rocket,
	heading: <div>Super, Sie gehören dem exklusiven Kreis der <strong>Wissenshungrigen</strong> an, für die Wikipedia ein unverzichtbarer Teil ihres Lebens ist.</div>,
	content: <div>
		<p>Wikipedia ist für Sie so selbstverständlich wie Strom aus der Steckdose und fließend Wasser.</p>
		<p>Möchten Sie Wikipedia für ihre treuen Dienste mit einer Spende etwas zurückgeben?</p>
	</div>
};

export const PAGE_2 = {
	image: Lightbulb,
	heading: <div>Toll, Sie gehören zur großen Gemeinschaft der <strong>Kernnutzer*innen</strong>, die Wikipedia zu einer der Top-5-Webseiten weltweit machen. Danke!</div>,
	content: <div>
		<p>Sie bauen darauf, dass Wikipedia immer und überall mit verlässlichem Wissen für Sie da ist.</p>
		<p>Dieser zuverlässige Service sollte Ihnen doch eine Spende für Wikipedia wert sein.</p>
	</div>
};

export const PAGE_3 = {
	image: Bubble,
	heading: <div>Sie gehören der großen Gruppe der <strong>Pragmatiker*innen</strong> an, die in Wikipedia bei
		Fragen ganz gezielt suchen – und in der Regel auch finden, was sie brauchen.</div>,
	content: <div>
		<p>Im Fall der Fälle können Sie sich stets auf Wikipedia verlassen. Toll, diese Sicherheit zu haben, nicht wahr?</p>
		<p>Das könnte Ihnen doch auch eine Spende für Wikipedia wert sein.</p>
	</div>
};

export const PAGE_4 = {
	image: Hand,
	heading: <div>Sie gehören zum kleinen Kreis der <strong>Minimalist*innen</strong>, die Wikipedia beinahe nie nutzen.</div>,
	content: <div>
		<p>Glückwunsch, offenbar brauchen Sie Wikipedia kaum! Anders als die meisten Menschen.</p>
		<p>Vielleicht möchten Sie mit einer Spende den freien Zugang zu Wissen sichern – den viele andere eher benötigen als Sie.</p>
	</div>
};
