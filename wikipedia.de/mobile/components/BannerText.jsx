import { h } from 'preact';

export default function BannerText( props ) {
	const { currentDayName, campaignDaySentence, visitorsVsDonorsSentence, overallImpressionCount } = props;
	return <div className="banner-text">
		<p className="text__headline">
			An alle, die Wikipedia in Deutschland nutzen
		</p>
		<p>
			Vielleicht kommen wir gerade ungelegen, aber dennoch: Klicken Sie jetzt bitte nicht
			weg! { campaignDaySentence } Dies ist der { overallImpressionCount }. Spendenaufruf,
			den wir Ihnen zeigen. Am heutigen { currentDayName } bitten wir Sie bescheiden,
			die Unabhängigkeit von Wikipedia zu sichern. Insgesamt
			spenden 99% nichts - sie übergehen diesen Aufruf. Sollten Sie zu dem kleinen
			Kreis gehören, die bereits gespendet haben, danken wir Ihnen sehr herzlich.

			Wikipedia wird durch Spenden von durchschnittlich 22,81&nbsp;€ finanziert.
			Schon mit einer Spende von 5&nbsp;€ kann Wikipedia sich auch in Zukunft erfolgreich entwickeln.

			{' '}<strong>{ visitorsVsDonorsSentence }</strong> Die meisten Menschen spenden, weil Sie Wikipedia
			nützlich finden. Hat Wikipedia Ihnen in diesem Jahr Wissen im Wert einer Tasse Kaffee geschenkt?
			Dann nehmen Sie sich doch bitte eine Minute Zeit und geben Sie etwas zurück. Vielen Dank.
		</p>
	</div>;
}
