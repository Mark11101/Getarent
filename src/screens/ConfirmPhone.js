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
	FormikMaskedInput,
	DismissKeyboardWrapper,
} from 'components';
import api from 'api';
import actions from 'actions';
import { useTimer } from 'hooks';
import { filterTime } from 'functions';

import theme from 'theme';

const timerName = 'confirmPhoneTimerDateStart';

const ConfirmPhone = ({
	route: {
		params: { additionalServicesData, onPressBack },
	},
}) => {

	const { offsetTime, startTimer } = useTimer(
		60,
		'confirmPhoneTimerDateStart'
	);

	const dispatch = useDispatch();

	const [isFirst, setFirst] = useState(true);
	const [waiter, setWaiter] = useState(false);

	const onSubmit = useCallback(

		async ({ number, code }) => {

			setWaiter(true);

			const normalizedNumber = number.replace(/ /g, '');

			if (isFirst) {
				
				try {
					const res = await api.web.setPhone(normalizedNumber);

					if (res?.error) {
						throw res.error;
					};

					await setFirst(false);

				} catch (err) {
					dispatch(
						actions.error(
							'Не удалось подтвердить номер телефона, попробуйте еще раз'
						)
					);
				} finally {
					setWaiter(false);
				}

				return;
			}

			try {
				const { error } = await api.web.confirmPhone(code);

				if (error) {
					throw error;
				};

				api.navigation.deepNavigate(
					'ProfileRoot', 'GuestRegistration',
					{ additionalServicesData, onPressBack }
				)

			} catch (err) {
				dispatch(actions.error('Неверный код подтверждения'));
			} finally {
				setWaiter(false);
			}
		},
		[dispatch, isFirst]
	);

	const submitCode = useCallback(

		async (phone) => {

			if (offsetTime < 60) {
				return;
			};

			setWaiter(true);

			const date = new Date();

			await api.storage.set(timerName, date.toString());

			try {
				const res = await api.web.setPhone(phone.replace(/ /g, ''));

				if (res?.error) {
					throw res.error;
				}

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
		},
		[offsetTime, startTimer, dispatch]
	);

	const initialValues = {
		number: '',
		code: '',
	};

	return (
		<DismissKeyboardWrapper style={theme.styles.container}>
			<Formik {...{ initialValues, onSubmit }}>
				{({ values, handleSubmit, setFieldValue }) => (
					<SafeAreaView
						top
						bottom
						style={[theme.styles.flex, theme.styles.paper]}
					>
						<Header
							title="Подтвердите ваш телефон"
							big
							onPressBack={onPressBack || undefined}
						/>
						<Text
							style={[theme.styles.H3, styles.descriptionText]}
							removeClippedSubviews={false}
							collapsable={false}
						>
							На указанный вами телефон мы{' '}
							{isFirst ? 'вышлем' : 'выслали'} 4-х значный код
							подтверждения.
						</Text>
						<Paper style={styles.paper} elevation={0}>
							<FormikMaskedInput
								name="number"
								label="Номер телефона"
								type={'custom'}
								options={{
									mask: '+7 999 999 99 99',
								}}
								value={values.number}
								onChangeText={text => {
									setFieldValue('number', text);
								}}
							/>
							{!isFirst && (
								<>
									<TextButton
										style={styles.textButton}
										title={
											offsetTime === 60
												? 'Отправить код повторно'
												: `Осталось 00:${filterTime(
														offsetTime
												  )}`
										}
										onPress={() =>
											submitCode(values.number)
										}
									/>
									<FormikInput
										name="code"
										label="Введите код из смс"
										maxLength={4}
										keyboardType="number-pad"
									/>
								</>
							)}
							<PrimaryButton
								style={styles.button}
								title={isFirst ? 'Выслать код' : 'Подтвердить'}
								onPress={handleSubmit}
								disabled={!isFirst && values.code.length !== 4}
							/>
						</Paper>
						{waiter && <Waiter />}
					</SafeAreaView>
				)}
			</Formik>
		</DismissKeyboardWrapper>
	);
};

export default ConfirmPhone;

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
