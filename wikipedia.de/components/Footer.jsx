// eslint-disable-next-line no-unused-vars
import { h } from 'preact';

export default function Footer( { setToggleFundsModal } ) {
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
					className="iban-block">
					<span>DE33</span><span>1002</span><span>0500</span><span>0001</span><span>1947</span><span>00</span></span></span>
			</div>

			<div className="footer__item footer__item--rightflex">
				<a id="application-of-funds-link" className="application-of-funds-link"
					onClick={ setToggleFundsModal }>Wohin geht meine Spende?
				</a>
			</div>
		</div>
	</div>;
}
