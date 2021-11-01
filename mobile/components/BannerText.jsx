import { h } from 'preact';

export default function BannerText( props ) {
	const { currentDayName, campaignDaySentence, visitorsVsDonorsSentence, overallImpressionCount } = props.dynamicCampaignText;
	return <div className="banner-text">
		<p>
			<strong>An alle, die Wikipedia in Deutschland nutzen</strong>
		</p>
		<p>Vielleicht kommen wir gerade ungelegen, aber dennoch: Klicken Sie jetzt bitte nicht weg! { campaignDaySentence }</p>
		<p>
			Zum { overallImpressionCount } Mal seit langem möchten wir Sie an diesem { currentDayName } bescheiden darum bitten,
			die Unabhängigkeit von Wikipedia zu sichern. Insgesamt spenden 99% nichts - sie übergehen diesen Aufruf. Sollten Sie
			zu dem kleinen Kreis gehören, die bereits gespendet haben, danken wir Ihnen sehr herzlich. Wikipedia wird durch Spenden
			von durchschnittlich 21,60&nbsp;€ finanziert. Schon mit einer Spende von 5&nbsp;€ kann Wikipedia sich auch in Zukunft
			erfolgreich entwickeln. { visitorsVsDonorsSentence } Die meisten Menschen spenden, weil sie Wikipedia nützlich finden.
			Hat Wikipedia Ihnen in diesem Jahr Wissen im Wert einer Tasse Kaffee geschenkt? Dann nehmen Sie sich doch bitte eine
			Minute Zeit und geben Sie etwas zurück. <em>Vielen Dank!</em>
		</p>
	</div>;
}
