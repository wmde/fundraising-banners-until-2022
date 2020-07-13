// eslint-disable-next-line no-unused-vars
import { h } from 'preact';
import classNames from 'classnames';

export default function PopUp( props ) {

	const { isVisible, currentStateName, numberOfDonors, donatedAmount } = props;
	return <div className={classNames(
		'states-popup',
		isVisible ? 'states-popup--visible' : '',
	)}>
		<div className="states-popup-headline">
				Berlin
		</div>
		<div className="states-popup-content">
				In <b>{currentStateName}</b> haben <b>{numberOfDonors} Menschen</b> schon <b>{donatedAmount} Euro</b> gespendet.
		</div>
	</div>;
}
