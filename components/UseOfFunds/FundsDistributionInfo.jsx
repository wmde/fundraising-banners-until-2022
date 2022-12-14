import { Component, h } from 'preact';
import classNames from 'classnames';
import * as PropTypes from 'prop-types';

export default class FundsDistributionInfo extends Component {
	constructor( props ) {
		super( props );
		this.state = {
			activeInfo: 'communities'
		};
	}

	setActive = ( evt ) => {
		const matched = evt.target.className.match( /funds_distribution_info_item--(\w+)/ );
		if ( matched ) {
			this.setState( { activeInfo: matched[ 1 ] } );
		}
	};

	render( { applicationOfFundsData }, state ) {
		const isActive = name => state.activeInfo === name;
		return <div className="funds_distribution_info">

			<div className="funds_distribution_info__graph">
				{applicationOfFundsData.map( fundsItem => <div
					className={classNames(
						'funds_distribution_info_item',
						'funds_distribution_info_item--' + fundsItem.id,
						{ active: isActive( fundsItem.id ) }
					)}
					key={fundsItem.id}
					onMouseEnter={this.setActive}
					onClick={this.setActive}
					style={
						{
							width: fundsItem.percentage + '%',
							flexBase: fundsItem.percentage + '%'
						}}>
					<div className="funds_distribution_info_item__title">{fundsItem.title}</div>
					<div className="funds_distribution_info_item__box">{fundsItem.percentage}%</div>
				</div> )}
			</div>

			{applicationOfFundsData.map( fundsItem => <div
				key={fundsItem.id}
				className={classNames( 'funds_distribution_info__text', { active: isActive( fundsItem.id ) } ) }
				/* eslint-disable-next-line react/no-danger */
				dangerouslySetInnerHTML={ { __html: fundsItem.text } }>
			</div> )}

		</div>;
	}
}

FundsDistributionInfo.propTypes = {
	applicationOfFundsData: PropTypes.arrayOf( PropTypes.object ).isRequired
};
