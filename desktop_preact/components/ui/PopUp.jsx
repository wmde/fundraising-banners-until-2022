import { Component, h } from 'preact';

export default class PopUp extends Component {
	render() {
		return <div className="states-popup" >
			<div className="states-popup-headline">
				Berlin
			</div>
			<div className="states-popup-content">
				In <b>Berlin</b> haben <b>38.235 Menschen</b> schon <b>120.432 Euro</b> gespendet.
			</div>
		</div>;
	}
}
