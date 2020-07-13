// eslint-disable-next-line no-unused-vars
import { h } from 'preact';
import { Component } from 'preact/compat';
import PopUp from './ui/PopUp';
import classNames from 'classnames';

export default class MapImage extends Component {

	constructor( props ) {
		super( props );
		this.state = {
			isHovered: false
		};
	}

	toggleHoveredState = () => {
		this.setState( prevState =>( {
			isHovered: !prevState.isHovered
		} )
		);
	}

	// eslint-disable-next-line no-unused-vars
	render( props ) {
		return <div
			className={classNames(
				'banner-image',
				this.state.isHovered ? 'banner-image--highlight-visible' : '',
			)}>
			<div className="hover-area" onMouseEnter={this.toggleHoveredState} onMouseLeave={this.toggleHoveredState} />
			<PopUp
				isVisible={this.state.isHovered}
				currentStateName="Berlin"
				numberOfDonors="38.235"
				donatedAmount="120.432"/>
		</div>;
	}
}
