import { Component, h } from 'preact';
import classNames from 'classnames';
import * as PropTypes from 'prop-types';

export default class FundsDistributionAccordion extends Component {
	constructor( props ) {
		super( props );
		this.state = {
			activeInfo: props.applicationOfFundsData.reduce( ( activeInfo, fundsItem ) => {
				const itemId = fundsItem.id;
				return { ...activeInfo, [ itemId ]: false };
			}, {} )
		};
	}

	setActive = ( selectedId ) => {
		const activeInfo = { ...this.state.activeInfo };
		activeInfo[ selectedId ] = !activeInfo[ selectedId ];
		this.setState( { activeInfo } );
	};

	render( { applicationOfFundsData }, state ) {
		const isActive = name => state.activeInfo[ name ];
		return <div className="funds_distribution_info">

			{applicationOfFundsData.map( fundsItem => <div
				className={classNames(
					'funds_distribution_info_item',
					'funds_distribution_info_item--' + fundsItem.id,
					{ active: isActive( fundsItem.id ) }
				)}
				key={fundsItem.id}
			>
				<div
					className="funds_distribution_info_item__title"
					onClick={() => this.setActive( fundsItem.id )}
				>
					{fundsItem.title} {fundsItem.percentage}%
				</div>
				<div className="funds_distribution_info_item__text" dangerouslySetInnerHTML={ { __html: fundsItem.text } }></div>
			</div> )}

		</div>;
	}
}

FundsDistributionAccordion.propTypes = {
	applicationOfFundsData: PropTypes.arrayOf( PropTypes.object ).isRequired
};
