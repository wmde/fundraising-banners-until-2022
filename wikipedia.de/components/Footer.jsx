import { h } from 'preact';

export default function Footer( { campaignName, bannerName} ) {
	return <div className="banner__footer">
		<div className="footer">
			<div className="footer__item">
				<span>Spendenkonto Wikimedia Foerdergesellschaft</span>
			</div>
			<div className="footer__item">
				<span>BIC</span>
				<span className="footer__importantinfo">BFSWDE33BER</span>
			</div>
			<div className="footer__item">
				<span>IBAN</span>
				<span className="footer__importantinfo"><span
					className="iban-block"><span>DE33</span><span>1002</span><span>0500</span><span>0001</span><span>1947</span><span>00</span></span></span>
			</div>

			<div className="footer__item footer__item--rightflex">
				<a id="application-of-funds-link" className="application-of-funds-link" target="_blank"
				   href={'https://spenden.wikimedia.de/use-of-funds?piwik_campaign=' + campaignName + '&piwik_kwd=' + bannerName + '_link'}
				   data-href="#info-application-of-funds">Wohin geht meine Spende?
				</a>
			</div>
		</div>
	</div>
}