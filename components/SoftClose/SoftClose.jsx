import { h } from 'preact';

export default function SoftClose() {
	return <div className="wmde-banner-soft-close">
		<div className="wmde-banner-soft-close-progress-bar"></div>
		<div className="wmde-banner-soft-close-columns">
			<div className="wmde-banner-soft-close-column">
				<span className="wmde-banner-soft-close-prompt">Vielleicht möchten Sie Wikipedia später unterstützen?</span>
				<button className="wmde-banner-soft-close-button">Ja</button>
				<button className="wmde-banner-soft-close-button">Erstmal nicht</button>
			</div>
			<div className="wmde-banner-soft-close-column wmde-banner-soft-close-countdown-text">
				Diese Mitteilung wird automatisch in <strong> .... Sekunden</strong> ausgeblendet.
			</div>
		</div>
	</div>;
}
