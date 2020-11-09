// eslint-disable-next-line no-unused-vars
import { h } from 'preact';

export default function BannerText( props ) {
	const { currentDayName, campaignDaySentence, overallImpressionCount, visitorsVsDonorsSentence } = props;

	const firstImpressionSentence = <span>Zum ersten Mal seit langem möchten wir Sie an diesem { currentDayName } bescheiden
		darum bitten, die Unabhängigkeit von Wikipedia zu verteidigen.</span>;
	const subsequentImpressionSentence = <span>Dies ist der { overallImpressionCount }. Spendenaufruf, den wir Ihnen zeigen.
		Am heutigen { currentDayName } bitten wir Sie bescheiden, die Unabhängigkeit von Wikipedia zu verteidigen.</span>;

	return <div className="banner-text">

		<div className="banner-text-inner">

			<div className="banner-text-ctrl">
				<p>
					<span className="banner-headline">
						<img className="info-icon" height="16" width="16" src="https://upload.wikimedia.org/wikipedia/commons/9/93/Info-icon-black-on-yellow.svg" alt="info_icon" />
						<strong> An alle unsere Leserinnen und Leser in Deutschland. </strong>
					</span>
					Vielleicht kommen wir gerade ungelegen, aber dennoch:
					Bitte klicken Sie jetzt nicht weg! { campaignDaySentence }{ ' ' }

					{ overallImpressionCount <= 1 ? firstImpressionSentence : subsequentImpressionSentence }{ ' ' }

					Insgesamt spenden 99% unserer Leserinnen und Leser nichts – sie übergehen diesen Aufruf. Sollten
					Sie zu dem kleinen Kreis gehören, die bereits gespendet haben, danken wir Ihnen sehr herzlich.
					Wikipedia wird durch Spenden von durchschnittlich 22,81 € finanziert. Doch schon mit einer Spende
					von 5 € kann Wikipedia sich auch in Zukunft erfolgreich entwickeln. { visitorsVsDonorsSentence } Die meisten Menschen spenden,
					weil Sie Wikipedia nützlich finden. Hat Wikipedia Ihnen in diesem Jahr Wissen im Wert von 5 €
					geschenkt? Dann nehmen Sie sich doch bitte eine Minute Zeit und geben Sie etwas zurück. <span className="optional-text text-l">Zeigen
					Sie den Freiwilligen, die Ihnen verlässliche und neutrale Informationen zur Verfügung stellen,
					dass Sie ihre Arbeit wertschätzen. </span>Vielen Dank!
				</p>
			</div>

			<div className="banner-text-var"></div>

		</div>

	</div>;
}
