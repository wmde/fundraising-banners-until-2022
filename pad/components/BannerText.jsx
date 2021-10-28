import { h } from 'preact';
import { capitalizeFirstLetter } from '../../shared/capitalize_first_letter';
import ChevronLeftIcon from './ui/ChevronLeftIcon';
import ChevronRightIcon from './ui/ChevronRightIcon';

export default function BannerText( props ) {
	const { weekdayPrepPhrase, currentDayName, campaignDaySentence, visitorsVsDonorsSentence, bannerSliderNext, bannerSliderPrevious } = props;

	return <div className="banner-text">
		<a href="#" className="banner-slider-previous" onClick={ bannerSliderPrevious }><ChevronLeftIcon/></a>

		<div className="navigation-wrapper">
			<div className="mini-banner-carousel">
				<div className="carousel-cell keen-slider__slide">
					<p>
						<img className="info-icon" src="https://upload.wikimedia.org/wikipedia/donate/9/99/RedInfoI.svg" alt="info_icon" width="16" height="16" />
						<span className="text__headline--italic"> Liebe Leserinnen und Leser, </span>
						<span>verzeihen Sie die Störung. Es ist ein bisschen unangenehm, daher kommen wir gleich zur Sache.
							<span> { capitalizeFirstLetter( weekdayPrepPhrase ) } { currentDayName } sind Sie in Deutschland gefragt: </span>
						</span>
						{ campaignDaySentence } Wikipedia wird durch Spenden von durchschnittlich 22,81&nbsp;€ finanziert, aber
						99&nbsp;% der Leserinnen und Leser spenden nicht.
					</p>
				</div>
				<div className="carousel-cell keen-slider__slide">
					<p>Wenn alle, die das jetzt lesen, einen kleinen Beitrag leisten, wäre unser Spendenziel
						bereits am heutigen { currentDayName } erreicht. { visitorsVsDonorsSentence } Schon der Preis einer Tasse
						Kaffee würde genügen.Sicher könnten wir mit Werbung eine Menge Geld verdienen.</p>
				</div>
				<div className="carousel-cell keen-slider__slide">
					<p>Aber dann wäre Wikipedia komplett anders. Wir könnten ihr nicht vertrauen. Es ist leicht, diese Nachricht zu
						ignorieren und die meisten werden das wohl tun. Wenn Sie Wikipedia nützlich finden, nehmen Sie sich an
						diesem { currentDayName } bitte eine Minute Zeit und geben Wikipedia mit Ihrer Spende etwas zurück.
						Vielen Dank!</p>
				</div>
			</div>
			<div id="dots-navigation"></div>

		</div>
		<a href="#" className="banner-slider-next" onClick={ bannerSliderNext }><ChevronRightIcon/></a>
	</div>;
}
