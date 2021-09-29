// eslint-disable-next-line no-unused-vars
import { h } from 'preact';
import { useContext } from 'preact/hooks';
import TranslationContext from '../../shared/components/TranslationContext';
import DayName from '../../shared/day_name';

export default function Slides() {
	const Translations = useContext( TranslationContext );
	const dayName = new DayName( new Date() );
	const currentDayName = Translations[ dayName.getDayNameMessageKey() ];
	const Icon = <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
		<circle cx="8" cy="8" r="8" fill="#2B6DA0"/>
		<path d="M8.80003 5.73332V11.7173H10.2667V13.0667H5.96937V11.7173H7.33337V7.19999H5.8667V5.73332H8.80003ZM7.33337 2.79999H8.80003V4.26665H7.33337V2.79999Z" fill="white"/>
	</svg>;

	return [
		{ content: <div>
			<p className="headline">
				{ Icon } An alle unsere Leserinnen und Leser in Deutschland
			</p>
			<p>Vielleicht kommen wir gerade ungelegen. Aber dennoch: Klicken Sie jetzt bitte nicht weg!
					Zum ersten Mal seit langem möchten wir Sie an diesem { currentDayName } bescheiden darum bitten,
					die Unabhängigkeit von Wikipedia zu verteidigen.</p>
		</div> },
		{ content: <div>
			<p>Wikipedia wird durch Spenden von durchschnittlich 21,60&nbsp;€ finanziert. Insgesamt spenden 99%
					unserer Leserinnen und Leser nichts – sie übergehen diesen Aufruf. Sollten Sie zu dem kleinen Kreis
					gehören, die bereits gespendet haben, danken wir Ihnen sehr herzlich.
			</p>
		</div> },
		{ content: <div>
			<p>Die meisten Menschen spenden, weil sie Wikipedia nützlich finden. Schon mit einer Spende
					von 5&nbsp;€ kann Wikipedia sich auch in Zukunft erfolgreich entwickeln.
			</p>
		</div> },
		{ content: <div>
			<p>Hat Wikipedia Ihnen in diesem Jahr Wissen im Wert einer Tasse Kaffee geschenkt?
					Dann nehmen Sie sich doch bitte eine Minute Zeit und geben Sie etwas zurück. Vielen Dank!</p>
		</div> }
	];
}
