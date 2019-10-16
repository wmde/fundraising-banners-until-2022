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
		} ]
	],
	exclude: /webpack/
};
