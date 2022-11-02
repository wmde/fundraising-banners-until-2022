import { h } from 'preact';

export default function Slides( dynamicCampaignText, progressBar ) {
	const {
		currentDayName,
		campaignDaySentence,
		visitorsVsDonorsSentence,
		overallImpressionCount,
		formattedGoalDonationSumNumeric
	} = dynamicCampaignText;

	return [
		{
			content: <div className="carousel-cell-first">
				<p className="goal-headline">Unser Spendenziel: { formattedGoalDonationSumNumeric } Millionen Euro</p>
				{ progressBar }
			</div>
		},
		{
			content: <div>
				<p>An alle, die Wikipedia in Deutschland nutzen:
					Dies ist der { overallImpressionCount }. Spendenaufruf, den wir Ihnen zeigen. Am
					heutigen { currentDayName } bitten wir Sie bescheiden, die Unabhängigkeit von Wikipedia zu sichern.</p>
			</div>
		},
		{
			content: <div>
				<p>Vielleicht kommen wir gerade ungelegen, aber dennoch: Klicken Sie
					jetzt bitte nicht weg! { campaignDaySentence }</p>
			</div>
		},
		{
			content: <div>
				<p>Insgesamt spenden 99% nichts - sie übergehen diesen Aufruf. Schon mit
					einer Spende von 5&nbsp;€ kann Wikipedia sich auch in Zukunft erfolgreich entwickeln.</p>
			</div>
		},
		{
			content: <div>
				<p>
					{ visitorsVsDonorsSentence } Wikipedia wird durch Spenden von durchschnittlich 21,60&nbsp;€ finanziert.
				</p>
			</div>
		},
		{
			content: <div>
				<p>
					Hat Wikipedia Ihnen in diesem Jahr Wissen im Wert einer Tasse Kaffee geschenkt? Dann
					nehmen Sie sich doch bitte eine Minute Zeit und geben Sie etwas zurück. Vielen Dank.
				</p>
			</div>
		}
	];
}