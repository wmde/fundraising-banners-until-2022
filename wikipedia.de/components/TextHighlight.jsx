import { Component, toChildArray, h } from "preact";

export default class TextHighlight extends Component {
	state = { highlightedText: '', plainText: '' };

	componentDidMount() {
		const plainText = toChildArray( this.props.children ).reduce( ( t, child ) => typeof child === 'string' ? t + child : t, '' );
		this.setState( { highlightedText: '', plainText } );
		if ( this.props.animateHighlightTrigger ) {
			this.props.animateHighlightTrigger( this.animateHighlight.bind(this) );
		}
	}

	animateHighlight() {
		const plainText = this.state.plainText;
		const initialDelay = 1000; // should be synchronized with the CSS animation that drops down the banner
		const duration = 1500;
		const millisecondsPerChar = Math.max( 10, duration / plainText.length );
		// TODO When duration / plainTextlength < 10, find slice size based on millisecondsPerChar
		const sliceSize = Math.max( 1, plainText.length / duration );
		const animateSlice = () => {
			const highlightedText = this.state.highlightedText + this.state.plainText.slice( 0, sliceSize );
			const plainText = this.state.plainText.slice( sliceSize );
			this.setState( { highlightedText, plainText } );
			if ( plainText ) {
				this.highlightAnimation = setTimeout( animateSlice, millisecondsPerChar );
			}
		};
		this.highlightAnimation = setTimeout( animateSlice, initialDelay )
	}

	componentWillUnmount() {
		if ( this.highlightAnimation ) {
			clearTimeout( this.highlightAnimation );
		}
	}

	render( props, state, context ) {
		return <span className="text__paragraph--highlight">
			<span className="marked">{state.highlightedText}</span>{state.plainText}
		</span>
	}
}