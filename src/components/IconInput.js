import React from 'react';
import { View, StyleSheet } from 'react-native';

import Icon from './Icon';
import Input from './Input';

import theme from 'theme';

const IconInput = ({
	style,
	inputStyle,
	icon: name = 'map',
	iconSize: size = theme.normalize(18),
	iconColor: color = theme.colors.blue,
	...rest
}) => {

	return (
		<View style={[styles.container, style]}>
			<View style={styles.iconContainer}>
				<Icon {...{ name, color, size }} />
			</View>
			<Input 
				inputStyle={[styles.inputStyle, inputStyle]} 
				{...rest} 
			/>
		</View>
	);
};

export default React.memo(IconInput);

const styles = StyleSheet.create({
	container: {
		justifyContent: 'center',
	},
	iconContainer: {
		alignItems: 'center',
		justifyContent: 'center',
		position: 'absolute',
		width: theme.normalize(48),
	},
	inputStyle: {
		paddingLeft: theme.normalize(44),
	},
});
