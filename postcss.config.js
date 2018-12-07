module.exports = {
	plugins: {
		'postcss-import': {},
		'autoprefixer': {},
		'postcss-nested': {},
		'postcss-custom-properties': {
			preserve: false
		},
		'css-mqpacker': {},
		'postcss-combine-duplicated-selectors': {}
	}
};
