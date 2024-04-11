import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

import Icon from './Icon';

import theme from 'theme';

const size = theme.normalize(24);
const bigSize = theme.normalize(26);

const FeatureItem = ({ style, icon, label, big }) => {

	return (
		<View style={[styles.container, style]}>
			<Icon
				name={icon}
				color={theme.colors.lightCyan}
				size={big ? bigSize : size}
			/>
			<Text style={[styles.label, big && styles.bigLabel]}>
				{label}
			</Text>
		</View>
	);
};

export default React.memo(FeatureItem);

const styles = StyleSheet.create({
	container: {
		height: theme.normalize(40),
		flexDirection: 'row',
		alignItems: 'center',
	},
	label: {
		...theme.styles.src.P2R,
		marginLeft: theme.spacing(4),
	},
	bigLabel: {
		marginLeft: theme.spacing(3.5),
	},
});
