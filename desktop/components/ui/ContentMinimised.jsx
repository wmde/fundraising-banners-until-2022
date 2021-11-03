import { h } from 'preact';
import { forwardRef } from 'preact/compat';
import InfoIcon from './InfoIcon';
import CloseIcon from './CloseIcon';

export default forwardRef( function ContentMinimised( props, ref ) {
	return <div className="content__minimised" ref={ ref }>
		<div className="content__minimised-text">
			<InfoIcon/> Bitte verteidigen Sie die <br className="content__minimised-text-break"/>Unabhängigkeit von Wikipedia.
		</div>
		<div className="content__minimised-controls">
			<button className="content__minimised-controls--maximise" onClick={ props.maximiseBannerToForm }>Jetzt Wikipedia unterstützen</button>
			<button className="content__minimised-controls--close" onClick={ props.closeBanner }><CloseIcon/></button>
		</div>
	</div>;
} );
