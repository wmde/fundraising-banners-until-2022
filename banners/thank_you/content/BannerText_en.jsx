import { h } from 'preact';
import ImageWithCopyright from '../components/ImageWithCopyright';
import { integerFormatter } from '../../../shared/number_formatter/de';

export default function BannerText( { donorsBase } ) {
	const numberOfDonors = integerFormatter( donorsBase );

	return <div>
		<ImageWithCopyright/>
		<p><strong>Thank you so much! Fortunately, we did it once again, despite the current crisis.</strong></p>
		<p>
			Roughly { numberOfDonors } fantastic people have reacted to our appeal for donations over the past 57 days
			and showed how much they appreciate our project. We are particularly grateful considering the times we live
			in: We are all seriously affected by energy prices going through the roof, a double-digit inflation and the
			economy in free fall. Yet we were able to reach our fundraising target once again. We would like to
			wholeheartedly thank all of you!
		</p>

		<p>
			Like so many other people, we also find our world more unsettling than ever. Whether it is the Covid-19
			pandemic, global economic problems or the strained global political situation – we are often overly
			challenged by the complexity of how events unfold. How fortunate that Wikipedia offers reliable, neutral
			and well-documented information – completely free of charge and without advertising, in a comfortingly
			rational and calm style. It is the solid rock in an environment of fake news, propaganda and targeted
			(dis)information guided by special interests.
		</p>

		<p>
			However, Wikipedia’s independence is increasingly under pressure, for example when states attempt to
			censor unwanted facts – as it is currently the case on the Russian-language Wikipedia in the context of
			Russia’s war of aggression in Ukraine. But there are also ongoing attempts in our country to put legal
			pressure on volunteers who write for Wikipedia under their own name, or by attacking their chosen username.
		</p>

		<p>
			As a global community, we defend Wikipedia and its volunteers against such attacks with all the resources
			available to us. To achieve this, we depend on regular support, particular in these uncertain times of
			crisis. In Germany, around 102,000 people currently show their commitment to Wikipedia with a supporting
			membership and an average annual contribution of €55 – which are still not that many considering how
			popular Wikipedia is and how much it contributes to general knowledge.
		</p>

		<p>
			You can change that today: <strong>Please feel invited to join this group of extraordinary people as a
			new sustaining member</strong> – starting with just 2 euros per month. Help us to strengthen Wikipedia’s
			independence and to secure its long‑term existence.
		</p>

		<p>
			<strong>Become a sustaining member and support Wikipedia – especially now!</strong>
		</p>
	</div>;
}
