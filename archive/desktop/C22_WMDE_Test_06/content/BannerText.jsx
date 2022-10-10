import { h } from 'preact';
import InfoIcon from '../../../components/Icons/InfoIcon';

export default function BannerText( props ) {
	const { currentDayName } = props.dynamicCampaignText;

	return <div>
		<p>
			<strong><InfoIcon/> An alle, die Wikipedia in Deutschland nutzen </strong>
		</p>
		<p>
			Vielleicht kommen wir gerade ungelegen, aber dennoch: Klicken Sie jetzt bitte nicht weg!
			Am heutigen { currentDayName } bitten wir Sie bescheiden, die Unabhängigkeit von Wikipedia
			zu sichern. Wikipedia wird durch Spenden von
			durchschnittlich 22,66&nbsp;€ finanziert. Doch schon mit einer
			Spende von 5&nbsp;€ kann Wikipedia sich auch in Zukunft erfolgreich
			entwickeln. <span className="wmde-banner-text-animated-highlight">Millionen Menschen nutzen Wikipedia,
			aber 99 % spenden nicht – sie übergehen diesen Aufruf.</span> Die meisten Menschen spenden, weil
			sie Wikipedia nützlich finden. Hat Wikipedia Ihnen in diesem Jahr Wissen im Wert einer Tasse
			Kaffee geschenkt? Dann nehmen Sie sich doch bitte eine Minute Zeit und geben Sie
			etwas zurück. Vielen Dank!
		</p>
	</div>;
}
