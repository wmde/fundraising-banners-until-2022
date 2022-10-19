import { Component, h } from 'preact';
import PropTypes from 'prop-types';

/**
 * A "mini banner" that displays when the user clicks on the regular "close" button.
 * It gives the user the option to perform the regular "close" action (setting cookie)
 * or choosing a "maybe later" action (which does not set the cookie that prevents further banners).
 *
 * The component also has a 15 seconds countdown timer. When the user takes no action,
 * the component triggers the regular "close" action.
 *
 * The parent banner is responsible for creating and destroying this component
 * and passing in the right event handlers.
 */
export default class SoftClose extends Component {

	static propTypes = {
		/**
		 * Callback when the user clicks the "I really want to close the banner" option
		 */
		onCloseBanner: PropTypes.func,

		/**
		 * Callback when the user clicks the "Maybe later" option
		 */
		onMaybeLater: PropTypes.func,

		/**
		 * Callback when the timer runs out without user choice
		 */
		onTimeOutClose: PropTypes.func
	};

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
				if ( this.state.secondsRemaining <= 1 ) {
					clearInterval( this.state.timer );
					this.props.onTimeOutClose();
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
				</div>

				<div className="wmde-banner-soft-close-column wmde-banner-soft-close-column-buttons">
					<button
						className="wmde-banner-soft-close-button"
						onClick={ () => { clearInterval( state.timer ); props.onMaybeLater(); } }>
						Ja
					</button>
					<button
						className="wmde-banner-soft-close-button"
						onClick={ () => { clearInterval( state.timer ); props.onCloseBanner(); } }>
						Erstmal nicht
					</button>
				</div>

				<div className="wmde-banner-soft-close-column wmde-banner-soft-close-countdown-text">
					Diese Mitteilung wird automatisch in <strong> { state.secondsRemaining } Sekunden</strong> ausgeblendet.
				</div>

			</div>
		</div> );
	}

}
