import React from 'react';
import { SafeAreaView, Text, StyleSheet, View } from 'react-native';

import api from 'api';
import { PrimaryButton, Icon } from 'components';

import theme from 'theme';

export const RecoverPasswordFinal = () => {

	return (
		<SafeAreaView style={styles.container}>
			<View style={[styles.offset, styles.mainContainer]}>
				<View>
					<Icon
						name="password"
						style={styles.icon}
						color={theme.colors.lightCyan}
						size={theme.normalize(140)}
					/>
					<Text style={styles.lightText}>
						Пароль успешно изменен
					</Text>
				</View>
			</View>
			<View style={styles.offset}>
				<PrimaryButton
					outlined
					title="Войти"
					style={styles.button}
					onPress={() => api.navigation.navigate('SignIn')}
				/>
			</View>
		</SafeAreaView>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		paddingTop: 0,
		paddingBottom: theme.spacing(6),
		backgroundColor: theme.colors.white,
	},
	offset: {
		marginHorizontal: theme.spacing(6),
		padding: theme.spacing(0),
	},
	lightText: {
		...theme.getFontProps('semibold', 14, 18),
		paddingHorizontal: theme.spacing(10),
		textAlign: 'center',
		color: theme.colors.lightCyan,
	},
	button: {
		marginBottom: theme.spacing(4),
	},
	icon: {
		textAlign: 'center',
		marginVertical: theme.spacing(10),
	},
	mainContainer: {
		flexGrow: 1,
		justifyContent: 'center',
		alignItems: 'center',
	},
});
