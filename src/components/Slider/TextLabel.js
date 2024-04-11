import React from 'react';
import { View, TextInput, StyleSheet } from 'react-native';

import theme from 'theme';

const TextLabel = ({ textRef, ...props }) => {
	
	return (
		<View style={styles.container} pointerEvents="none" {...props}>
			<TextInput ref={textRef} style={styles.text} editable={false} />
		</View>
	);
};

export default React.memo(TextLabel);

const styles = StyleSheet.create({
	container: {
		width: theme.normalize(60),
		height: theme.normalize(30),
		borderRadius: theme.normalize(30) / 2,
		borderWidth: theme.normalize(2),
		borderColor: theme.colors.blue,
		backgroundColor: theme.colors.white,
		justifyContent: 'center',
		alignItems: 'center',
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
});
