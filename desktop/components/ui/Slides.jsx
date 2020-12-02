// eslint-disable-next-line no-unused-vars
import { h } from 'preact';
import { useRef, useEffect, useState } from 'preact/hooks';
import { Splide } from '@splidejs/react-splide';
import ChevronLeftIcon from './ChevronLeftIcon';
import ChevronRightIcon from './ChevronRightIcon';
import * as PropTypes from 'prop-types';

const DEFAULT_INTERVAL = 5000;

export default function Slides( props ) {
	const slideRef = useRef();
	const doSplide = ( splideCallback ) => {
		if ( slideRef.current ) {
			splideCallback( slideRef.current.splide );
		}
	};
	const [ dragState, setDragState ] = useState( false );

	const startAutoplay = () => {
		doSplide( splide => splide.Components.Autoplay.play() );
	};
	const stopAutoplay = () => {
		doSplide( splide => splide.Components.Autoplay.pause() );
	};

	useEffect( () => {
		doSplide( splide => {
			splide.on( 'drag', () => setDragState( true ) );
			splide.on( 'dragged', () => setDragState( false ) );
		} );
		if ( typeof props.registerAutoplay === 'function' ) {
			doSplide( splide => splide.Components.Autoplay.pause() );
			props.registerAutoplay( startAutoplay, stopAutoplay );
		}
		if ( typeof props.onSlideChange === 'function' ) {
			doSplide( splide => splide.on( 'moved', props.onSlideChange ) );
		}
	} );

	const goToPreviousSlide = e => {
		e.preventDefault();
		doSplide( splide => splide.go( '-' ) );
		stopAutoplay();
	};
	const goToNextSlide = e => {
		e.preventDefault();
		doSplide( splide => splide.go( '+' ) );
		stopAutoplay();
	};

	return <div className="banner-slider">
		<a href="#" className="banner-slider-previous" onClick={goToPreviousSlide}><ChevronLeftIcon /></a>
		<div className="banner-slider__container">
			<Splide ref={slideRef} options={{
				type: 'loop',
				arrows: false,
				autoplay: true,
				interval: props.interval || DEFAULT_INTERVAL
			}}
			className={dragState ? 'splide--dragging' : ''}
			>{props.children}</Splide>
		</div>
		<a href="#" className="banner-slider-next" onClick={goToNextSlide}><ChevronRightIcon /></a>
	</div>;
}

Slides.propTypes = {
	/**
	 * A function that receives two callbacks, startAutoplay and stopAutoplay
	 */
	registerAutoplay: PropTypes.func,

	/**
	 * A function that gets called when the slides change. One parameter for the new slide index
	 */
	onSlideChange: PropTypes.func,

	/**
	 * How many milliseconds between each slide change
	 */
	interval: PropTypes.number
};
