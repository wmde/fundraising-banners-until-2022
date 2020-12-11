// eslint-disable-next-line no-unused-vars
import { h } from 'preact';
import Slider from './Slider';
import ChevronLeftIcon from './ui/ChevronLeftIcon';
import ChevronRightIcon from './ui/ChevronRightIcon';

export default function BannerText( props ) {
	const { currentDayName, campaignDaySentence, visitorsVsDonorsSentence, onSlideChange, registerAutoplay, slideshowSlideInterval } = props;

	const Icon = <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
		<circle cx="8" cy="8" r="8" fill="#2B6DA0"/>
		<path d="M8.80003 5.73332V11.7173H10.2667V13.0667H5.96937V11.7173H7.33337V7.19999H5.8667V5.73332H8.80003ZM7.33337 2.79999H8.80003V4.26665H7.33337V2.79999Z" fill="white"/>
	</svg>;

	const slides = [
		{ content: <div>
			<p>
				<span>
					{ Icon }
					<strong> An alle unsere Leserinnen und Leser in Deutschland.  </strong>
				</span>
			</p>
			<p>
				Vielleicht kommen wir gerade ungelegen, aber dennoch: Bitte klicken
				Sie jetzt nicht weg! { campaignDaySentence } Zum ersten Mal seit langem möchten
				wir Sie an diesem { currentDayName } bescheiden darum bitten, die Unabhängigkeit
				von Wikipedia zu verteidigen. Insgesamt spenden 99% unserer Leserinnen
				und Leser nichts – sie übergehen diesen Aufruf.
			</p>
		</div> },
		{ content: <p>Sollten Sie zu dem kleinen Kreis gehören, die bereits gespendet haben, danken
				wir Ihnen sehr herzlich. Wikipedia wird durch Spenden von durchschnittlich
				22,81&nbsp;€ finanziert. Doch schon mit einer Spende von 5&nbsp;€ kann Wikipedia
				sich auch in Zukunft erfolgreich entwickeln. { visitorsVsDonorsSentence } </p> },
		{ content: <p>Die meisten Menschen spenden, weil sie Wikipedia nützlich finden. Hat Wikipedia
				Ihnen in diesem Jahr Wissen im Wert von 5&nbsp;€ geschenkt? Dann nehmen Sie sich
				doch bitte eine Minute Zeit und geben Sie etwas zurück. Zeigen Sie den
				Freiwilligen, die Ihnen verlässliche und neutrale Informationen zur Verfügung
				stellen, dass Sie ihre Arbeit wertschätzen. Vielen Dank!</p> }
	];

	return <div className="banner-text">
		<div className="banner-text-inner">
			<div className="banner-text-ctrl">
				<p>
					<span className="banner-headline">
						{ Icon }
						<strong> An alle unsere Leserinnen und Leser in Deutschland. </strong>
					</span>
					Vielleicht kommen wir gerade ungelegen, aber dennoch:
					Bitte klicken Sie jetzt nicht weg! { campaignDaySentence } Zum ersten Mal seit langem möchten wir Sie an
					diesem { currentDayName } bescheiden darum bitten, die Unabhängigkeit von Wikipedia zu verteidigen.
					Insgesamt spenden 99% unserer Leserinnen und Leser nichts – sie übergehen diesen Aufruf. Sollten
					Sie zu dem kleinen Kreis gehören, die bereits gespendet haben, danken wir Ihnen sehr herzlich.
					Wikipedia wird durch Spenden von durchschnittlich 22,81&nbsp;€ finanziert. Doch schon mit einer Spende
					von 5&nbsp;€ kann Wikipedia sich auch in Zukunft erfolgreich entwickeln. { visitorsVsDonorsSentence } Die meisten Menschen spenden,
					weil sie Wikipedia nützlich finden. Hat Wikipedia Ihnen in diesem Jahr Wissen im Wert einer Tasse Kaffee geschenkt?
					Dann nehmen Sie sich doch bitte eine Minute Zeit und geben Sie etwas zurück. <span className="optional-text text-l">Zeigen
					Sie den Freiwilligen, die Ihnen verlässliche und neutrale Informationen zur Verfügung stellen,
					dass Sie ihre Arbeit wertschätzen.</span> Vielen Dank!
				</p>
			</div>
			<div className="banner-text-var">
				<Slider
					slides={ slides }
					onSlideChange={ onSlideChange }
					registerAutoplay={ registerAutoplay }
					interval={ slideshowSlideInterval }
					previous={ <ChevronLeftIcon/> }
					next={ <ChevronRightIcon/> }
				/>
			</div>
		</div>
	</div>;
}
