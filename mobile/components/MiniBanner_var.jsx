import { h } from 'preact';
import * as PropTypes from 'prop-types';
import ChevronRightIcon from './ui/ChevronRightIcon';
import ChevronLeftIcon from './ui/ChevronLeftIcon';
import Slides from './Slides_var';
import DayName from '../../shared/day_name';
import Slider from '../../shared/components/Slider';

export default function MiniBanner( props ) {
	const dayName = new DayName( new Date() );
	const currentDayName = props.translations[ dayName.getDayNameMessageKey() ];
	return <div className="mini-banner">
		<div className="mini-banner__box">
			<div className="mini-banner__content">
				<button className="close-button" onClick={props.onClose}>schließen</button>

				<div className="banner__slideshow">
					<Slider
						slides={ Slides( currentDayName, props.showModal ) }
						onSlideChange={ props.onSlideChange }
						registerAutoplay={ props.registerAutoplayCallbacks }
						interval={ props.sliderAutoPlaySpeed }
						previous={ <ChevronLeftIcon/> }
						next={ <ChevronRightIcon/> }
					/>
				</div>

				<div className="mini-banner__tab">
					<button className="mini-banner__tab-inner mini-banner__button" onClick={props.onExpandFullpage}>
						Jetzt unterstützen <span className="mini-banner__button-icon"><ChevronRightIcon/></span>
					</button>
				</div>
			</div>
		</div>
	</div>;
}

MiniBanner.propTypes = {
	onClose: PropTypes.func,
	formatters: PropTypes.object,
	campaignProjection: PropTypes.any,
	campaignParameters: PropTypes.object,
	startAnimation: PropTypes.func,
	onExpandFullpage: PropTypes.func,
	sliderAutoPlaySpeed: PropTypes.number
};
