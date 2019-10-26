import classNames from 'classnames';
import { Component, h } from 'preact';
import { useContext } from 'preact/hooks';
import formatNumber from 'format-number'
import TranslationContext from './TranslationContext';
import style from './ProgressBarDesktop.pcss';

const NOT_STARTED = 0;
const STARTED = 1;
const ENDED = 2;

export default class ProgressBarDesktop extends Component {
	constructor(props) {
		super(props);
		this.state = {
			width: 1,
			animation: NOT_STARTED
		};
		this.millionFormatter = formatNumber( { round: 1, prefix:'€ ', suffix: 'M', padRight: 1 } );
		if ( props.locale && this.props.locale === 'de' ) {
			this.millionFormatter = formatNumber( { round: 1, decimal: ',', suffix: 'M €', padRight: 1 } );
		}
	}

	componentDidMount() {
		if ( this.props.setStartAnimation ) {
			this.props.setStartAnimation( this.startAnimation.bind( this ) );
		}
	}

	progressAnimationEnded = (e) => {
		this.setState( { animation: ENDED } )
	};

	startAnimation() {
		this.setState( {
			width: ( this.props.donationAmount * 100 ) / this.props.goalDonationSum,
			animation: STARTED
		} );
	}

	render( props, state) {
		const getMillion = n => this.millionFormatter( n / 1000000 );
		const Translations = useContext(TranslationContext);
		return <div className={classNames( 'progress_bar', {
			'progress_bar--finished': state.animation === ENDED,
			'progress_bar--animating': state.animation === STARTED,
		})}>
			<div className="progress_bar__wrapper">
				<div className="progress_bar__donation_fill" style={ `width:${state.width}%` } onTransitionEnd={this.progressAnimationEnded}>
					<div className="progress_bar__days_left">
						{Translations['prefix-days-left']}{ ' ' }
						{ props.daysLeft } { ' ' }
						{ props.daysLeft === 1 ? Translations['days-singular'] : Translations['days-plural'] }
					</div>
					<div className="progress_bar__donation_text">{ getMillion( props.donationAmount ) }</div>
				</div>
				<div
					className="progress_bar__donation_remaining progress_bar__donation_remaining--inner">
					{ Translations['amount-missing'] }{ ' ' }
					{ getMillion( props.missingAmount ) }
				</div>
			</div>
			<div className="progress_bar__donation_remaining progress_bar__donation_remaining--outer">
				<div className="progress_bar__pointer_tip"></div>
				<hr className="progress_bar__pointer_line" />
					Es fehlen { props.missingAmount }M €
			</div>
		</div>
	}
}