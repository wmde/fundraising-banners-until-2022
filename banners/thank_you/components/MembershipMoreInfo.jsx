import { h } from 'preact';
import Subscribe from './Subscribe';
import { BannerType } from '../../../shared/BannerType';
import TranslationContext from '../../../shared/components/TranslationContext';
import { useContext } from 'preact/hooks';

export default function MembershipMoreInfo( props ) {
	const Translations = useContext( TranslationContext );
	const BannerText = props.bannerText;
	const Benefits = props.benefits;
	const MoreInfoCallToAction = props.moreInfoCallToAction;

	const makeQueryString = formActionParams => Object.keys( formActionParams )
		.map( key => `${key}=${formActionParams[ key ]}` )
		.join( '&' );

	const formAction = 'https://spenden.wikimedia.de/apply-for-membership';
	const formParams = {
		bImpCount: props.impressionCounts.bannerCount,
		piwik_campaign: props.campaignName,
		piwik_kwd: props.bannerName,
		type: 'sustaining',
		...props.formActionProps
	};

	return <div className="wmde-banner-more-info-content">
		<BannerText donorsBase={ props.campaignParameters.donationProjection.donorsBase }/>

		<div className="wmde-banner-more-info-columns">
			<div className="wmde-banner-more-info-benefits">
				<Benefits/>
			</div>
			<div className="wmde-banner-more-info-cta">
				<MoreInfoCallToAction
					formAction={ formAction }
					defaultFormParams={ formParams }
					onSubmit={ props.onSubmit }
				/>
			</div>
		</div>
		{ props.bannerType === BannerType.CTRL && (
			<p className="wmde-banner-subscribe-text">
				<a href={ 'https://www.wikimedia.de/mitglieder/?' + makeQueryString( {
					piwik_campaign: props.campaignName,
					piwik_kwd: props.bannerName,
					bImpCount: props.impressionCounts.bannerCount,
					...props.formActionProps
				} ) }>{ Translations[ 'call-to-action-more-info' ] }</a>
			</p>
		) }
		{ props.bannerType === BannerType.VAR && (
			<Subscribe
				queryString={ makeQueryString( {
					piwik_campaign: props.campaignName,
					piwik_kwd: props.bannerName,
					bImpCount: props.impressionCounts.bannerCount,
					...props.formActionProps
				} ) }
				onSubmit={ props.onSubmitSubscriptionForm }
			/>
		) }
	</div>;
}
