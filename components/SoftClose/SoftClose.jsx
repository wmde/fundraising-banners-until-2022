import { Component, h } from 'preact';

export default class SoftClose extends Component {
	constructor( props ) {
		super( props );
		this.state = {
			secondsRemaining: 15,
			timer: null
		};
	}

	startProgress() {
		this.setState( {
			timer: setInterval( () => {
				this.setState( { secondsRemaining: this.state.secondsRemaining - 1 } );
				if ( this.state.secondsRemaining === 0 ) {
					clearInterval( this.state.timer );
				}
			}, 1000 )
		} );
	}

	componentWillUnmount() {
		clearInterval( this.state.timer );
	}

	render( props, state ) {
		return ( <div className="wmde-banner-soft-close">
			<div className="wmde-banner-soft-close-countdown-bar">
				<div className="wmde-banner-soft-close-countdown-bar-fill"></div>
			</div>
			<div className="wmde-banner-soft-close-columns">
				<div className="wmde-banner-soft-close-column">
					<span className="wmde-banner-soft-close-prompt">Vielleicht möchten Sie Wikipedia später unterstützen?</span>
					<button className="wmde-banner-soft-close-button">Ja</button>
					<button className="wmde-banner-soft-close-button">Erstmal nicht</button>
				</div>
				<div className="wmde-banner-soft-close-column wmde-banner-soft-close-countdown-text">
					Diese Mitteilung wird automatisch in <strong> { state.secondsRemaining } Sekunden</strong> ausgeblendet.
				</div>
			</div>
		</div> );
	}

}
