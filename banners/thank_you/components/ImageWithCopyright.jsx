import { h } from 'preact';

export default function ImageWithCopyright() {
	return <figure className="wmde-banner-image">
		<img width={ 156 }
			alt="Dr. Christian Humborg &amp; Franziska Heine Wikimedia Deutschland e.V."
			src="https://upload.wikimedia.org/wikipedia/commons/3/3a/WMDE_EDs.jpg"/>
		<figcaption className="wmde-banner-image-caption">
			Dr. Christian Humborg &amp; Franziska Heine<br/>
			Wikimedia Deutschland e.V.
		</figcaption>
		<div className="wmde-banner-image-copyright">
			<a href="https://commons.wikimedia.org/wiki/File:WMDE_EDs.jpg">Jason Krüger, Franziska Heine &amp; Christian Humborg</a>
			{ ', ' }
			<a href="https://creativecommons.org/licenses/by-sa/4.0/legalcode" rel="license">CC BY-SA 4.0</a>
		</div>
	</figure>;
}
