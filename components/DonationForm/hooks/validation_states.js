export const UNSET = -1;
export const VALID = 0;
export const INVALID = 1;
export const AMOUNT_TOO_LOW = 2;
export const AMOUNT_TOO_HIGH = 3;

export function isValid( v ) {
	return v === VALID;
}

export function isValidOrUnset( v ) {
	return v === VALID || v === UNSET;
}
