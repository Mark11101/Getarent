import React from 'react';
import { TextInput, Text, View, StyleSheet } from 'react-native';

import Separator from './Separator';

import theme from 'theme';

const Range = ({
	label,
	value,
	label2,
	value2,
	unit = '₽',
	placeholder,
	placeholder2,
	unit2 = unit,
	onChange,
	onChange2,
}) => {

	return (
		<View style={styles.container}>
			<Col {...{ label, placeholder, value, unit, onChange }} />
			<Separator style={styles.separator} />
			<Col
				label={label2}
				placeholder={placeholder2}
				value={value2}
				unit={unit2}
				onChange={onChange2}
			/>
		</View>
	);
};

export default React.memo(Range);

const Col = ({ label, placeholder, value, unit, onChange }) => {

	return (
		<View style={styles.col}>
			<Text style={styles.label}>
				{label}
			</Text>
			<View style={styles.row}>
				<TextInput
					style={styles.input}
					keyboardType="numeric"
					onChangeText={onChange}
					{...{ placeholder, value }}
				/>
				<Text style={theme.styles.P1R}>
					{unit}
				</Text>
			</View>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		...theme.styles.src.border,
		height: theme.normalize(64),
		flexDirection: 'row',
		alignItems: 'stretch',
		marginVertical: theme.spacing(2),
	},
	separator: {
		width: theme.normalize(1),
		height: '100%',
	},
	col: {
		flex: 1,
		padding: theme.spacing(3),
		paddingLeft: theme.spacing(4),
		paddingBottom: theme.spacing(2),
	},
	label: {
		fontFamily: theme.fonts.regular,
		fontSize: theme.normalize(10),
		lineHeight: theme.normalize(10),
		color: theme.colors.lightCyan,
	},
	row: {
		flex: 1,
		flexDirection: 'row',
		alignItems: 'center',
	},
	input: {
		...theme.styles.src.P1R,
		lineHeight: undefined,
		flex: 1,
		textAlignVertical: 'center',
		paddingRight: theme.spacing(2),
	},
});
