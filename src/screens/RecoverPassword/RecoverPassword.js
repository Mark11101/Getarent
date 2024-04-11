import { Formik } from 'formik';
import { useDispatch } from 'react-redux';
import React, { useCallback, useState } from 'react';
import { Text, StyleSheet, View, Alert } from 'react-native';

import {
	Header,
	Waiter,
	TextButton,
	FormikInput,
	SafeAreaView,
	PrimaryButton,
	DismissKeyboardWrapper,
} from 'components';
import api from 'api';
import actions from 'actions';
import { useTimer } from 'hooks';
import { filterTime } from 'functions';

import theme from 'theme';

const initialValues = {
	email: '',
	code: '',
};

export const RecoverPassword = () => {

	const { offsetTime, startTimer } = useTimer(
		60,
		'confirmRecoverTimerDateStart'
	);

	const dispatch = useDispatch();

	const [waiter, setWaiter] = useState(false);
	const [isFirst, setFirst] = useState(true);
	const [userId, setUserId] = useState();

	const onSubmit = useCallback(

			async ({ email, code }) => {

				setWaiter(true);

				try {

					if (isFirst) {

						const { id, error } = await api.web.recoverPassword(
							email
						);

						if (error) {

							error.statusCode === 404
							&&
								Alert.alert('', 'Пользователь с таким email не найден');

							console.log(error);

							throw error;
						}

						setFirst(false);
						setUserId(id);

						return;
					}

					const res = await api.web.confirmRecoverPassword(
						userId,
						code
					);

					if (res?.error) {

						res.error.statusCode === 400
						&&
							Alert.alert('', 'Неверный код подтверждения');

						console.log(error);
						
						throw res.error;
					}

					api.navigation.navigate('RecoverPasswordNew', { userId });

				} catch (err) {
					dispatch(actions.error('Не удалось сбросить пароль, попробуйте еще раз'));
				} finally {
					setWaiter(false);
				}
			},
			[isFirst, userId, dispatch]
		);

	const submitCode = useCallback(

		async (email) => {

			if (offsetTime < 60) {
				return;
			}

			setWaiter(true);

			try {
				const { id, error } = await api.web.recoverPassword(email);

				if (error) {
					throw error;
				}

				setUserId(id);

			} catch (err) {
				dispatch(actions.error('Не удалось сбросить пароль, попробуйте еще раз'));
			} finally {
				
				startTimer();
				setWaiter(false);
			}
		},
		[offsetTime, startTimer, dispatch]
	);

	return (
		<DismissKeyboardWrapper style={theme.styles.container}>
			<Formik {...{ initialValues, onSubmit }}>
				{({ values, handleSubmit }) => (
					<SafeAreaView
						top
						bottom
						style={[theme.styles.flex, theme.styles.paper]}
					>
						<Header title="Забыли пароль?" big />
						<Text
							style={[theme.styles.H3, styles.descriptionText]}
							removeClippedSubviews={false}
							collapsable={false}
						>
							На указанный вами e-mail мы вышлем 4-х значный код
							подтверждения
						</Text>
						<View style={styles.container}>
							<FormikInput
								name="email"
								label="Введите e-mail"
								placeholder="example@mail.ru"
								autoCapitalize="none"
								autoCompleteType="email"
								keyboardType="email-address"
							/>
							{!isFirst && (
								<>
									<FormikInput
										name="code"
										label="Введите код"
										maxLength={4}
										keyboardType="number-pad"
									/>
									<TextButton
										style={styles.textButton}
										title={
											offsetTime === 60
												? 'Отправить код повторно'
												: `Осталось 00:${filterTime(
														offsetTime
												  )}`
										}
										onPress={() => submitCode(values.email)}
									/>
								</>
							)}
							<PrimaryButton
								style={styles.button}
								title={isFirst ? 'Выслать код' : 'Подтвердить'}
								onPress={handleSubmit}
								disabled={
									isFirst
										? !values.email
										: values.code.length !== 4
								}
								keyboardType="number-pad"
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
	textButton: {
		marginTop: theme.spacing(-4),
		marginBottom: theme.spacing(8),
	}
});
