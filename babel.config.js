module.exports = {
	presets: ['module:@react-native/babel-preset'],
	plugins: [
		[
			'module-resolver',
			{
				cwd: 'babelrc',
				root: ['./', './src'],
				alias: {},
			}
		],
	],
};
