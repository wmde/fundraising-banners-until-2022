import { h } from 'preact';
// This component uses Component from compat because pure Preact does not support
// animation events yet, see bug https://github.com/preactjs/preact/issues/1589
import { Component } from 'preact/compat';
import classNames from 'classnames';

const PENDING = 0;
const ENDED = 2;

export default class ProgressBar extends Component {
	constructor( props ) {
		super( props );
		this.state = {
			animation: PENDING
		};
	}

	// eslint-disable-next-line no-unused-vars
	animationFinished = ( e ) => {
		this.setState( { animation: ENDED } );
	};

	render( props, state ) {
		return <div className="progress_bar__wrapper">
			<div className={classNames( 'progress_bar', state.animation === ENDED ? 'progress_bar--finished' : '' ) }>
				<div className="progress_bar__fill" onAnimationEnd={ this.animationFinished }>
					<div className="progress_bar__days_left">Geschafft!</div>
					<div className="progress_bar__donation_remaining">{ props.goalDonationSum }</div>
				</div>
			</div>
		</div>;
	}
}
