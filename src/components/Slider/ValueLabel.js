import React from 'react';
import { View, TextInput, StyleSheet } from 'react-native';

import DefaultLabel from './DefaultLabel';

import theme from 'theme';

const ValueLabel = ({ textRef, disabled, ...props }) => {

	return (
		<View 
			style={styles.container} 
			pointerEvents="none" {...props}
		>
			<DefaultLabel {...{ disabled }} />
			<TextInput
				ref={textRef}
				editable={false}
				style={[styles.text, disabled && styles.disabled]}
			/>
		</View>
	);
};

export default React.memo(ValueLabel);

const styles = StyleSheet.create({
	container: {
		height: theme.normalize(52),
		width: theme.normalize(60),
		justifyContent: 'space-between',
		alignItems: 'center',
		marginTop: theme.normalize(26),
	},
	text: {
		...theme.styles.src.P1R,
		lineHeight: undefined,
		height: theme.normalize(24),
		margin: 0,
		padding: 0,
		textAlign: 'center',
		textAlignVertical: 'center',
	},
	disabled: {
		color: theme.colors.grey,
	},
});
