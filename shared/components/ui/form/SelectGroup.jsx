// eslint-disable-next-line no-unused-vars
import { h } from 'preact';
import classNames from 'classnames';

export const ErrorPosition = Object.freeze( {
	TOP: Symbol( 'top' ),
	BOTTOM: Symbol( 'bottom' )
} );

export function SelectGroup( props ) {

	const errorPosition = props.errorPosition || ErrorPosition.BOTTOM;

	const error = <span className="select-group__errormessage">
		<span className="select-group__erroricon">
			{ props.errorMessage }
		</span>
	</span>;

	return <div
		className={ classNames(
			`select-group-container--${ props.fieldname }`,
			{
				'select-group-container': true,
				'select-group-container--with-error': !props.isValid
			}
		) }>

		{ errorPosition === ErrorPosition.TOP ? error : null }

		<div className="select-group">
			{ props.selectionItems.map( ( { value, label } ) => (
				<label key={ value } className={ classNames(
					'select-group__option',
					`select-group__option--${ props.fieldname }-${value.replace( ' ', '-' )}`,
					{ 'select-group__disabled': props.disabledOptions.indexOf( value ) > -1 }
				) }>
					<input
						type="radio"
						onClick={ props.onSelected }
						checked={ value === props.currentValue }
						name={ props.fieldname }
						value={ value }
						disabled={ props.disabledOptions.indexOf( value ) > -1 }
						className="select-group__input"/>
					<span className="select-group__state">{ label || value }</span>
				</label> ) )
			}
			{ props.children }
		</div>

		{ errorPosition === ErrorPosition.BOTTOM ? error : null }

	</div>;
}
