import { h } from 'preact';
import style from './Funds.pcss';

export default function Funds() {
	return <div className="wlightbox-contents">
		<div id="info-application-of-funds">
			<div className="wlightbox-title clearfix">
				<span className="icon-bar-chart wlightbox-icon"></span>Wohin geht meine Spende?
				<a href="http://wikimedia.de/wiki/Transparenz" target="_blank"><span
					className="logo-itz-white f-right no-margin"></span></a>
			</div>
			<p>
				<img alt="Mittelverwendung"
					 src="//upload.wikimedia.org/wikipedia/commons/b/ba/WMDE-application-of-funds-diagram-2018.png"/>
			</p>
			<div>
				<img alt="Mittelverwendung"
					 src="//upload.wikimedia.org/wikipedia/commons/2/25/WMDE-application-of-funds-2018.png"/>
			</div>
			<hr/>
			<div id="info-application-of-funds-footer">
				<div>
					<a id="link-wmf-annual-plan"
					   href="https://meta.wikimedia.org/wiki/Wikimedia_Foundation_Annual_Plan/2017-2018/Final"
					   target="_blank">Erfahren Sie mehr zum Jahresplan<br/>der Wikimedia Foundation</a>
				</div>
				<div>
					<a id="link-wmde-annual-plan"
					   href="https://meta.wikimedia.org/wiki/Wikimedia_Deutschland/Planung_2018" target="_blank">Erfahren
						Sie mehr zum Jahresplan<br />von Wikimedia Deutschland</a>
				</div>
			</div>
		</div>
	</div>
}