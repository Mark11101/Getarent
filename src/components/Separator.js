import React from 'react';
import { View, StyleSheet } from 'react-native';

import theme from 'theme';

const Separator = ({ 
	style, 
	light, 
	invalid, 
	vertical, 
	...rest 
}) => {

	return (
		<View
			style={[
				styles.separator,
				vertical && styles.vertical,
				light && styles.light,
				invalid && styles.invalid,
				style,
			]}
			{...rest}
		/>
	);
};

export default React.memo(Separator);

const styles = StyleSheet.create({
	separator: {
		height: theme.normalize(1),
		width: '100%',
		backgroundColor: theme.colors.grey,
	},
	vertical: {
		height: '100%',
		width: theme.normalize(1),
	},
	light: {
		backgroundColor: theme.colors.lightGrey,
	},
	invalid: {
		backgroundColor: theme.colors.red,
	},
});
