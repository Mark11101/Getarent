import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

import { extractErrorMessage } from 'functions';
import PrimaryButton from './PrimaryButton';
import Icon from './Icon';

import theme from 'theme';

const Empty = ({
	style,
	icon,
	iconSize,
	iconColor = theme.colors.lightCyan,
	text,
	bottomInterface,
	buttonText = '',
	buttonAction = '',
	error,
	...rest
}) => {

	return (
		<View style={[styles.container, style]} {...rest}>
			<View style={styles.info}>
				<Icon name={icon} size={iconSize} color={iconColor} />
				<Text style={styles.text}>
					{error ? extractErrorMessage(error) : text}
				</Text>
			</View>
			{bottomInterface}
			{!!(buttonText && buttonAction) && !bottomInterface && (
				<PrimaryButton
					style={styles.button}
					outlined
					title={buttonText}
					onPress={buttonAction}
				/>
			)}
		</View>
	);
};

export default React.memo(Empty);

const styles = StyleSheet.create({
	container: {
		height: '100%',
	},
	info: {
		alignItems: 'center',
		display: 'flex',
		flex: 1,
		justifyContent: 'center',
	},
	text: {
		...theme.styles.src.P1,
		color: theme.colors.lightCyan,
		margin: theme.spacing(12),
		marginTop: theme.spacing(4),
		textAlign: 'center',
	},
	button: {
		marginBottom: theme.spacing(4),
	},
});
