module.exports = exports = {
	'extends': [
		'wikimedia',
		'plugin:react-hooks/recommended'
	],
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
	'settings': {
		react: {
			// eslint-plugin-preact interprets this as "h.createElement",
			// however we only care about marking h() as being a used variable.
			pragma: 'h',
			// We use "react 16.0" to avoid pushing folks to UNSAFE_ methods.
			version: '16.0'
		}
	},
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

		/**
		 * Preact / JSX rules
		 */
		'react/no-deprecated': 2,
		'react/react-in-jsx-scope': 0, // handled this automatically
		'react/display-name': [ 1, { ignoreTranspilerName: false } ],
		'react/jsx-no-bind': [ 1, {
			ignoreRefs: true,
			allowFunctions: true,
			allowArrowFunctions: true
		} ],
		'react/jsx-no-comment-textnodes': 2,
		'react/jsx-no-duplicate-props': 2,
		'react/jsx-no-undef': 2,
		'react/jsx-pascal-case': 'error',
		'react/jsx-uses-react': 2, // debatable
		'react/jsx-uses-vars': 2,
		'react/jsx-key': [ 2, { checkFragmentShorthand: true } ],
		'react/prefer-es6-class': 2,
		'react/prefer-stateless-function': 1,
		'react/require-render-return': 2,
		'react/no-danger': 1,
		'react/no-unknown-property': 'error',
		// Legacy APIs not supported in Preact:
		// 'react/no-did-mount-set-state': 2, // We're using this successfully
		'react/no-did-update-set-state': 2,
		'react/no-find-dom-node': 2,
		'react/no-is-mounted': 2,
		'react/no-string-refs': 2
	}
};
