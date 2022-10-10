import { h } from 'preact';

export default function SoftClose() {
	return <div className="wmde-banner-soft-close">
		<div className="wmde-banner-soft-close-progress-bar"></div>
		<div className="wmde-banner-soft-close-columns">
			<div className="wmde-banner-soft-close-column">
				Vielleicht möchten Sie Wikipedia später unterstützen?
				<button className="wmde-banner-soft-close-button">Ja</button>
				<button className="wmde-banner-soft-close-button">Erstmal nicht</button>
			</div>
			<div className="wmde-banner-soft-close-column">
				Diese Mitteilung wird automatisch in .... Sekunden ausgeblendet.
			</div>
		</div>
	</div>;
}
