import { h } from 'preact';

export default function BannerActions( props ) {
	return <div>

		<a target='_blank' href={ props.campaign.preview_link.replace( '{{banner}}', props.banner.pagename ) }>{ props.banner.pagename }</a>

	</div>;
}
