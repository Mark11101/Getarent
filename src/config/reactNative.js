import { Image, Text, TextInput, LogBox } from 'react-native';

Image.defaultProps = { ...Image.defaultProps, fadeDuration: 0 };
Text.defaultProps = { ...Text.defaultProps, allowFontScaling: false };
TextInput.defaultProps = { ...TextInput.defaultProps, allowFontScaling: false };

LogBox.ignoreLogs([
	'Require cycle:',
	'Non-serializable values were found in the navigation state.',
]);
