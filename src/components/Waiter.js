import React from 'react';
import { View, ActivityIndicator, Platform, StyleSheet } from 'react-native';

import theme from 'theme';

const defaultColor = Platform.OS === 'android' ? theme.colors.grey : undefined;

const Waiter = ({
	isFlex,
	isBlock,
	style,
	footer,
	size = 'large',
	color = defaultColor,
}) => {
	
	return (
		<View
			style={[
				styles.container,
				!(isBlock || isFlex || footer) && styles.absolute,
				isBlock && styles.block,
				isFlex && styles.flex,
				footer && styles.footer,
				style,
			]}
			collapsable={false}
		>
			<ActivityIndicator size={size} {...{ color }} />
		</View>
	);
};

export default React.memo(Waiter);

const styles = StyleSheet.create({
	container: {
		justifyContent: 'center',
		alignItems: 'center',
		zIndex: -1,
	},
	absolute: {
		marginTop: 0,
		left: 0,
		right: 0,
		top: 0,
		bottom: 0,
		position: 'absolute',
	},
	block: {
		marginTop: 30,
	},
	flex: {
		marginTop: 0,
		flex: 1,
	},
	footer: {
		marginTop: 10,
		marginBottom: 10,
	},
});
