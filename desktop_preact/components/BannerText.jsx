// eslint-disable-next-line no-unused-vars
import { h } from 'preact';

export default function BannerText( props ) {
	return <div className="banner-text">
		<div className="banner-text-image collage-image">
			<p>Wieviel ist Ihnen Wikipedia wert?</p>
		</div>
		<div className="banner-text-copy">
			<p>Ist es nicht großartig, dass Wikipedia Ihnen immer und überall einen sicheren Zugang zu beinahe
				unerschöpflichem, verlässlichem Wissen bietet? Ein gigantisches Projekt, ermöglicht durch die Arbeit
				unzähliger Freiwilliger, <strong>werbefrei und kostenlos. Im Grunde unbezahlbar – aber ohne Geld doch
					nicht zu haben:</strong> Die operativen Kosten und Investitionen in die Weiterentwicklung von
				Wikipedia werden durch <strong>Spenden ihrer Nutzerinnen und Nutzer</strong> finanziert. Aus vielen
				kleinen Beiträgen wird eine wirkungsvolle Summe. <strong>Bitte tragen auch Sie dazu bei,</strong> die
				Unabhängigkeit von Wikipedia zu sichern. Vielen Dank!</p>
			<a onClick={ props.showFundsModal }>Wie wird Ihre Spende eingesetzt?</a>
		</div>
	</div>;
}
