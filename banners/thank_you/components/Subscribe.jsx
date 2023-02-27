import { h } from 'preact';
import { useContext, useEffect, useState } from 'preact/hooks';
import TranslationContext from '../../../shared/TranslationContext';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function Subscribe( props ) {
	const Translations = useContext( TranslationContext );
	const [ email, setEmail ] = useState( '' );
	const [ emailValidity, setEmailValidity ] = useState( true );

	useEffect( () => {
		setEmailValidity( true );
	}, [ email ] );

	const emailIsValid = email => {
		return String( email )
			.toLowerCase()
			.trim()
			.match( EMAIL_REGEX );
	};

	const submitForm = e => {
		if ( emailIsValid( email ) ) {
			props.onSubmit();
			return;
		}
		setEmailValidity( false );
		e.preventDefault();
	};

	return <div className="wmde-banner-subscribe">
		<p className="wmde-banner-subscribe-title">
			<strong>{ Translations[ 'subscribe-title' ] }</strong>
		</p>
		<p className="wmde-banner-subscribe-text">
			{ Translations[ 'subscribe-text' ] } <a href={ 'https://www.wikimedia.de/mitglieder/?' + props.queryString }>{ Translations[ 'subscribe-link' ] }</a>.
		</p>

		<form
			method="POST"
			action={ 'https://spenden.wikimedia.de/contact/subscribe?' + props.queryString }
			className="wmde-banner-subscribe-form"
			onSubmit={ submitForm }
		>
			<input
				type="text"
				className="wmde-banner-subscribe-input"
				name="email"
				onChange={ e => setEmail( e.target.value ) }
				placeholder={ Translations[ 'subscribe-placeholder' ] }
			/>

			{ !emailValidity && ( <div className="wmde-banner-subscribe-error">
				{ Translations[ 'subscribe-form-error' ] }
			</div> ) }

			<div>
				<button className="wmde-banner-subscribe-submit" type="submit">
					{ Translations[ 'subscribe-button' ] }
				</button>
			</div>

			<a className="wmde-banner-subscribe-privacy" href="https://spenden.wikimedia.de/page/Datenschutz" target="_blank">
				{ Translations[ 'subscribe-privacy' ] }
			</a>
		</form>
	</div>;
}
