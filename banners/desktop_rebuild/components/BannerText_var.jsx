import { h } from 'preact';
import InfoIcon from '../../../components/Icons/InfoIcon';

export default function BannerText( props ) {
	const { currentDayName, donorsNeededSentence } = props.dynamicCampaignText;

	return <div className="banner-text">
		<p>
			<strong><InfoIcon/> An alle, die Wikipedia in Deutschland nutzen </strong>
		</p>
		<p>
			Vielleicht kommen wir gerade ungelegen, aber dennoch: Klicken Sie jetzt bitte nicht weg!
			Am heutigen { currentDayName } bitten wir Sie bescheiden, die Unabhängigkeit von Wikipedia
			zu sichern. {donorsNeededSentence} Sollten Sie zu dem kleinen Kreis
			derjenigen gehören, die bereits gespendet haben, danken wir Ihnen sehr herzlich.
			Wikipedia wird durch Spenden von durchschnittlich 22,66&nbsp;€ finanziert. Doch schon mit einer
			Spende von 10&nbsp;€ kann Wikipedia sich auch in Zukunft erfolgreich
			entwickeln. <span className="text-animated-highlight">Millionen Menschen nutzen Wikipedia,
			aber 99 % spenden nicht – sie übergehen diesen Aufruf.</span> Die meisten Menschen spenden, weil
			sie Wikipedia nützlich finden. Hat Wikipedia Ihnen in diesem Jahr Wissen im Wert einer Tasse
			Kaffee geschenkt? Dann nehmen Sie sich doch bitte eine Minute Zeit und geben Sie
			etwas zurück. Vielen Dank!
			<span style="visibility:hidden;">Zeigen Sie, dass Ihnen der Zugang zu verlässlichen und neutralen Informationen wichtig ist.</span>
		</p>
	</div>;
}
