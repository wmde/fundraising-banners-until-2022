import { h } from 'preact';

export default function BannerText( props ) {
	const { currentDayName } = props.dynamicCampaignText;
	return <div className="banner-text">
		<p className="banner-text-title">
			<strong>An alle, die Wikipedia in Deutschland nutzen</strong>
		</p>
		<p>Vielleicht kommen wir gerade ungelegen, aber dennoch: Klicken Sie jetzt bitte nicht weg! Am
			heutigen { currentDayName } bitten wir Sie bescheiden, die Unabhängigkeit von Wikipedia zu
			sichern. Sollten Sie zu dem kleinen Kreis derjenigen gehören, die bereits gespendet haben,
			danken wir Ihnen sehr herzlich. Wikipedia wird durch Spenden von durchschnittlich 22,66&nbsp;€
			finanziert. Doch schon mit einer Spende von 5&nbsp;€ kann Wikipedia sich auch in Zukunft
			erfolgreich entwickeln. <strong>Millionen Menschen nutzen Wikipedia, aber 99&nbsp;% spenden
			nicht – sie übergehen diesen Aufruf.</strong> Die meisten Menschen spenden, weil sie
			Wikipedia nützlich finden. Hat Wikipedia Ihnen in diesem Jahr Wissen im Wert einer Tasse
			Kaffee geschenkt? Dann nehmen Sie sich doch bitte eine Minute Zeit und geben
			Sie etwas zurück. <em>Vielen Dank!</em>
		</p>
	</div>;
}
