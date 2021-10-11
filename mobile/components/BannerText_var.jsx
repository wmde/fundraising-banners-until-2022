import { h } from 'preact';
import { useState } from 'preact/hooks';
import classNames from 'classnames';

export default function BannerText( props ) {
	const [ expanded, setExpanded ] = useState( false );

	const expand = e => {
		e.preventDefault();
		setExpanded( true );
		setTimeout( () => props.onExpandFullpageText() );
	};

	return <div className="banner-text">
		<div className="banner-text__heading">
			<p>Vielen Dank, dass Sie uns unterstützen wollen!&nbsp;</p>
		</div>
		<p>
			Wikipedia ist nicht selbstverständlich. Nur durch die Spenden ihrer Leserinnen und Leser kann ihre
			Existenz gesichert werden – unabhängig von Werbung und anderen Einflüssen.{ ' ' }
			<strong>Das macht Ihre Unterstützung so bedeutsam.</strong>
		</p>
		<div className={ classNames( 'banner-text__expander', { open: expanded } ) }>
			<p>
				Insgesamt spenden 99% unserer Leserinnen und Leser nichts – sie übergehen diesen
				Aufruf. Sollten Sie zu dem kleinen Kreis gehören, die bereits gespendet haben, danken wir Ihnen sehr herzlich.
				Wikipedia wird durch Spenden von durchschnittlich 21,60&nbsp;€ finanziert.
				Doch <strong>schon mit einer Spende von 5&nbsp;€</strong> kann Wikipedia sich auch in Zukunft erfolgreich entwickeln.
			</p>
			<p>
				Hat Wikipedia Ihnen in diesem Jahr Wissen im Wert einer Tasse Kaffee geschenkt?
				Dann nehmen Sie sich doch bitte eine Minute Zeit und geben Sie etwas zurück.
			</p>
			<p>
				Vielen Dank.
			</p>
		</div>
		{ !expanded && ( <button className="banner-text__toggle" onClick={ expand }>Weiterlesen ></button> ) }
	</div>;
}
