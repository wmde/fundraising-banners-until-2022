import { h } from 'preact';

export default function AlreadyDonated() {
	return <div>
		<p><strong>Vielen Dank für Ihre Unterstützung</strong></p>
		<p>Es freut uns, dass Sie uns bereits unterstützt haben oder regelmäßig unterstützen. Ohne Sie wäre die
			Finanzierung unserer Projekte nicht möglich.</p>
		<p>Falls Sie sich eine (weitere) Spende vorstellen können, dann klicken Sie "Vielleicht später". Falls
			nicht, klicken Sie: "Für dieses Jahr reicht es". In diesem Fall wird ein Cookie in Ihrem Browser
			gesetzt, der die Anzeige der Banner bis Ende des Jahres verhindert.</p>
	</div>;
}
