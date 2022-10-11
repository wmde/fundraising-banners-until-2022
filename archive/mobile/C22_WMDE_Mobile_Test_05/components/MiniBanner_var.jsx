import { h } from 'preact';
import * as PropTypes from 'prop-types';
import CloseIconMobile from '../../../components/Icons/CloseIconMobile';
import Slider from '../../../components/Slider/Slider';

export default function MiniBanner( props ) {
	const Slides = props.slides;

	return <div className="wmde-banner-mini">
		<div className="wmde-banner-mini-close">
			<button className="wmde-banner-mini-close-button" onClick={ props.onClose }><CloseIconMobile/></button>
		</div>

		<header className="wmde-banner-mini-headline">
			<div className="wmde-banner-mini-headline-background">
				<span className="wmde-banner-mini-headline-content">Ist Ihnen Wikipedia 5&nbsp;€ wert?</span>
			</div>
		</header>

		<div className="wmde-banner-mini-banner-slideshow">
			<Slider
				slides={ Slides( props.dynamicCampaignText ) }
				onSlideChange={ props.onSlideChange }
				registerAutoplay={ props.registerSliderAutoplayCallbacks }
				interval={ props.sliderAutoPlaySpeed }
				sliderOptions={ { loop: false } }
			/>
		</div>

		<div className="wmde-banner-mini-amount-preselection">
			<button className="wmde-banner-mini-button" onClick={ props.onExpandFullpageWithAmountPreselection }>
				Jetzt 5 € spenden
			</button>
			<a onClick={props.onExpandFullpage}>
				Jetzt anderen Betrag spenden
			</a>
		</div>
	</div>;
}

MiniBanner.propTypes = {
	slides: PropTypes.element,
	onClose: PropTypes.func,
	formatters: PropTypes.object,
	campaignProjection: PropTypes.any,
	campaignParameters: PropTypes.object,
	startAnimation: PropTypes.func,
	onExpandFullpage: PropTypes.func
};
