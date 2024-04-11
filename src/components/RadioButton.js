import React from 'react';
import { TouchableOpacity, View, Text, StyleSheet } from 'react-native';

import Addon from './Addon';

import theme from 'theme';

const width = theme.normalize(16);
const dotWidth = Math.max(width - theme.normalize(6), 1);

function RadioButton({
	style,
	label,
	addon,
	value,
	checked,
	disabled,
	onChange,
	children,
	labelStyle,
	material,
	white = false,
	...rest
}) {

	return (
		<TouchableOpacity
			style={[styles.container, style]}
			onPress={() => onChange(value, label)}
			{...rest}
		>
			<View style={styles.row}>
				<View
					style={[
						styles.radio,
						material && styles.material,
						disabled && styles.disabled,
						checked && styles.checked,
						white && styles.white,
					]}
					hitSlop={theme.hitSlop}
					onPress={() => onChange(value)}
					{...rest}
				>
					{checked && <View style={[styles.dot, white && styles.whiteDot, material && styles.materialDot]} />}
					{disabled && <View style={styles.dotDisabled} />}
				</View>
				<Text style={[styles.label, labelStyle]}>
					{label}
				</Text>
				{
					addon !== null && addon !== undefined 
					&&
						<Addon>
							{addon}
						</Addon>
				}
			</View>
			{
				!!children 
				&& 
					<View style={styles.children}>
						{children}
					</View>
			}
		</TouchableOpacity>
	);
};

export default React.memo(RadioButton);

const styles = StyleSheet.create({
	container: {
		paddingVertical: theme.spacing(1),
	},
	row: {
		flexDirection: 'row',
		alignItems: 'center',
	},
	radio: {
		width,
		height: width,
		justifyContent: 'center',
		alignItems: 'center',
		borderRadius: width / 2,
		borderColor: theme.colors.black,
		borderWidth: theme.normalize(1),
	},
	material: {
		borderWidth: theme.normalize(3),
		borderColor: '#DBE3EF',
	},
	checked: {
		borderColor: theme.colors.blue,
	},
	disabled: {
		borderColor: theme.colors.midBlue,
	},
	dot: {
		width: dotWidth,
		height: dotWidth,
		borderRadius: dotWidth / 2,
		backgroundColor: theme.colors.blue,
	},
	materialDot: {
		backgroundColor: 'white',
	},
	dotDisabled: {
		width: dotWidth,
		height: dotWidth,
		borderRadius: dotWidth / 2,
		backgroundColor: theme.colors.midBlue,
	},
	label: {
		...theme.styles.P2R,
		...theme.styles.shrink,
		marginLeft: theme.spacing(3),
	},
	children: {
		marginLeft: width + theme.spacing(3),
	},
	white: {
		borderColor: theme.colors.lightBlue,
	},
	whiteDot: {
		backgroundColor: theme.colors.lightBlue,
	},
});
