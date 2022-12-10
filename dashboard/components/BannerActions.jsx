import { h } from 'preact';
import IconPreview from './IconPreview';
import IconEdit from './IconEdit';
import IconCopy from './IconCopy';
import IconBuild from './IconBuild';
import classNames from 'classnames';
import relativeDate from 'tiny-relative-date';

const CENTRAL_NOTICE_EDIT_URL = 'https://meta.wikimedia.org/wiki/Special:CentralNoticeBanners/edit/{{banner}}';
const WPDE_GITHUB_REPO = 'https://github.com/wmde/wikipedia.de-banners/blob/master/campaigns.yml';

/**
 * Actions:
 * View local banner
 * View live banner
 *
 * Build Banner
 * Copy Banner Code
 * Open CN Banner Page
 */

export default function BannerActions( props ) {
	const bannerName = props.banner.pagename;
	let editLink = props.isWPDE ? WPDE_GITHUB_REPO : CENTRAL_NOTICE_EDIT_URL.replace( '{{banner}}', bannerName );

	function onCompileBanner( e ) {
		e.preventDefault();

		// TODO start spinner state for compile

		// TODO find out why fetching triggers a Re-Render in React even if we don't change state
		fetch( `/compile-banner/${bannerName}` ).then( async response => {
			const result = await response.json();
			// TODO unset spinner state for compile
			if ( result.err ) {
				alert( result.err );
			}
			console.log( `Compiled in ${result.stats.compileTime}` );
		} );
	}

	const bannerCopyHandler = ( e ) => {
		e.preventDefault();

		const bannerFileName = `/compiled-banners/${bannerName}.js.wikitext`;

		// TODO start spinner state for copy
		fetch( bannerFileName ).then( async response => {
			// TODO unset spinner state for copy/ show confirmation
			if ( !response.ok ) {
				if ( response.status === 404 ) {
					alert( `${bannerName}.js.wikitext not found, maybe you need to compile first?` );
				} else {
					alert( response.statusText );
				}
				return;
			}
			const bannerCode = await response.text();
			await navigator.clipboard.writeText( bannerCode );
		} );
	};

	const isCompiled = !!props.compileInfo;
	let bannerCopyLink = null;
	if ( !props.isWPDE ) {
		let onCopyBannerToClipBoard = e => e.preventDefault();
		let bannerCopyTooltip = 'Banner not compiled';
		if ( props.compileInfo ) {
			const compiledSizeInKb = Math.round( props.compileInfo.size / 1024 );
			onCopyBannerToClipBoard = bannerCopyHandler;
			bannerCopyTooltip = `Copy ${compiledSizeInKb} KB Banner Code, compiled ${ relativeDate( props.compileInfo.date ) }`;
		}
		bannerCopyLink = (
			<a className={ classNames( {
				'banner-actions-icon': true,
				'uncompiled': !isCompiled
			} ) }
			href="#"
			title="Copy Banner Code"
			data-tooltip={bannerCopyTooltip}
			onClick={onCopyBannerToClipBoard}
			>
				<IconCopy fill={ '#141414' }/>
			</a>
		);
	}

	return ( <div className="banner-actions">
		<a className="banner-actions-title"
			target="_blank"
			href={ props.campaign.preview_link.replace( '{{banner}}', bannerName ) }
			title="Preview in local environment"
			data-tooltip="Preview in local environment"
		>{ bannerName }</a>
		<div className="banner-actions-links">
			<a className="banner-actions-icon"
				target="_blank"
				href={ props.campaign.preview_url.replace( '{{PLACEHOLDER}}', bannerName ) }
				title="Preview in prod environment"
				data-tooltip="Preview in Production"
			>
				<IconPreview fill={ '#141414' }/>
			</a>

			<a className="banner-actions-icon"
				href="#"
				title="Build Banner"
				data-tooltip="Build Banner"
				onClick={onCompileBanner}
			>
				<IconBuild fill={ '#141414' }/>
			</a>

			{ bannerCopyLink }

			<a className="banner-actions-icon"
				target="_blank"
				href={ editLink }
				title={ props.isWPDE ? 'Edit WPDE Banner Settings' : 'Edit Banner Settings on CentralNotice' }
				data-tooltip={ props.isWPDE ? 'Edit WPDE Banner Settings' : 'Edit Banner Settings on CentralNotice' }
			>
				<IconEdit fill={ '#141414' }/>
			</a>

		</div>
	</div> );
}
