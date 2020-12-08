// eslint-disable-next-line no-unused-vars
import { h } from 'preact';
import { useContext } from 'preact/hooks';
import classNames from 'classnames';
import TranslationContext from '../../../shared/components/TranslationContext';

export default function Infobox( { isVisible, image, heading, content, formAction, onDonate, onShowUseOfFundsModal } ) {

	const Translations = useContext( TranslationContext );
	const Image = image;

	const onShowUseOfFundsModalClick = e => {
		e.preventDefault();
		onShowUseOfFundsModal();
	};

	return <div className={ classNames( 'infobox', { 'is-visible': isVisible } ) }>
		<div className="infobox-container">
			<div className="infobox-column infobox-column-left">
				<div className="infobox-image">
					<Image/>
				</div>
				<div className="infobox-heading">
					{ heading }
				</div>
			</div>
			<div className="infobox-column infobox-column-right">
				<div className="infobox-content">
					{ content }
				</div>
				<div className="infobox-button">
					<form method="post" action={ formAction }>
						<button onClick={ onDonate }>
							{ Translations[ 'donate-button' ] }
						</button>
					</form>
				</div>
				<div className="infobox-info">
					<p>
						{ Translations[ 'info-line-1' ] } 22,81&nbsp;€.<br/>
						{ Translations[ 'info-line-2' ] } <a href="#" onClick={ onShowUseOfFundsModalClick }>{ Translations[ 'info-link' ] }.</a>
					</p>
				</div>
			</div>
		</div>
	</div>;
}
