import { h } from 'preact';
import { forwardRef } from 'preact/compat';
import Slider from '../../../shared/components/Slider';
import Slides from '../Slides';
import ChevronLeftIcon from './ChevronLeftIcon';
import ChevronRightIcon from './ChevronRightIcon';
import ChevronDownIcon from './ChevronDownIcon';
import { useContext } from 'preact/hooks';
import TranslationContext from '../../../shared/components/TranslationContext';

export default forwardRef( function ContentSlideshow( props, ref ) {
	const Translations = useContext( TranslationContext );

	return <div className="content__slideshow" ref={ref}>
		<Slider
			slides={ Slides( props.dynamicCampaignText ) }
			onSlideChange={ props.onSlideChange }
			registerAutoplay={ props.registerAutoplayCallbacks }
			interval={ props.slideshowSlideInterval }
			previous={ <ChevronLeftIcon/> }
			next={ <ChevronRightIcon/> }
		/>
		<a className="slideshow-application-of-funds-link" onClick={ props.toggleFundsModal }>
			{ Translations[ 'use-of-funds-link' ] }
		</a>
		<button className="banner-button__next" onClick={ props.showDonationForm }>{ Translations[ 'next-button' ] } <ChevronDownIcon/></button>
	</div>;
} );
