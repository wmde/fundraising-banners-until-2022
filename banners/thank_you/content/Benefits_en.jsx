import { h } from 'preact';
import CheckCircle from '../../../components/Icons/CheckCircle';

export default function Benefits() {
	return <ul className="wmde-banner-benefits">
		<li><CheckCircle/> Membership fees are tax-deductible</li>
		<li><CheckCircle/> A donation receipt is issued automatically</li>
		<li><CheckCircle/> No risk: You can cancel your donation at any time without notice</li>
		<li><CheckCircle/> At your request: Our exclusive Wikipedia tote bag</li>
	</ul>;
}
