import { h } from 'preact';
import InfoIcon from '../../../components/Icons/InfoIcon';

export default function Slides( dynamicCampaignText ) {
	const { currentDayName, daysLeft, differenceToDonationTarget, numberOfDonors } = dynamicCampaignText;

	return [
		{ content: <div>
			<p className="headline">
				<InfoIcon fill={ '#990a00' }/> <strong> An alle in Deutschland, denen die Unabhängigkeit von Wikipedia wichtig ist </strong>
			</p>
			<p>
				Es wird knapp: { daysLeft } bleiben uns, und noch fehlen rund { differenceToDonationTarget } Millionen
				Euro bis zum Erreichen unseres Spendenziels. Bisher haben { numberOfDonors } großartige
				Menschen gespendet, aber das reicht leider noch nicht.
			</p>
		</div> },
		{ content: <div>
			<p>
				<span className="wmde-banner-slider-text-animated-highlight">
						Vielleicht fällt es Ihnen in diesen schwierigen Zeiten schwerer als sonst, etwas zu spenden.
						Wikipedia schenkt uns aber gerade jetzt Orientierung durch neutrales und unabhängiges Wissen.
				</span>
			</p>
		</div> },
		{ content: <div>
			<p>
				Warum ist es so wichtig, dass Wikipedia von Menschen wie Ihnen finanziell getragen wird? Weil
				es sonst niemand macht. Und weil es genau so gut und richtig ist!
			</p>
		</div> },
		{ content: <div>
			<p>
				Deshalb zählen wir an diesem { currentDayName } auf Ihre Spende – und wenn es nur der
				Preis einer Tasse Kaffee ist. Vielen Dank!
			</p>
		</div> }
	];
}
