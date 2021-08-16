// eslint-disable-next-line no-unused-vars
import { h, Component } from 'preact';
import classNames from 'classnames';

import Infobox from '../../shared/components/ui/Infobox';

export default class FullpageBanner extends Component {
	render( props ) {
		const DonationForm = props.donationForm;
		const trackingParams = `piwik_campaign=${props.campaignName}&piwik_kwd=${props.bannerName}_link`;

		return <div className={ classNames( 'fullpage-banner', { visible: props.isFullPageVisible && props.bannerVisible } ) }>
			<div className="fullpage-banner__close" onClick={ props.onClose }/>
			<div className="fullpage-banner__info">
				<div className="fullpage-banner__heading">
					Jetzt spenden
				</div>
				<Infobox
					formatters={props.formatters}
					campaignParameters={props.campaignParameters}
					campaignProjection={props.campaignProjection}
					bannerText={props.bannerText}
					propsForText={ { registerStartHighlight: props.registerStartHighlight } }
				/>
			</div>
			<div className="call-to-action">
				Jetzt sind Sie <span className="call-to-action__optional-text">in Deutschland</span> gefragt.
			</div>
			<DonationForm
				formItems={props.formItems}
				bannerName={props.bannerName}
				campaignName={props.campaignName}
				formatters={props.formatters}
				impressionCounts={props.impressionCounts}
				customAmountPlaceholder={ props.translations[ 'custom-amount-placeholder-short' ] }
				onSubmit={props.onSubmit}
				trackingParams={trackingParams}
				toggleFundsModal={props.toggleFundsModal}
			/>
		</div>;
	}
}
