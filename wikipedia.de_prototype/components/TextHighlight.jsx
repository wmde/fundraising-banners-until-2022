import { Component, toChildArray, h } from "preact";

export default class TextHighlight extends Component {
	state = { highlightedText: '', plainText: '' };

	componentDidMount() {
		const plainText = toChildArray( this.props.children ).reduce( ( t, child ) => typeof child === 'string' ? t + child : t, '' );
		this.setState( { highlightedText: '', plainText } );

		// TODO watch bannerIsVisible property and start animation when banner is visible (instead of when it's mounted)
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
		}
		this.highlightAnimation = setTimeout( animateSlice, millisecondsPerChar )
	}

	componentWillUnmount() {
		if ( this.highlightAnimation ) {
			clearTimeout( this.highlightAnimation );
		}
	}

	render( props, state, context ) {
		return <span className="text__paragraph text__paragraph--highlight">
			<span className="marked">{state.highlightedText}</span>{state.plainText}
		</span>
	}
}