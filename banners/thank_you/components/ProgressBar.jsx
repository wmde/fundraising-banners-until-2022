import { h } from 'preact';
// This component uses Component from compat because pure Preact does not support
// animation events yet, see bug https://github.com/preactjs/preact/issues/1589
import { Component } from 'preact/compat';
import classNames from 'classnames';
import TranslationContext from '../../../shared/TranslationContext';

const PENDING = 0;
const ENDED = 2;

export default class ProgressBar extends Component {
	static contextType = TranslationContext;

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

	render( props, state, context ) {
		const Translations = context;
		return <div className={ classNames( 'wmde-banner-progress-bar', { 'wmde-banner-progress-bar--finished': state.animation === ENDED } ) }>
			<div className="wmde-banner-progress-bar-fill" onAnimationEnd={ this.animationFinished }>
				<div className="wmde-banner-progress-bar-days-left">{Translations[ 'progress-bar-inner-text' ]}</div>
				<div className="wmde-banner-progress-bar-donation-remaining">{ props.goalDonationSum }</div>
			</div>
		</div>;
	}
}
