// eslint-disable-next-line no-unused-vars
import { h } from 'preact';
import { Component } from 'preact/compat';
import { useContext } from 'preact/hooks';
import classNames from 'classnames';

import TranslationContext from '../../shared/components/TranslationContext';
import PropTypes from 'prop-types';

const DAYS = 26;
const TOTAL = 9000000;
const DONATED = 6124434;
const LEFT = TOTAL - DONATED;
const WIDTH = DONATED / TOTAL * 100;

export default class ProgressBar extends Component {

	constructor( props ) {
		super( props );
		this.state = {
			width: 0,
			animationEnded: false
		};

		PropTypes.checkPropTypes( ProgressBar.propTypes, props, 'constructor', 'ProgressBar' );
	}

	componentDidMount() {
		this.props.setStartAnimation( this.startAnimation.bind( this ) );
	}

	startAnimation() {
		setTimeout( () => {
			this.setState( { width: WIDTH } );
		}, 2000 );
	}

	animationEnded = () => {
		this.setState( { animationEnded: true } );
	}

	render( props, state ) {
		const Translations = useContext( TranslationContext );
		const getMillion = n => this.props.formatters.millionFormatter( n / 1000000 );
		const getDaysLeft = daysLeft => {
			return Translations[ 'prefix-days-left' ] +
				' ' + daysLeft + ' ' +
				( daysLeft === 1 ? Translations[ 'day-singular' ] : Translations[ 'day-plural' ] ) + ' ' +
				Translations[ 'suffix-days-left' ];
		};
		return <div className={ classNames(
			'progress',
			state.animationEnded ? 'completed' : ''
		) }>
			<div className="progress-donated"
				style={ { width: `${ state.width }%` } }
				onTransitionEnd={ this.animationEnded }
			>
				<div className="progress-donated-days">
					{ getDaysLeft( DAYS ) }
				</div>
				<div className="progress-donated-amount">
					{ getMillion( DONATED ) }
				</div>
			</div>
			<div className="progress-remaining"
				style={ { width: `${ 100 - state.width }%` } }
			>
				{ Translations[ 'amount-missing' ] }{ ' ' }
				{ getMillion( LEFT ) }
			</div>
		</div>;
	}
}
