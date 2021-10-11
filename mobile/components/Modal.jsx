import { h } from 'preact';
import { useEffect, useState } from 'preact/hooks';
import classNames from 'classnames';
import ModalClose from './ui/ModalClose';

export default function Modal( props ) {
	const { registerModalCallbacks } = props;

	const [ visible, setVisible ] = useState( false );
	const [ footerVisible, setFooterVisible ] = useState( true );
	const [ content, setContent ] = useState( '' );

	const showModal = ( content, withFooter = true ) => {
		setContent( content );
		setFooterVisible( withFooter );
		setVisible( true );
	};

	const hideModal = () => {
		setVisible( false );
	};

	const showUseOfFunds = e => {
		hideModal();
		props.showUseOfFunds( e );
	};

	const showForm = () => {
		hideModal();
		props.showForm();
	};

	useEffect( () => {
		if ( typeof registerModalCallbacks === 'function' ) {
			registerModalCallbacks( showModal );
		}
	} );

	return <div className={ classNames( 'banner-modal', { 'visible': visible, 'footer-visible': footerVisible } ) }>
		<div className="banner-modal-container">
			<button className="banner-modal-close" onClick={hideModal}><ModalClose/></button>
			<div className="banner-modal-content">
				{ content }
			</div>
			<div className="banner-modal-footer">
				<button className="banner-modal-more-info" onClick={showUseOfFunds}>Mehr erfahren ›</button>
				<button className="banner-modal-call-to-action" onClick={showForm}>Jetzt unterstützen</button>
			</div>
		</div>
	</div>;

}
