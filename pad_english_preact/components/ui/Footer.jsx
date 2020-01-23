// eslint-disable-next-line no-unused-vars
import { h } from 'preact';
import TranslationContext from '../../../shared/components/TranslationContext';
import { useContext } from 'preact/hooks';

export default function Footer( { bannerName, campaignName } ) {
	const Translations = useContext( TranslationContext );

	return <div className="banner__footer">
		<div className="footer">

			<div className="bank-info">
				<div className="footer__item">
					<span><span className="uppercase">{ Translations[ 'donation-account' ] }</span> Wikimedia Foerdergesellschaft</span>
				</div>

				<div className="iban-info">
					<div className="footer__item">
						<span>BIC</span>
						<span className="footer__importantinfo">BFSWDE33BER</span>
					</div>
					<div className="footer__item">
						<span>IBAN</span>
						<span className="footer__importantinfo"><span
							className="iban-block">
							<span>DE33</span><span>1002</span><span>0500</span><span>0001</span><span>1947</span><span>00</span></span></span>
					</div>
				</div>
			</div>

			<div className="footer__item footer__item--rightflex">
				<a id="application-of-funds-link" className="application-of-funds-link" target="_blank"
					href={ 'https://spenden.wikimedia.de/use-of-funds?skin=0&piwik_campaign=' + campaignName + '&piwik_kwd=' + bannerName + '_link' }>
					{ Translations[ 'use-of-funds-link' ] }
				</a>
			</div>

		</div>
	</div>;
}
