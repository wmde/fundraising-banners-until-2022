import { Component, h } from 'preact';
import classNames from 'classnames';
import TranslationContext from '../../shared/components/TranslationContext';
import CloseIcon from './CloseIcon';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default class SubscriptionForm extends Component {

	constructor( props ) {
		super( props );
		this.state = {
			modalVisible: false,
			email: '',
			consentGiven: false,
			emailIsValid: true,
			formWasSubmitted: false
		};
		this.toggleModal = this.toggleModal.bind( this );
		this.hideModal = this.hideModal.bind( this );
		this.setEmail = this.setEmail.bind( this );
		this.setConsentGiven = this.setConsentGiven.bind( this );
		this.submitForm = this.submitForm.bind( this );
	}

	toggleModal( e ) {
		e.preventDefault();
		this.setState( { modalVisible: !this.state.modalVisible } );
		this.props.pauseCountdown( e );
	}

	hideModal( e ) {
		e.preventDefault();
		this.setState( { modalVisible: false } );
	}

	setEmail( e ) {
		this.setState( { email: e.target.value }, () => {
			if ( this.state.formWasSubmitted ) {
				this.setEmailValidity();
			}
		} );
	}

	setConsentGiven( e ) {
		this.setState( { consentGiven: e.target.checked } );
	}

	emailIsValid( email ) {
		return String( email )
			.toLowerCase()
			.trim()
			.match( EMAIL_REGEX );
	}

	setEmailValidity() {
		this.setState( { emailIsValid: this.emailIsValid( this.state.email ) } );
	}

	submitForm( e ) {
		if ( this.state.consentGiven && this.emailIsValid( this.state.email ) ) {
			this.props.onSubmit();
			return;
		}
		this.setState( { formWasSubmitted: true } );
		this.setEmailValidity();
		e.preventDefault();
	}

	render( props, state, context ) {
		const Translations = context;

		return <div className={ classNames( 'wmde-banner-subscription-form', {
			'wmde-banner-subscription-form--modal-visible': state.modalVisible
		} ) }>
			<a href="#" onClick={ this.toggleModal } className="wmde-banner-subscription-form-link">
				{ Translations[ 'subscription-form-toggle-link' ] }
			</a>
			<div className="wmde-banner-subscription-form-modal-overlay">
				<form
					method="post"
					action={ `https://spenden.wikimedia.de/contact/subscribe?piwik_kwd=${ props.bannerName }&piwik_campaign=${ props.campaignName }` }
					target="_blank"
					className="wmde-banner-subscription-form-modal"
					onSubmit={ this.submitForm }
				>
					<button className="wmde-banner-subscription-form-modal-close" onClick={ this.hideModal }><CloseIcon/></button>
					<div className="wmde-banner-subscription-form-modal-content">
						<label className="wmde-banner-subscription-form-input">
							{ Translations[ 'subscription-form-input-label' ] }
							<input type="text" name="email" onChange={ this.setEmail } placeholder={ Translations[ 'subscription-form-input-placeholder' ] }/>
						</label>
						{ state.formWasSubmitted && !state.emailIsValid && ( <div className="wmde-banner-subscription-form-error">
							{ Translations[ 'subscription-form-error-email' ] }
						</div> ) }
						<label className="wmde-banner-subscription-form-checkbox">
							<input type="checkbox" name="subscription-agree" value="consent-given" onChange={ this.setConsentGiven }/>
							{ Translations[ 'subscription-form-checkbox-label' ] }
						</label>
						{ state.formWasSubmitted && !state.consentGiven && ( <div className="wmde-banner-subscription-form-error">
							{ Translations[ 'subscription-form-error-privacy' ] }
						</div> ) }
						<button className="wmde-banner-subscription-form-submit" type="submit">
							{ Translations[ 'subscription-form-button' ] }
						</button>
						<a className="wmde-banner-subscription-form-privacy" href="https://spenden.wikimedia.de/page/Datenschutz" target="_blank">
							{ Translations[ 'subscription-form-privacy' ] }
						</a>
					</div>
				</form>
			</div>
		</div>;
	}
}

SubscriptionForm.contextType = TranslationContext;
