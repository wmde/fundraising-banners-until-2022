// eslint-disable-next-line no-unused-vars
import { h } from 'preact';
import { useState, useEffect } from 'preact/hooks';
import { useKeenSlider } from 'keen-slider/react';
import classNames from 'classnames';

const DEFAULT_INTERVAL = 5000;

export default function Slider( props ) {
	const { slides, previous, next, onSlideChange, registerAutoplay, interval } = props;
	const [ currentSlide, setCurrentSlide ] = useState( 0 );
	const [ timer, setTimer ] = useState( 0 );

	/**
	 * We don't reset the timer here so it can't be started again
	 */
	const onStopAutoplay = () => {
		clearInterval( timer );
	};

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

	const onStartAutoplay = () => {
		if ( timer !== 0 ) {
			return;
		}
		setTimer( setInterval( slider.next, interval || DEFAULT_INTERVAL ) );
	};

	useEffect( () => {
		if ( typeof registerAutoplay === 'function' ) {
			registerAutoplay( onStartAutoplay, onStopAutoplay );
		}
	} );

	const onNext = e => {
		e.stopPropagation();
		onStopAutoplay();
		slider.next();
	};

	const onPrevious = e => {
		e.stopPropagation();
		onStopAutoplay();
		slider.prev();
	};

	const onNavigate = idx => {
		onStopAutoplay();
		slider.moveToSlideRelative( idx );
	};

	return (
		<div className="slider-container" onMouseDown={ onStopAutoplay }>
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
					<a href="#" className="slider-navigation-previous" onClick={ onPrevious }>{ previous }</a>
				) }
				{ slider && next && (
					<a href="#" className="slider-navigation-next" onClick={ onNext }>{ next }</a>
				) }
			</div>
			{ slider && (
				<div className="pagination">
					{ [ ...Array( slider.details().size ).keys() ].map( ( idx ) => {
						return (
							<button
								className={ classNames( 'pagination-dot', { 'is-active': currentSlide === idx } ) }
								key={ idx }
								onClick={ () => onNavigate( idx ) }
							/>
						);
					} ) }
				</div>
			) }
		</div>
	);
}
