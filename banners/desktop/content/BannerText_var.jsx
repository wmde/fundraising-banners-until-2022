import { h } from 'preact';
import InfoIcon from '../../../components/Icons/InfoIcon';

export default function BannerText( props ) {
	const { currentDayName, visitorsVsDonorsSentence, daysLeft, differenceToDonationTarget, numberOfDonors } = props.dynamicCampaignText;
	const animatedVisitorsVsDonorsSentence = visitorsVsDonorsSentence ? <span className="wmde-banner-text-animated-highlight">{ visitorsVsDonorsSentence }</span> : '';

	return <div>
		<p>
			<strong><InfoIcon fill={ '#990a00' }/> An alle in Deutschland, denen die Unabhängigkeit von Wikipedia wichtig ist </strong>
		</p>
		<p>
			Es wird knapp: { daysLeft } bleiben uns, und noch fehlen rund { differenceToDonationTarget }
			Millionen Euro bis zum Erreichen unseres Spendenziels. Bisher haben { numberOfDonors } großartige
			Menschen gespendet, aber das reicht leider noch nicht. { animatedVisitorsVsDonorsSentence } Warum ist es so
			wichtig, dass Wikipedia von Menschen wie Ihnen finanziell getragen wird? Weil es sonst niemand macht. Und
			weil es genau so gut und richtig ist! Deshalb zählen wir an diesem { currentDayName } auf Ihre Spende – und
			wenn es nur der Preis einer Tasse Kaffee ist. Vielen Dank!
		</p>
	</div>;
}
