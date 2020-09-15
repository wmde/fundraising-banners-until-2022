// eslint-disable-next-line no-unused-vars
import { h } from 'preact';
import Footer from './ui/EasySelectFooterWithTooltip';

export default function BannerText( props ) {
	return <div className="banner-text">
		<div className="banner-text-title-image">
			<div className="banner-text-title">
				<p>Wieviel ist Ihnen Wikipedia wert?</p>
			</div>
			<div className="banner-text-image">
				<img className="banner-text-image-s" height="175" src="https://upload.wikimedia.org/wikipedia/commons/1/19/Collage-1088.png" alt="Einstein Image"/>
				<img className="banner-text-image-l" height="239" src="https://upload.wikimedia.org/wikipedia/commons/8/82/Collage-1440.png" alt="Einstein Image"/>
			</div>
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

			<Footer/>
		</div>
	</div>;
}
