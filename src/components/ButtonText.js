import React from 'react';
import { Text, TouchableOpacity, StyleSheet } from 'react-native';

import theme from 'theme';

const ButtonText = ({ style, textStyle, title, ...rest }) => {

	return (
		<TouchableOpacity
			style={[styles.container, style]}
			hitSlop={theme.hitSlop}
			{...rest}
		>
			<Text style={[ styles.text, textStyle ]}>
				{title}
			</Text>
		</TouchableOpacity>
	);
};

export default React.memo(ButtonText);

const styles = StyleSheet.create({
	container: {
		justifyContent: 'center',
		alignItems: 'center',
		padding: theme.spacing(2),
	},
	text: {
		...theme.styles.src.P2,
		color: theme.colors.blue,
	},
});
