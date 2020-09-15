// eslint-disable-next-line no-unused-vars
import { Component, h } from 'preact';
import { useContext } from 'preact/hooks';
import TranslationContext from '../../../shared/components/TranslationContext';
import classNames from 'classnames';

export default class Tooltip extends Component {

	constructor( props ) {
		super( props );
		this.state = {
			hovered: false
		};
	}

	mouseEnter = () => {
		this.setState( { hovered: true } );
	}
	mouseLeave = () => {
		this.setState( { hovered: false } );
	}

	// eslint-disable-next-line no-unused-vars
	render( props, state, context ) {
		const Translations = useContext( TranslationContext );

		return <div
			className={ classNames( 'tooltip', { active: state.hovered } ) }
			onMouseEnter={ this.mouseEnter }
			onMouseLeave={ this.mouseLeave }
		>
			<div className="tooltip-content">
				{ Translations[ 'bank-account-tooltip' ] }
			</div>
			<a>
				<svg width="9" height="9" viewBox="0 0 9 9" fill="none" xmlns="http://www.w3.org/2000/svg">
					{/* eslint-disable-next-line max-len */ }
					<path d="M4.66659 8.33337C3.69412 8.33337 2.76149 7.94707 2.07386 7.25943C1.38623 6.5718 0.999919 5.63917 0.999919 4.66671C0.999919 3.69425 1.38623 2.76162 2.07386 2.07398C2.76149 1.38635 3.69412 1.00004 4.66659 1.00004C5.63905 1.00004 6.57168 1.38635 7.25931 2.07398C7.94694 2.76162 8.33325 3.69425 8.33325 4.66671C8.33325 5.63917 7.94694 6.5718 7.25931 7.25943C6.57168 7.94707 5.63905 8.33337 4.66659 8.33337ZM4.66659 0.333374C3.51731 0.333374 2.41511 0.78992 1.60246 1.60258C0.789798 2.41524 0.333252 3.51744 0.333252 4.66671C0.333252 5.81598 0.789798 6.91818 1.60246 7.73084C2.41511 8.54349 3.51731 9.00004 4.66659 9.00004C5.81586 9.00004 6.91806 8.54349 7.73071 7.73084C8.54337 6.91818 8.99992 5.81598 8.99992 4.66671C8.99992 3.51744 8.54337 2.41524 7.73071 1.60258C6.91806 0.78992 5.81586 0.333374 4.66659 0.333374ZM4.99992 3.66671V6.33337H5.66659V7.00004H3.66659V6.33337H4.33325V4.33337H3.66659V3.66671H4.99992ZM4.33325 2.33337H4.99992V3.00004H4.33325V2.33337Z"
						fill="black"/>
				</svg>
			</a>
		</div>;
	}
}
