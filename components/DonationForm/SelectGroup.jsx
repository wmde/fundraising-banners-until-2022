import { h } from 'preact';
import classNames from 'classnames';

export const ErrorPosition = Object.freeze( {
	TOP: Symbol( 'top' ),
	BOTTOM: Symbol( 'bottom' )
} );

export function SelectGroup( props ) {

	const errorPosition = props.errorPosition || ErrorPosition.BOTTOM;

	const error = <span className="wmde-banner-select-group-error-message">
		<span className="wmde-banner-error-icon">
			{ props.errorMessage }
		</span>
	</span>;

	return <div
		className={ classNames(
			props.fieldname,
			{
				'wmde-banner-select-group-container': true,
				'wmde-banner-select-group-container--with-error': !props.isValid
			}
		) }>

		{ errorPosition === ErrorPosition.TOP ? error : null }

		<div className="wmde-banner-select-group">
			{ props.selectionItems.map( ( { value, label, notice } ) => (
				<div key={ value } className={ classNames(
					'wmde-banner-select-group-option',
					`${ props.fieldname }-${value.replace( ' ', '-' )}`,
					{ 'wmde-banner-disabled': props.disabledOptions.indexOf( value ) > -1 }
				) }>
					<label>
						<input
							type="radio"
							onClick={ props.onSelected }
							checked={ value === props.currentValue }
							name={ props.fieldname }
							value={ value }
							disabled={ props.disabledOptions.indexOf( value ) > -1 }
							className="wmde-banner-select-group-input"/>
						<span className="wmde-banner-select-group-label">{ label || value }</span>
					</label>
					{ notice ? <span className={ classNames(
						'wmde-banner-select-group-notice',
						{
							selected: value === props.currentValue
						}
					) }>{ notice }</span> : null }
				</div>
			) ) }
			{ props.children }
		</div>

		{ errorPosition === ErrorPosition.BOTTOM ? error : null }

	</div>;
}
