// eslint-disable-next-line no-unused-vars
import { h } from 'preact';
import CampaignDaySentence from '../../shared/campaign_day_sentence';
import VisitorsVsDonorsSentence from '../../shared/visitors_vs_donors_sentence';
import { useContext } from 'preact/hooks';
import TranslationContext from '../../shared/components/TranslationContext';
import CampaignDays, { endOfDay, startOfDay } from '../../shared/campaign_days';

export default function Slides( campaignParameters, campaignProjection, formatters ) {
	const Translations = useContext( TranslationContext );

	const campaignDays = new CampaignDays(
		startOfDay( campaignParameters.startDate ),
		endOfDay( campaignParameters.endDate )
	);

	const campaignDaySentence = new CampaignDaySentence( campaignDays, Translations );
	const visitorsVsDonorsSentence = new VisitorsVsDonorsSentence(
		campaignParameters.millionImpressionsPerDay,
		formatters.integerFormatter( campaignProjection.getProjectedNumberOfDonors() ),
		campaignDays.getDaysSinceCampaignStart(),
		Translations[ 'visitors-vs-donors-sentence' ]
	);

	return [
		{ content: <div>
			<p className="headline">An alle unsere Leserinnen und Leser in Deutschland.</p>
			<p>Vielleicht kommen wir gerade ungelegen. Aber dennoch: Bitte klicken Sie jetzt nicht weg!</p>
		</div> },
		{ content: <div>
			<p className="headline">{ campaignDaySentence.getSentence() }</p>
			<p>Zum ersten Mal seit langem möchten wir Sie an diesem Donnerstag bescheiden darum bitten,
				die Unabhängigkeit von Wikipedia zu verteidigen.</p>
		</div> },
		{ content: <div>
			<p className="headline">Wikipedia wird durch Spenden finanziert.</p>
			<p>Die durchschnittliche Spende beträgt 22,81 €. Doch schon mit einer Spende von 5 € kann
				Wikipedia sich auch in Zukunft erfolgreich entwickeln.</p>
		</div> },
		{ content: <div>
			<p className="headline">99% unserer Leserinnen und Leser spenden nichts.</p>
			<p>Sie übergehen diesen Aufruf. { visitorsVsDonorsSentence.getSentence() }</p>
		</div> },
		{ content: <div>
			<p className="headline">Die meisten spenden, weil sie Wikipedia nützlich finden.</p>
			<p>Hat Wikipedia Ihnen in diesem Jahr Wissen im Wert von 5 € geschenkt? Dann nehmen Sie sich
				doch bitte eine Minute Zeit und geben Sie etwas zurück. Vielen Dank!</p>
		</div> }
	];
}
