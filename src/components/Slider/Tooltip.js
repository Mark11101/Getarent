import React from 'react';
import { View, TextInput, Platform, StyleSheet } from 'react-native';

import theme from 'theme';

const preventRotationGlitch =
	Platform.OS === 'android' &&
	[7, 8].includes(parseInt(Platform.constants.Release, 10));

const Tooltip = ({ textRef, ...props }) => {

	return (
		<View style={styles.container}>
			<View style={styles.inner} pointerEvents="none" {...props}>
				<TextInput ref={textRef} style={styles.text} editable={false} />
			</View>
			<View style={styles.square} />
		</View>
	);
};

export default React.memo(Tooltip);

const styles = StyleSheet.create({
	container: {
		alignItems: 'center',
	},
	inner: {
		width: theme.normalize(70),
		height: theme.normalize(32),
		borderRadius: theme.normalize(2),
		borderWidth: theme.normalize(1),
		borderColor: theme.colors.blue,
		backgroundColor: theme.colors.white,
		justifyContent: 'center',
		alignItems: 'center',
		marginBottom: theme.normalize(4),
	},
	text: {
		...theme.styles.src.P1R,
		lineHeight: undefined,
		height: '100%',
		margin: 0,
		padding: 0,
		textAlign: 'center',
		textAlignVertical: 'center',
	},
	square: {
		position: 'absolute',
		bottom: 0,
		width: theme.normalize(8),
		height: theme.normalize(8),
		borderBottomRightRadius: preventRotationGlitch
			? undefined
			: theme.normalize(2),
		borderBottomWidth: theme.normalize(1),
		borderRightWidth: theme.normalize(1),
		borderColor: theme.colors.blue,
		backgroundColor: theme.colors.white,
		transform: [{ rotateZ: '45deg' }],
	},
});
