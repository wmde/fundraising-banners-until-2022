import { h } from 'preact';
import { useState, useEffect } from 'preact/hooks';
import { useKeenSlider } from 'keen-slider/react';
import classNames from 'classnames';

const DEFAULT_INTERVAL = 5000;

const SliderPlayingStates = Object.freeze( {
	PENDING: Symbol( 'pending' ),
	PLAYING: Symbol( 'playing' ),
	STOPPED: Symbol( 'stopped' )
} );

export default function Slider( props ) {
	const { slides, previous, next, onSlideChange, registerAutoplay, registerGoToSlide, interval, sliderOptions } = props;
	const [ currentSlide, setCurrentSlide ] = useState( 0 );
	const [ timer, setTimer ] = useState( 0 );
	const [ loaded, setLoaded ] = useState( false );

	// NOTE: We can't use useState for this as the banner doesn't always re-render fast enough
	let sliderPlayingState = SliderPlayingStates.PENDING;

	const sliderOptionsCombined = {
		...{
			initial: 0,
			loop: true,
			slideChanged( s ) {
				setCurrentSlide( s.track.details.rel );
				s.options = sliderOptionsCombined;
				if ( typeof onSlideChange === 'function' ) {
					onSlideChange( s.track.details.rel );
				}
			},
			created() {
				setLoaded( true );
			}
		},
		...sliderOptions
	};

	const [ sliderRef, slider ] = useKeenSlider( sliderOptionsCombined );

	const startAutoplay = () => {
		if ( sliderPlayingState !== SliderPlayingStates.PENDING ) {
			return;
		}
		setTimer( setInterval( () => slider.current.next(), interval || DEFAULT_INTERVAL ) );
		sliderPlayingState = SliderPlayingStates.PLAYING;
	};

	const stopAutoplay = () => {
		clearInterval( timer );
		sliderPlayingState = SliderPlayingStates.STOPPED;
	};

	const gotoNextSlide = e => {
		e.stopPropagation();
		stopAutoplay();
		slider.current.next();
	};

	const gotoPreviousSlide = e => {
		e.stopPropagation();
		stopAutoplay();
		slider.current.prev();
	};

	const goToSlide = idx => {
		stopAutoplay();
		slider.current.moveToIdx( idx );
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
		<div className="slider-container">
			<div className="navigation-wrapper">
				<div ref={ sliderRef } className="keen-slider" onMouseDown={ stopAutoplay } onTouchStart={ stopAutoplay }>
					{ slides.map( ( slide, idx ) => (
						<div key={ idx } className="keen-slider__slide">
							<div className="keen-slider__slide-content">
								{ slide.content }
							</div>
						</div>
					) ) }
				</div>
				{ loaded && previous && (
					<a href="#" className="slider-navigation-previous" onClick={ gotoPreviousSlide }>{ previous }</a>
				) }
				{ loaded && next && (
					<a href="#" className="slider-navigation-next" onClick={ gotoNextSlide }>{ next }</a>
				) }
				{ loaded && (
					<div className="pagination">
						{ [ ...Array( slider.current.track.details.slides.length ).keys() ].map( ( idx ) => {
							return (
								<button
									className={ classNames( 'pagination-dot', { 'is-active': currentSlide === idx } ) }
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
