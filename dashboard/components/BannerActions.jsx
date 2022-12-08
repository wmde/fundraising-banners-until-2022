import { h } from 'preact';
import IconPreview from './IconPreview';
import IconEdit from './IconEdit';

const CENTRAL_NOTICE_EDIT_URL = 'https://meta.wikimedia.org/wiki/Special:CentralNoticeBanners/edit/{{banner}}';
const WPDE_GITHUB_REPO = 'https://github.com/wmde/wikipedia.de-banners/blob/master/campaigns.yml';

export default function BannerActions( props ) {
	const bannerName = props.banner.pagename;
	let editLink = CENTRAL_NOTICE_EDIT_URL.replace( '{{banner}}', bannerName );
	if ( bannerName.includes( 'WPDE' ) ) {
		editLink = WPDE_GITHUB_REPO;
	}
	return <div className="banner-actions">
		<div className="banner-actions-links">
			<a className="link-icon"
				target="_blank"
				href={ editLink }
				title="Edit banner settings on CentralNotice or github (WPDE)"
			>
				<IconEdit/>
			</a>
			<a className="link-icon"
				target="_blank"
				href={ props.campaign.preview_url.replace( '{{PLACEHOLDER}}', bannerName ) }
				title="Preview in prod environment"
			>
				<IconPreview/>
			</a>
		</div>
		<a className="banner-actions-title"
			target="_blank"
			href={ props.campaign.preview_link.replace( '{{banner}}', bannerName ) }
			title="Preview in local environment"
		>{ bannerName }</a>
	</div>;
}
