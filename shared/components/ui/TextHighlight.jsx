import { Component, toChildArray, h } from 'preact';
import PropTypes from 'prop-types';

export default class TextHighlight extends Component {
	static propTypes = {
		/* Callback to start highlight animation from outside the component */
		registerStartAnimation: PropTypes.func,
		/* Animation duration */
		duration: PropTypes.number.default( 1500 ),
		/**
		 * Delay before the animation starts.
		 * Can be an alternative to registerStartAnimation if
		 * it's the same value as the delay before the banner is shown
		 */
		initialDelay: PropTypes.number.default( 0 )
	};

	state = { highlightedText: '', plainText: '' };
	highlightAnimationId = null; /* timeout ID (return value from setTimeout) to be able to cancel it */

	componentDidMount() {
		// convert children to text. Usually, they are text already,
		// but for cases where there are multiple strings
		// or an accidental tag element, we need to convert
		const plainText = toChildArray( this.props.children )
			.filter( child => typeof child === 'string' )
			.join( '' );

		this.setState( {
			highlightedText: '',
			plainText: ` ${plainText} `
		} );

		// Determine if the animation starts automatically or is triggered by a parent component
		// (exposing animateHighlight to the surrounding code)
		if ( this.props.registerStartAnimation ) {
			this.props.registerStartAnimation( this.animateHighlight.bind( this ) );
		} else {
			this.animateHighlight();
		}
	}

	animateHighlight() {
		const plainText = this.state.plainText;
		const duration = this.props.duration || 1500;
		const millisecondsPerChar = Math.max( 10, duration / plainText.length );
		// TODO When duration / plainTextlength < 10, find slice size based on millisecondsPerChar
		const sliceSize = Math.max( 1, plainText.length / duration );
		const animateSlice = () => {
			const highlightedText = this.state.highlightedText + this.state.plainText.slice( 0, sliceSize );
			const newPlainText = this.state.plainText.slice( sliceSize );
			this.setState( { highlightedText, plainText: newPlainText } );
			if ( newPlainText ) {
				this.highlightAnimationId = setTimeout( animateSlice, millisecondsPerChar );
			}
		};
		this.highlightAnimationId = setTimeout( animateSlice, this.props.initialDelay || 0 );
	}

	componentWillUnmount() {
		if ( this.highlightAnimationId ) {
			clearTimeout( this.highlightAnimationId );
		}
	}

	// eslint-disable-next-line no-unused-vars
	render( props, state, context ) {
		return <span className="text-highlight">
			<span className="text-highlight__highlighted">{state.highlightedText}</span>
			<span className="text-highlight__plain">{state.plainText}</span>
		</span>;
	}
}
