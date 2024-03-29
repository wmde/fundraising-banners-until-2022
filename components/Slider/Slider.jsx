import { h } from 'preact';
import { useState, useEffect } from 'preact/hooks';
import { useKeenSlider } from 'keen-slider/react';
import classNames from 'classnames';

const DEFAULT_INTERVAL = 5000;

/**
 * Return an array with numbers from 0 to size
 *
 * @param {number} size
 * @return {number[]}
 */
function arrayRange( size ) {
	return [ ...Array( size ).keys() ];
}

const SliderPlayingStates = Object.freeze( {
	PENDING: Symbol( 'pending' ),
	PLAYING: Symbol( 'playing' ),
	STOPPED: Symbol( 'stopped' )
} );

export default function Slider( props ) {
	const { slides, previous, next, onSlideChange, registerAutoplay, registerGoToSlide, interval, sliderOptions } = props;
	const [ currentSlide, setCurrentSlide ] = useState( 0 );
	const [ timer, setTimer ] = useState( 0 );

	// NOTE: We can't use useState for this as the banner doesn't always re-render fast enough
	let sliderPlayingState = SliderPlayingStates.PENDING;

	const [ sliderRef, slider ] = useKeenSlider( {
		...{
			initial: 0,
			loop: true,
			slideChanged( s ) {
				setCurrentSlide( s.details().relativeSlide );
				if ( typeof onSlideChange === 'function' ) {
					onSlideChange( s.details().relativeSlide );
				}
			}
		},
		...sliderOptions
	} );

	const startAutoplay = () => {
		if ( sliderPlayingState !== SliderPlayingStates.PENDING ) {
			return;
		}
		setTimer( setInterval( slider.next, interval || DEFAULT_INTERVAL ) );
		sliderPlayingState = SliderPlayingStates.PLAYING;
	};

	const stopAutoplay = () => {
		clearInterval( timer );
		sliderPlayingState = SliderPlayingStates.STOPPED;
	};

	const gotoNextSlide = e => {
		e.stopPropagation();
		stopAutoplay();
		slider.next();
	};

	const gotoPreviousSlide = e => {
		e.stopPropagation();
		stopAutoplay();
		slider.prev();
	};

	const goToSlide = idx => {
		stopAutoplay();
		slider.moveToSlideRelative( idx );
	};

	useEffect( () => {
		if ( typeof registerAutoplay === 'function' ) {
			registerAutoplay( startAutoplay, stopAutoplay );
		}
		if ( typeof registerGoToSlide === 'function' ) {
			registerGoToSlide( goToSlide );
		}
	} );

	return (
		<div className="wmde-banner-slider-container">
			<div className="wmde-banner-navigation-wrapper">
				<div ref={ sliderRef } className="keen-slider wmde-banner-slider" onMouseDown={ stopAutoplay } onTouchStart={ stopAutoplay }>
					{ slides.map( ( slide, idx ) => (
						<div key={ idx } className={ classNames(
							'keen-slider__slide wmde-banner-slide',
							{ 'wmde-banner-slide--current': currentSlide === idx }
						) }>
							<div className="keen-slider__slide-content wmde-banner-slide-content">
								{ slide.content }
							</div>
						</div>
					) ) }
				</div>
				{ slider && previous && (
					<a href="#" className="wmde-banner-slider-navigation-previous" onClick={ gotoPreviousSlide }>{ previous }</a>
				) }
				{ slider && next && (
					<a href="#" className="wmde-banner-slider-navigation-next" onClick={ gotoNextSlide }>{ next }</a>
				) }
				{ slider && (
					<div className="wmde-banner-slider-pagination">
						{ arrayRange( slider.details().size ).map( ( idx ) => {
							return (
								<button
									className={ classNames( 'wmde-banner-slider-pagination-dot', { 'is-active': currentSlide === idx } ) }
									key={ idx }
									onClick={ () => goToSlide( idx ) }
								/>
							);
						} ) }
					</div>
				) }
			</div>
		</div>
	);
}
