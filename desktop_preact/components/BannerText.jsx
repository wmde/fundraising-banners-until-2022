// eslint-disable-next-line no-unused-vars
import { h } from 'preact';
import MapImage from './MapImage';

export default function BannerText() {
	return <div className="banner-text">

		<div className="banner-text-wrapper">

			<div className="banner-text-headline">
				Wikipedia braucht Deutschland!
			</div>

			<div className="banner-text-content">

				<p className="banner-text-copy">
					Die Bevölkerung Bochums schultert, rein zahlenmäßig, mit ihren Spenden den laufenden Betrieb
					von Wikipedia – stellvertretend für ganz Deutschland. Würden sich die Kosten für Infrastruktur und
					Weiterentwicklung von Wikipedia jetzt auf noch mehr Schultern verteilen, wäre es für jeden
					einzelnen leichter.
				</p>

				<p className="banner-text-copy">
					<strong> Schon der Preis einer Tasse Kaffee ist ein wirksamer Beitrag, um die Zukunft unseres weltweiten
						Projekts einer freien, unabhängigen Internet-Enzyklopädie zu sichern.</strong> Finden Sie
					Wikipedia nützlich? Dann unterstützen Sie uns bitte auch mit einer Spende. Vielen Dank!
				</p>
			</div>

		</div>

		<MapImage/>
	</div>;
}
