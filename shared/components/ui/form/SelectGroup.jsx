// eslint-disable-next-line no-unused-vars
import { h } from 'preact';
import classNames from 'classnames';

export default function SelectGroup( props ) {

	return <div
		className={ classNames(
			`select-group-container--${props.fieldname}`,
			{
				'select-group-container': true,
				'select-group-container--with-error': !props.isValid
			}
		) }>
		<div className="select-group">
			{ props.selectionItems.map( ( { value, label } ) => (
				<label className={ 'select-group__option' } key={value}>
					<input
						type="radio"
						onClick={props.onSelected}
						checked={value === props.currentValue}
						name={props.fieldname}
						value={value}
						disabled={ props.disabledOptions.indexOf( value ) > -1 }
						className="select-group__input"/>
					<span className="select-group__state">{ label || value }</span>
				</label> ) )
			}
			{ props.children }
		</div>
		<span className="select-group__errormessage">
			<span className="select-group__erroricon">
				{ props.errorMessage }
			</span>
		</span>
	</div>;
}
