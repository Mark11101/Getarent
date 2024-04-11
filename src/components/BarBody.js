import React from 'react';
import { View, StyleSheet } from 'react-native';

import Icon from './Icon';

import theme from 'theme';

const BarBody = ({
	style,
	icon,
	iconSize,
	iconColor,
	invalid,
	children,
	...rest
}) => {

	return (
		<View style={[styles.container, style]} {...rest}>
			<View style={styles.iconContainer}>
				<Icon
					name={icon}
					size={iconSize}
					color={
						invalid
							? theme.colors.red
							: iconColor || theme.colors.blue
					}
				/>
			</View>
			{children}
		</View>
	);
};

export default React.memo(BarBody);

const styles = StyleSheet.create({
	container: {
		height: theme.normalize(48),
		flexDirection: 'row',
		alignItems: 'center',
		paddingRight: theme.spacing(4),
	},
	iconContainer: {
		height: theme.normalize(48),
		width: theme.normalize(48),
		justifyContent: 'center',
		alignItems: 'center',
	},
});
