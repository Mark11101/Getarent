import React from 'react';
import { View, StyleSheet } from 'react-native';

import theme from 'theme';

const DefaultLabel = ({ disabled, ...rest }) => {
	
	return (
		<View
			style={[styles.container, disabled && styles.disabled]}
			{...rest}
		/>
	);
};

export default React.memo(DefaultLabel);

const styles = StyleSheet.create({
	container: {
		width: theme.normalize(24),
		height: theme.normalize(24),
		borderRadius: theme.normalize(24) / 2,
		borderWidth: theme.normalize(2),
		borderColor: theme.colors.blue,
		backgroundColor: theme.colors.white,
	},
	disabled: {
		borderColor: theme.colors.grey,
	},
});
