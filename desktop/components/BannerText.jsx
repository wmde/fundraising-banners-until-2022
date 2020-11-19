// eslint-disable-next-line no-unused-vars
import { h } from 'preact';

export default function BannerText( props ) {
	const { currentDayName, campaignDaySentence, visitorsVsDonorsSentence, numberOfDonors, millionImpressionsPerDay } = props;

	return <div className="banner-text">

		<div className="banner-text-inner">

			<div className="banner-text-ctrl">
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
					von 5&nbsp;€ kann Wikipedia sich auch in Zukunft erfolgreich entwickeln. { visitorsVsDonorsSentence} Die meisten Menschen spenden,
					weil sie Wikipedia nützlich finden. Hat Wikipedia Ihnen in diesem Jahr Wissen im Wert von 5&nbsp;€ geschenkt?
					Dann nehmen Sie sich doch bitte eine Minute Zeit und geben Sie etwas zurück. <span className="optional-text text-m">Zeigen
					Sie den Freiwilligen, die Ihnen verlässliche und neutrale Informationen zur Verfügung stellen,
					dass Sie ihre Arbeit wertschätzen.</span> Vielen Dank!
				</p>
			</div>

			<div className="banner-text-var">
				<p>
					<span className="banner-headline">
						<img className="info-icon" height="16" width="16" src="https://upload.wikimedia.org/wikipedia/commons/9/93/Info-icon-black-on-yellow.svg" alt="info_icon" />
						<strong> Liebe Leserin, lieber Leser in Deutschland, </strong>
					</span>
					die finanzielle Zukunft von Wikipedia hängt von Ihrer Spende ab. Dennoch übersehen mehr als 99&nbsp;% der Nutzerinnen und
					Nutzer unseren Spendenaufruf. Und auch wenn bis heute { numberOfDonors } Menschen gespendet haben, so sind das noch
					sehr wenige, wenn man bedenkt, dass unser Aufruf jeden Tag { millionImpressionsPerDay } Millionen Mal gezeigt wird.
					Würden von allen, die das jetzt lesen, mehr als die üblichen 1&nbsp;% einen kleinen Beitrag leisten, wäre unser Spendenziel
					bereits am heutigen Dienstag erreicht. Im Schnitt geben die Menschen 22,81&nbsp;€, doch schon der Preis einer Tasse Kaffee
					ist ein wirksamer Beitrag. Würde sich Wikipedia statt durch Spenden mittels Werbung finanzieren, wäre sie nicht unabhängig
					und wir könnten ihr nicht vertrauen. Doch obwohl die meisten das nicht wollen, spenden sie nicht. Deshalb sind an
					diesem { currentDayName } Sie gefragt! Wenn Sie Wikipedia nützlich finden, dann treten Sie bitte aus dem Schatten der
					99&nbsp;% heraus und geben Wikipedia mit Ihrer Spende etwas zurück. Vielen Dank!
				</p>
			</div>

		</div>

	</div>;
}
