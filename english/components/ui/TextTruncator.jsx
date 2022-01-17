import { h } from 'preact';
import { useState } from 'preact/hooks';

export default function TextTruncator( props ) {
	const { text, showLabel, hideLabel, maxLength = 100 } = props;
	const [ open, setOpen ] = useState( false );

	if ( text.length <= maxLength ) {
		return text;
	}
	const truncatedText = text.slice( 0, maxLength );

	const showMore = e => {
		e.preventDefault();
		setOpen( true );
	};

	const hideMore = e => {
		e.preventDefault();
		setOpen( false );
	};

	return <span>
		{ open ? text : truncatedText }
		{ !open && ( <span> <a href="#" onClick={ showMore }>...{ showLabel }</a></span> ) }
		{ open && ( <span> <a href="#" onClick={ hideMore }>...{ hideLabel }</a></span> )}
	</span>;
}
