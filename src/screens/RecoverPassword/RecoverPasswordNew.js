import { Formik } from 'formik';
import { useDispatch } from 'react-redux';
import React, { useCallback, useState } from 'react';
import { Text, StyleSheet, View } from 'react-native';

import {
	Header,
	Waiter,
	SafeAreaView,
	PrimaryButton,
	FormikPasswordInput,
	DismissKeyboardWrapper,
} from 'components';
import api from 'api';
import theme from 'theme';
import actions from 'actions';

const initialValues = {
	password: '',
	confirm_password: '',
};

export const RecoverPasswordNew = ({
	route: {
		params: { userId },
	},
}) => {

	const dispatch = useDispatch();

	const [waiter, setWaiter] = useState(false);

	const onSubmit = useCallback(

		async ({ password, confirm_password }) => {

			if (password !== confirm_password) {
				dispatch(actions.error('Пароли не совпадают'));
				return;
			};

			setWaiter(true);

			try {
				const {
					error,
					accessToken,
					refreshToken,
					user,
				} = await api.web.resetPassword(userId, password);

				if (error) {
					throw error;
				}

				await api.auth.setToken(accessToken, refreshToken);
				await api.storage.set('profile', user);

				dispatch(actions.login(user));

				api.navigation.navigate('RecoverPasswordFinal');
				
			} catch (err) {
				console.log(err);
				dispatch(actions.error('Не удалось сбросить пароль, попробуйте еще раз'));
			} finally {
				setWaiter(false);
			}
		},
		[userId, dispatch]
	);

	return (
		<DismissKeyboardWrapper style={theme.styles.container}>
			<Formik {...{ initialValues, onSubmit }}>
				{({ values, handleSubmit }) => (
					<SafeAreaView
						style={[theme.styles.flex, theme.styles.paper]}
					>
						<Header title="Забыли пароль?" big />
						<Text
							style={[theme.styles.H3, styles.descriptionText]}
							removeClippedSubviews={false}
							collapsable={false}
						>
							Придумайте и подтвердите новый пароль для входа в
							ваш аккаунт
						</Text>
						<View style={styles.container}>
							<FormikPasswordInput
								name="password"
								label="Введите новый пароль"
								autoCapitalize="none"
							/>
							<FormikPasswordInput
								name="confirm_password"
								label="Подтвердите пароль"
								autoCapitalize="none"
							/>

							<PrimaryButton
								style={styles.button}
								title="Подтвердить"
								onPress={handleSubmit}
								disabled={
									!values.password || !values.confirm_password
								}
							/>
						</View>
						{waiter && <Waiter />}
					</SafeAreaView>
				)}
			</Formik>
		</DismissKeyboardWrapper>
	);
};

const styles = StyleSheet.create({
	button: {
		marginBottom: theme.spacing(4),
	},
	descriptionText: {
		...theme.styles.P2R,
		marginBottom: theme.spacing(8),
		paddingHorizontal: theme.spacing(6),
	},
	container: {
		marginHorizontal: theme.spacing(6),
		padding: theme.spacing(4),
	},
});
