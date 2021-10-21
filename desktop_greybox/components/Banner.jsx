import { Component, h } from 'preact';
import BannerTransition from '../../shared/components/BannerTransition';

export class Banner extends Component {
	constructor( props ) {
		super( props );
		this.slideInBanner = () => {};
	}

	componentDidMount() {
		this.props.registerDisplayBanner( () => this.slideInBanner() );
	}

	addBannerSpace() {
		const bannerElement = document.querySelector( '.wmdeanner' );
		this.props.skinAdjuster.addSpaceInstantly( bannerElement.offsetHeight );
	}

	registerBannerTransition = ( cb ) => {
		this.slideInBanner = cb;
	}

	onFinishedTransitioning = () => {
		this.props.onFinishedTransitioning();
		this.addBannerSpace();
	}

	render( props ) {
		return <div className="wmde-banner">
			<BannerTransition
				fixed={ true }
				registerDisplayBanner={ this.registerBannerTransition }
				onFinish={ this.onFinishedTransitioning }
				skinAdjuster={ props.skinAdjuster }
				transitionSpeed={ 1000 }
			>
				<button className="wmde-c-close-button">x</button>
				<div className="wmde-l-content">
					<div className="wmde-c-text">
						<p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Accusamus aliquam blanditiis corporis cum
							deserunt ducimus ipsum magni <a href="#">maxime molestiae</a> nemo odit omnis quas quia ratione recusandae, sit
							suscipit veritatis voluptatum.
						</p>
						<p>A ab ad aliquid, aperiam consequatur delectus dolores doloribus earum eligendi enim esse ex facilis
							hic id incidunt modi molestias mollitia odit officiis quo, repellat saepe tempore tenetur, voluptate
							voluptatum!
						</p>
					</div>
					<form className="wmde-l-form" action="https://formaction.com">
						<fieldset className="wmde-c-form-fieldset wmde-c-form-fieldset--interval has-error">
							<div className="wmde-c-form-fieldset-title">Interval</div>
							<div className="wmde-c-form-fieldset-options">
								{ [ 'one-time', 'monthly', 'quarterly', 'half-yearly', 'yearly' ].map( value => (
									<label className="wmde-c-form-field wmde-c-form-field--radio">
										<input type="radio" name="interval"/> { value }
									</label>
								) ) }
							</div>
							<div className="wmde-c-form-fieldset-error">There was an error</div>
						</fieldset>
						<fieldset className="wmde-c-form-fieldset wmde-c-form-fieldset--amount">
							<div className="wmde-c-form-fieldset-title">Amount</div>
							<div className="wmde-c-form-fieldset-options">
								{ [ '€5', '€10', '€20', '€25', '€50', '€100' ].map( value => (
									<label className="wmde-c-form-field wmde-c-form-field--radio">
										<input type="radio" name="amount"/> { value }
									</label>
								) ) }
								<label className="wmde-c-form-field wmde-c-form-field--custom-amount">
									<input name="custom-amount" type="text"/>
								</label>
							</div>
						</fieldset>
						<fieldset className="wmde-c-form-fieldset wmde-c-form-fieldset--payment-type">
							<div className="wmde-c-form-fieldset-title">Payment Type</div>
							<div className="wmde-c-form-fieldset-options">
								{ [ 'Direct Debit', 'Bank Transfer', 'Credit Card', 'PayPal' ].map( value => (
									<label className="wmde-c-form-field wmde-c-form-field--radio">
										<input type="radio" name="payment-type"/> { value }
									</label>
								) ) }
							</div>
						</fieldset>

						<button className="wmde-c-button">Proceed with my Donation</button>
					</form>
				</div>
				<div className="wmde-l-footer">
					Footer here
				</div>
			</BannerTransition>
		</div>;
	}
}
