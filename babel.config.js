module.exports = {
	presets: [
		[
			'@babel/preset-env',
			{
				// debug: true,
				useBuiltIns: 'usage',
				corejs: { version: 3, proposals: true }
			}
		]
	],
	plugins: [
		[ '@babel/plugin-transform-react-jsx', {
			pragma: 'h',
			pragmaFrag: 'Fragment'
		} ],
		'@babel/plugin-proposal-class-properties',

		// TODO Use the webpack configuration to use this plugin only in a production environment.
		//      Type checks work in dev, but it's iffy
		'transform-react-remove-prop-types'
	],
	exclude: /webpack/
};
