import { h } from 'preact';

const CENTRAL_NOTICE_EDIT_URL = 'https://meta.wikimedia.org/wiki/Special:CentralNoticeBanners/edit/{{banner}}';
const WPDE_GITHUB_REPO = 'https://github.com/wmde/wikipedia.de-banners/blob/master/campaigns.yml'

export default function BannerActions( props ) {
	const bannerName = props.banner.pagename;
	let editLink = CENTRAL_NOTICE_EDIT_URL.replace( '{{banner}}', bannerName );
	if ( bannerName.includes( 'WPDE' ) ) {
		editLink = WPDE_GITHUB_REPO;
	}
	return <div className="banner-actions">
		<span className="banner-actions-local-preview">
			<a target='_blank'
				href={ props.campaign.preview_link.replace( '{{banner}}', bannerName ) }
				title="Preview in local environment"
			>{ bannerName }</a>
		</span>
		<span>
			<span className="banner-actions-icon banner-actions-production-setup">
				<a target='_blank'
					href={ editLink }
					title="Edit banner settings on CentralNotice or github (WPDE)"
				>▶️️ </a>
			</span>
			<span className="banner-actions-icon banner-actions-live-preview">
				<a target='_blank'
					href={ editLink }
					title="Preview in prod environment"
				>👁️️️ </a>
			</span>
		</span>

	</div>;
}
