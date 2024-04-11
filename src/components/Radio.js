import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';

import FormControlLabel from './FormControlLabel';

import theme from 'theme';

const width = theme.normalize(24);

const Radio = ({ style, label, checked, value, onChange, ...rest }) => {
	
	return (
		<FormControlLabel {...{ style, label }}>
			<TouchableOpacity
				style={[styles.container, checked && styles.checked, style]}
				hitSlop={theme.hitSlop}
				onPress={() => onChange(value)}
				{...rest}
			/>
		</FormControlLabel>
	);
};

export default React.memo(Radio);

const styles = StyleSheet.create({
	container: {
		width,
		height: width,
		borderRadius: width / 2,
		borderColor: theme.colors.lightCyan,
		borderWidth: theme.normalize(1),
	},
	checked: {
		borderColor: theme.colors.blue,
		borderWidth: theme.normalize(5),
	},
});
