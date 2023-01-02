import { h } from 'preact';
import PropTypes from 'prop-types';
import { useContext } from 'preact/hooks';
import TranslationContext from '../../shared/TranslationContext';
import classNames from 'classnames';
import ButtonClose from '../ButtonClose/ButtonClose';

export default function AlreadyDonatedModal( props ) {
	const Translations = useContext( TranslationContext );
	const Content = props.content;

	return <div className={ classNames( 'wmde-banner-already-donated', {
		'wmde-banner-already-donated--is-visible': props.isVisible
	} ) }>
		<div className="wmde-banner-already-donated-content">
			<ButtonClose onClick={ props.onHide } />
			<Content/>
			<div className="wmde-banner-already-donated-buttons">
				<button
					className="wmde-banner-already-donated-button"
					onClick={ props.onMaybeLater }>
					{ Translations[ 'already-donated-maybe-later-button' ] }
				</button>
				<button
					className="wmde-banner-already-donated-button"
					onClick={ props.onGoAway }>
					{ Translations[ 'already-donated-go-away-button' ] }
				</button>
			</div>
		</div>
	</div>;
}

AlreadyDonatedModal.propTypes = {
	content: PropTypes.element.isRequired,
	isVisible: PropTypes.bool.isRequired,
	onHide: PropTypes.func.isRequired,
	onMaybeLater: PropTypes.func.isRequired,
	onGoAway: PropTypes.func.isRequired
};
