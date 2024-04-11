import { Formik } from 'formik';
import { useDispatch } from 'react-redux';
import { Text, StyleSheet } from 'react-native';
import React, { useCallback, useState } from 'react';

import {
	Paper,
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
	code: '',
};

const ConfirmEmail = ({
	route: {
		params: { email, additionalServicesData, onPressBack },
	},
}) => {

	const { offsetTime, startTimer } = useTimer(
		60,
		'confirmEmailTimerDateStart'
	);

	const dispatch = useDispatch();

	const [waiter, setWaiter] = useState(false);
	
	const onSubmit = useCallback(

		async ({ code }) => {

			setWaiter(true);
			
			try {
				const { error } = await api.web.confirmEmail(code);

				if (error) {
					throw error;
				}

				api.navigation.navigate(
					'ConfirmPhone',
					{
						additionalServicesData,
						onPressBack,
					},
					true
				);

			} catch (err) {
				dispatch(actions.error('Неверный код подтверждения'));
			} finally {
				setWaiter(false);
			}
		},
		[dispatch]
	);

	const submitCode = useCallback(async () => {

		if (offsetTime < 60) {
			return;
		};

		setWaiter(true);

		try {
			const res = await api.web.setEmail(email);

			if (res?.error) {
				throw res.error;
			};

		} catch (err) {

			dispatch(
				actions.error(
					'Не удалось отправить код, попробуйте еще раз'
				)
			);

		} finally {
			setWaiter(false);
			startTimer();
		}
		
	}, [email, startTimer, dispatch, offsetTime]);

	return (
		<DismissKeyboardWrapper style={theme.styles.container}>
			<Formik {...{ initialValues, onSubmit }}>
				{({ values, handleSubmit }) => (
					<SafeAreaView
						top
						bottom
						style={[theme.styles.flex, theme.styles.paper]}
					>
						<Header
							title="Подтвердите ваш email"
							big
							onPressBack={onPressBack || undefined}
						/>
						<Text
							style={[theme.styles.H3, styles.descriptionText]}
							removeClippedSubviews={false}
							collapsable={false}
						>
							На указанный вами email мы выслали 4-х значный код
							подтверждения.
						</Text>
						<Paper style={styles.paper} elevation={0}>
							<FormikInput
								name="code"
								label="Введите код"
								maxLength={4}
								keyboardType="number-pad"
							/>
							<TextButton
								style={styles.textButton}
								title={
									offsetTime == 60
										? 'Отправить код повторно'
										: `Осталось 00:${filterTime(
												offsetTime
										  )}`
								}
								onPress={submitCode}
							/>
							<PrimaryButton
								style={styles.button}
								title="Подтвердить"
								onPress={handleSubmit}
								disabled={values.code.length !== 4}
							/>
						</Paper>
						{waiter && <Waiter />}
					</SafeAreaView>
				)}
			</Formik>
		</DismissKeyboardWrapper>
	);
};

export default ConfirmEmail;

const styles = StyleSheet.create({
	button: {
		marginBottom: theme.spacing(4),
	},
	descriptionText: {
		...theme.styles.P2R,
		marginBottom: theme.spacing(8),
		paddingHorizontal: theme.spacing(6),
	},

	paper: {
		marginHorizontal: theme.spacing(6),
		padding: theme.spacing(4),
	},
	textButton: {
		color: theme.colors.blue,
		marginBottom: theme.spacing(4),
	},
});
