// eslint-disable-next-line no-unused-vars
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

export default function Slider( props ) {
	const { slides, previous, next, onSlideChange, registerAutoplay, interval } = props;
	const [ currentSlide, setCurrentSlide ] = useState( 0 );
	const [ timer, setTimer ] = useState( 0 );

	const [ sliderRef, slider ] = useKeenSlider( {
		initial: 0,
		loop: true,
		slideChanged( s ) {
			setCurrentSlide( s.details().relativeSlide );
			if ( typeof onSlideChange === 'function' ) {
				onSlideChange( s.details().relativeSlide );
			}
		}
	} );

	const startAutoplay = () => {
		if ( timer !== 0 ) {
			return;
		}
		setTimer( setInterval( slider.next, interval || DEFAULT_INTERVAL ) );
	};

	const stopAutoplay = () => {
		clearInterval( timer );
		// We explicitly don't set `timer` to 0, so it can't be started again
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
	} );

	return (
		<div className="slider-container" onMouseDown={ stopAutoplay }>
			<div className="navigation-wrapper">
				<div ref={ sliderRef } className="keen-slider">
					{ slides.map( ( slide, idx ) => (
						<div key={ idx } className="keen-slider__slide">
							<div className="keen-slider__slide-content">
								{ slide.content }
							</div>
						</div>
					) ) }
				</div>
				{ slider && previous && (
					<a href="#" className="slider-navigation-previous" onClick={ gotoPreviousSlide }>{ previous }</a>
				) }
				{ slider && next && (
					<a href="#" className="slider-navigation-next" onClick={ gotoNextSlide }>{ next }</a>
				) }
			</div>
			{ slider && (
				<div className="pagination">
					{ arrayRange( slider.details().size ).map( ( idx ) => {
						return (
							<a
								className={ classNames( 'pagination-dot', { 'is-active': currentSlide === idx } ) }
								key={ idx }
								onClick={ () => goToSlide( idx ) }
							/>
						);
					} ) }
				</div>
			) }
		</div>
	);
}
