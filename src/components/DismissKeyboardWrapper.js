import React from 'react';
import { TouchableWithoutFeedback, View, Keyboard } from 'react-native';

export default function DismissKeyboardWrapper({ style, children, ...props }) {
	return (
		<TouchableWithoutFeedback onPress={Keyboard.dismiss} {...props}>
			<View {...{ style }}>{children}</View>
		</TouchableWithoutFeedback>
	);
}
