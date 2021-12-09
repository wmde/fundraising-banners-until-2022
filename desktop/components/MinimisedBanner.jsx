import { h } from 'preact';
import { forwardRef } from 'preact/compat';
import CloseIcon from './ui/CloseIcon';
import ChevronRightIcon from './ui/ChevronRightIcon';
import MessageNotificationIcon from './ui/MessageNotificationIcon';

export default forwardRef( function MinimisedBanner( props ) {
	return <div className="minimised-banner" ref={ props.ref }>

		<div className="minimised-banner--button-wrapper">
			<button className="minimised-banner--close" onClick={ props.closeBanner }><CloseIcon/></button>
			<button className="minimised-banner--maximise" onClick={ props.maximiseBanner }>
				<span className="minimised-banner--maximise-text">
					<MessageNotificationIcon/>
					Jetzt unterstützen
				</span>
				<ChevronRightIcon/>
			</button>
		</div>

		<div className="minimised-banner--progress-animation">

		</div>
	</div>;
} );
