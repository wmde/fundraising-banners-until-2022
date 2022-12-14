import { h } from 'preact';

export default function AlreadyDonated() {
	return <div>
		<p><strong>Thank you for your support</strong></p>
		<p>It pleases us that you already supported us or even supports us regularly. Without you we would not be able
			to finance our projects.</p>
		<p>If you consider another donation, you can click “Maybe later”. If not, please click “Enough for this year”.
			In that case a cookie is stored in your browser, which suppresses the banner to be shown until the end
			of the year.</p>
	</div>;
}
