import { h } from 'preact';
import { useContext } from 'preact/hooks';
import TranslationContext from '../../shared/components/TranslationContext';
import InfoIcon from './ui/InfoIcon';

export default function BannerText( props ) {
	const Translations = useContext( TranslationContext );
	const { currentDayName, campaignDaySentence, visitorsVsDonorsSentence, overallImpressionCount } = props.dynamicCampaignText;

	return <div className="banner-text">
		<p>
			<strong><InfoIcon/> An alle, die Wikipedia in Deutschland nutzen </strong>
		</p>
		<p>
			Vielleicht kommen wir gerade ungelegen, aber dennoch: Klicken Sie jetzt bitte nicht weg! Zum { overallImpressionCount }.
			Mal seit langem möchten wir Sie an diesem { currentDayName } bescheiden darum bitten, die Unabhängigkeit von Wikipedia zu sichern.
			{ campaignDaySentence } Wikipedia wird durch Spenden von durchschnittlich 21,60&nbsp;€ finanziert. Insgesamt spenden 99% nichts
			- sie übergehen diesen Aufruf. Sollten Sie zu dem kleinen Kreis gehören, die bereits gespendet haben, danken wir Ihnen sehr herzlich.
			{ ' ' + visitorsVsDonorsSentence } Die meisten Menschen spenden, weil Sie Wikipedia nützlich finden. Schon mit einer Spende
			von 5&nbsp;€ kann Wikipedia sich auch in Zukunft erfolgreich entwickeln. Hat Wikipedia Ihnen in diesem Jahr Wissen im
			Wert einer Tasse Kaffee geschenkt? Dann nehmen Sie sich doch bitte eine Minute Zeit und geben Sie etwas zurück. Vielen Dank.
		</p>
		<p>
			<a onClick={ props.toggleFundsModal }>
				{ Translations[ 'use-of-funds-link' ] }
			</a>
		</p>
	</div>;
}
