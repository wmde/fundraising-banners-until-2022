import { h } from 'preact';
import { forwardRef } from 'preact/compat';
import CloseIcon from './ui/CloseIcon';
import MaximiseIcon from './ui/MaximiseIcon';

export default forwardRef( function MinimisedBanner( props ) {
	return <div className="minimised-banner">
		<button className="minimised-banner--close" onClick={ props.closeBanner }><CloseIcon/></button>
		<button className="minimised-banner--maximise" onClick={ props.maximiseBannerToForm }>Jetzt Wikipedia unterstützen. <MaximiseIcon/></button>
	</div>;
} );
