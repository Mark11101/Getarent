import React from 'react';
import chroma from 'chroma-js';
import { View, Text, StyleSheet } from 'react-native';

import { formatPrice } from '../functions';

import theme from 'theme';

const Addon = ({ style, children }) => {

	return (
		<View style={[styles.addon, style]}>
			<Text style={theme.styles.P2R}>
				+ {formatPrice(children)}
			</Text>
		</View>
	);
};

export default React.memo(Addon);

const styles = StyleSheet.create({
	addon: {
		flexDirection: 'row',
		alignItems: 'center',
		borderRadius: theme.borderRadius,
		backgroundColor: chroma(theme.colors.blue).alpha(0.1).css(),
		paddingHorizontal: theme.spacing(1.5),
		paddingVertical: theme.spacing(0.25),
		marginLeft: theme.spacing(3),
	},
});
