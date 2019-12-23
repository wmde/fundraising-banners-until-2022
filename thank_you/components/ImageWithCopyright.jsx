// eslint-disable-next-line no-unused-vars
import { h } from 'preact';

export default function ImageWithCopyright() {
	return <div className="image-wrapper">
		<div className="image-wrapper__image">
			<img width={148}
				alt="Abraham Taherivand, Wikimedia Deutschland e.V."
				src="https://upload.wikimedia.org/wikipedia/commons/thumb/4/40/Abraham_Headshot.jpg/354px-Abraham_Headshot.jpg"/>
		</div>
		<div className="image-wrapper__legend">
			Abraham Taherivand<br/>
			Wikimedia Deutschland e.V.
		</div>
		<div className="image-wrapper__copyright">
			René Zieger für Wikimedia Deutschland, {' '}
			<a href="https://commons.wikimedia.org/wiki/File:Abraham_Headshot.jpg">Abraham Headshot</a>
			{', '}
			<a href="https://creativecommons.org/licenses/by-sa/4.0/legalcode" rel="license">CC BY-SA 4.0</a>
		</div>
	</div>;
}
