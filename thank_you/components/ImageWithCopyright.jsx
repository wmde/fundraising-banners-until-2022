import { h } from 'preact';
import { useContext } from 'preact/hooks';
import TranslationContext from '../../shared/components/TranslationContext';

export default function ImageWithCopyright() {
	const Translations = useContext( TranslationContext );
	return <div className="image-wrapper">
		<div className="image-wrapper__image">
			<img width={156}
				alt="Christian Humborg, Wikimedia Deutschland e.V."
				src="https://upload.wikimedia.org/wikipedia/commons/thumb/8/80/Christian_Humborg_cropped.jpg/349px-Christian_Humborg_cropped.jpg"/>
		</div>
		<div className="image-wrapper__legend">
			Dr. Christian Humborg<br/>
			Wikimedia Deutschland e.V.
		</div>
		<div className="image-wrapper__copyright">
			{Translations[ 'image-copyright-holder' ]},
			{' '}
			<a href="https://commons.wikimedia.org/wiki/File:Christian_Humborg_cropped.jpg">Christian Humborg</a>
			{', '}
			<a href="https://creativecommons.org/licenses/by-sa/4.0/legalcode" rel="license">CC BY-SA 4.0</a>
		</div>
	</div>;
}
