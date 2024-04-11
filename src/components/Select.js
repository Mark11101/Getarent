import React, { useMemo } from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

import api from 'api';
import Icon from './Icon';

import theme from 'theme';

const Select = ({
	style,
	label,
	value,
	error,
	disabled,
	options,
	onChange,
	textStyle,
	white = false,
	search = false,
	placeholder = '',
}) => {

	const text = disabled
		? placeholder
		: useMemo(
				() =>
					options.find(o => o.value === value)?.label || placeholder,
				[placeholder, value, options]
		  );

	return (
		<TouchableOpacity
			style={[
				styles.container, 
				style,
				white && { 
					borderColor: theme.colors.white,
					borderWidth: 1.5,
					borderRadius: 15,
				},
				disabled && { borderColor: '#979797' },
				error && { borderColor: theme.colors.red },
			]}
			disabled={disabled}
			onPress={() =>
				api.navigation.navigate(
					'Select',
					{
						title: label,
						options,
						value,
						search,
						black: white,
						callback: onChange,
					},
					true
				)
			}
		>
			<Text style={[
				styles.text, 
				textStyle,
				text === placeholder && { color: '#979797' },
				white && { color: theme.colors.white },
				disabled && { opacity: 0.5 },
				error && { color: theme.colors.red } 
			]}>
				{text}
			</Text>
			<Icon
				name="arrow-open"
				size={theme.normalize(14)}
				color={
					disabled ? '#979797' :
					white ? theme.colors.white : '#878F9B'
				}
				style={{ 
					right: 5,
					transform: [{ rotate: '90deg'}] 
				}}
			/>
		</TouchableOpacity>
	);
};

export default React.memo(Select);

const styles = StyleSheet.create({
	container: {
		...theme.styles.border,
		height: theme.normalize(40),
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		borderColor: theme.colors.lightCyan,
		paddingHorizontal: theme.spacing(3),
		marginVertical: theme.spacing(2),
	},
	text: {
		...theme.styles.P1R,
		marginRight: theme.spacing(1),
	},
});
