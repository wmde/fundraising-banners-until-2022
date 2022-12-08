import { h } from 'preact';
import IconPreview from './IconPreview';
import IconEdit from './IconEdit';
import IconCopy from './IconCopy';
import IconBuild from './IconBuild';

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

	return <div className="banner-actions">
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
				target="_blank"
				href="#"
				title="Build Banner"
				data-tooltip="Build Banner"
			>
				<IconBuild fill={ '#141414' }/>
			</a>

			{ !props.isWPDE && (
				<a className="banner-actions-icon"
					target="_blank"
					href="#"
					title="Copy Banner Code"
					data-tooltip="Copy Banner Code"
				>
					<IconCopy fill={ '#141414' }/>
				</a>
			) }

			<a className="banner-actions-icon"
				target="_blank"
				href={ editLink }
				title={ props.isWPDE ? 'Edit WPDE Banner Settings' : 'Edit Banner Settings on CentralNotice' }
				data-tooltip={ props.isWPDE ? 'Edit WPDE Banner Settings' : 'Edit Banner Settings on CentralNotice' }
			>
				<IconEdit fill={ '#141414' }/>
			</a>

		</div>
	</div>;
}
