import React, { useCallback } from 'react';
import { View, Text, StyleSheet } from 'react-native';

import api from 'api';
import { SafeAreaSpacingView, PrimaryButton } from 'components';

import theme from 'theme';

const PaymentSuccess = () => {

	const onPress = useCallback(() => {
		api.navigation.navigate('Profile');
	}, []);

	return (
		<SafeAreaSpacingView style={styles.container}>
			<View style={styles.content}>
				<Text style={styles.title}>
					Документы успешно отправлены, ожидайте проверки
				</Text>
			</View>
			<PrimaryButton
				outlined
				style={styles.button}
				title="Вернуться в профиль"
				onPress={onPress}
			/>
		</SafeAreaSpacingView>
	);
};

export default PaymentSuccess;

const styles = StyleSheet.create({
	container: {
		...theme.styles.container,
		justifyContent: 'space-between',
		paddingHorizontal: theme.spacing(6),
		paddingBottom: theme.spacing(6),
	},
	content: {
		...theme.styles.container,
		justifyContent: 'center',
		alignItems: 'center',
	},
	title: {
		...theme.styles.P1,
		textAlign: 'center',
		color: theme.colors.lightCyan,
	},
	button: {
		marginTop: theme.spacing(4),
	},
});
