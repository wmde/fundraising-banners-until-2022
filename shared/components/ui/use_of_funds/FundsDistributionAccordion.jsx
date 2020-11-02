// eslint-disable-next-line no-unused-vars
import { Component, h } from 'preact';
import classNames from 'classnames';
import { applicationOfFundsData } from "./FundsDistributionData";

export default class FundsDistributionInfo extends Component {
	constructor( props ) {
		super( props );
		this.state = {
			activeInfo: applicationOfFundsData.reduce( (activeInfo, fundsItem ) => {
				const itemId = fundsItem.id;
				return { ...activeInfo, [itemId]: false }
			}, {} )
		};
	}

	setActive = ( selectedId ) => {
		const activeInfo = { ...this.state.activeInfo };
		activeInfo[selectedId] = !activeInfo[selectedId];
		this.setState( { activeInfo } );
	};

	render( props, state ) {
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
						onClick={() => this.setActive(fundsItem.id)}
					>
							{fundsItem.title} {fundsItem.percentage}%
					</div>
					<div className="funds_distribution_info_item__text">{fundsItem.text}</div>
				</div> )}

		</div>;
	}
}
