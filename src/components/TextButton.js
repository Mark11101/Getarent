import React from 'react';
import { Text, StyleSheet } from 'react-native';

import theme from 'theme';

const TextButton = ({ style, title, onPress, disabled, ...rest }) => {
	
	return (
		<Text
			style={[styles.text, disabled && theme.styles.disabled, style]}
			onPress={onPress}
			{...{ disabled }}
			{...rest}
		>
			{title}
		</Text>
	);
};

export default React.memo(TextButton);

const styles = StyleSheet.create({
	text: {
		...theme.styles.P2R,
		color: theme.colors.blue,
	},
});
