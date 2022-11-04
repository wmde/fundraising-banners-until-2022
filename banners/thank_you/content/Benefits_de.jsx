import { h } from 'preact';
import CheckCircle from '../../../components/Icons/CheckCircle';

export default function Benefits() {
	return <ul className="wmde-banner-benefits">
		<li><CheckCircle/> Mitgliedsbeiträge sind steuerlich absetzbar</li>
		<li><CheckCircle/> Automatische Zuwendungsbescheinigung</li>
		<li><CheckCircle/> Kein Risiko: Kündigung jederzeit fristlos möglich</li>
		<li><CheckCircle/> Auf Wunsch: Unser exklusiver Wikipedia-Stoffbeutel</li>
	</ul>;
}
