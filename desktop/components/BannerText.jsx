// eslint-disable-next-line no-unused-vars
import { h } from 'preact';

export default function BannerText( props ) {
	const { currentDayName, campaignDaySentence, visitorsVsDonorsSentence } = props;

	return <div className="banner-text">
		<p>
			<span className="banner-headline">
				<img className="info-icon" height="16" width="16" src="https://upload.wikimedia.org/wikipedia/commons/9/93/Info-icon-black-on-yellow.svg" alt="info_icon" />
				<strong> An alle unsere Leserinnen und Leser in Deutschland. </strong>
			</span>
			Vielleicht kommen wir gerade ungelegen, aber dennoch:
			Bitte klicken Sie jetzt nicht weg! { campaignDaySentence } Zum ersten Mal seit langem möchten wir Sie an
			diesem { currentDayName } bescheiden darum bitten, die Unabhängigkeit von Wikipedia zu verteidigen.
			Insgesamt spenden 99% unserer Leserinnen und Leser nichts – sie übergehen diesen Aufruf. Sollten
			Sie zu dem kleinen Kreis gehören, die bereits gespendet haben, danken wir Ihnen sehr herzlich.
			Wikipedia wird durch Spenden von durchschnittlich 22,81&nbsp;€ finanziert. Doch schon mit einer Spende
			von 5&nbsp;€ kann Wikipedia sich auch in Zukunft erfolgreich entwickeln. { visitorsVsDonorsSentence } Die meisten Menschen spenden,
			weil sie Wikipedia nützlich finden. Hat Wikipedia Ihnen in diesem Jahr Wissen im Wert von 5&nbsp;€ geschenkt?
			Dann nehmen Sie sich doch bitte eine Minute Zeit und geben Sie etwas zurück. <span className="optional-text text-m">Zeigen
			Sie den Freiwilligen, die Ihnen verlässliche und neutrale Informationen zur Verfügung stellen,
			dass Sie ihre Arbeit wertschätzen.</span> Vielen Dank!
		</p>
	</div>;
}
