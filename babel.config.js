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
	plugins: [],
	exclude: /webpack/
};
