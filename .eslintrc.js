module.exports = exports = {
	'extends': 'wikimedia',
	'parser': 'babel-eslint',
	'parserOptions': {
		ecmaVersion: 6,
		sourceType: 'module',
		ecmaFeatures: {
			jsx: true
		}
	},
	'env': {
		browser: true,
		node: true,
		es6: true,
		jquery: true,
		qunit: true,
		mocha: true
	},
	'globals': {
		mw: false
	},
	'plugins': [
		'react'
	],
	'rules': {
		'dot-notation': [ 'error', { allowKeywords: true } ],
		'one-var': [ 'off' ],
		'vars-on-top': [ 'off' ],
		'camelcase': [ 'error', { properties: 'never' } ],
		'no-use-before-define': [ 'error', { functions: false } ],
		'quote-props': [ 'error', 'consistent-as-needed', { keywords: true } ],
		'max-len': [ 'error', {
			code: 180
		} ],
		'max-statements-per-line': [ 'error', { max: 2 } ],
		'prefer-regex-literals': [ 'off' ],
		'react/jsx-uses-react': 'error',
		'react/jsx-uses-vars': 'error',
		'react/jsx-pascal-case': 'error',
		'react/jsx-no-undef': 'error',
		'react/jsx-key': 'error',
		'react/no-unknown-property': 'error'
	}
};
