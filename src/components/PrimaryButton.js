import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

import Icon from './Icon';

import theme from 'theme';

const PrimaryButton = ({
	icon,
	style,
	title,
	outlined,
	disabled,
	longText,
	titleStyle,
	iconSize = theme.normalize(16),
	iconColor = theme.colors.white,
	...rest
}) => {

	return (
		<TouchableOpacity
			style={[
				styles.container,
				outlined ? styles.outlineContainer : '',
				style,
				disabled && theme.styles.disabled,
			]}
			{...{ disabled }}
			{...rest}
		>
			{
				!!icon 
				&&
					<Icon
						style={styles.icon}
						name={icon}
						size={iconSize}
						color={iconColor}
					/>
			}
			<Text
				style={[
					outlined ? styles.outlineTitle : styles.title,
					titleStyle,
				]}
			>
				{title}
			</Text>
		</TouchableOpacity>
	);
};

export default React.memo(PrimaryButton);

const styles = StyleSheet.create({
	container: {
		alignItems: 'center',
		backgroundColor: theme.colors.blue,
		flexDirection: 'row',
		height: theme.normalize(48),
		justifyContent: 'center',
		...theme.styles.src.round,
	},
	icon: {
		marginRight: theme.spacing(2),
	},
	outlineContainer: {
		backgroundColor: theme.colors.white,
		borderColor: theme.colors.blue,
		borderRadius: theme.normalize(4),
		borderWidth: theme.normalize(1),
	},
	outlineTitle: {
		...theme.styles.src.P1,
		color: theme.colors.blue,
	},
	title: {
		...theme.styles.src.P1,
		color: theme.colors.white,
	},
});
