import { h } from 'preact';

export default function Dashboard( props ) {
	return <div>
		<h1>FUN Banner Dashboard</h1>
		<p>We have { props.campaigns?.length } banners</p>
	</div>;
}
