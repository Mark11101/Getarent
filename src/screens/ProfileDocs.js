import {
	Text,
	View,
	CheckBox,
	StyleSheet,
	ScrollView,
	SafeAreaView,
} from 'react-native';
import { Formik } from 'formik';
import { useDispatch } from 'react-redux';
import React, { useCallback } from 'react';

import {
	Paper,
	Header,
	TextButton,
	FormikInput,
	PrimaryButton,
} from 'components';
import api from 'api';
import actions from 'actions';

import theme from 'theme';

const Signup = () => {

	const dispatch = useDispatch();
	
	const onSubmit = useCallback(

		(values) => {

			dispatch(actions.searchSetFilters(values));
			// prevent Switch glitch.
			setTimeout(() => api.navigation.goBack());
		},
		[dispatch]
	);

	return (
		<Formik {...{ onSubmit }}>
			<SafeAreaView style={[theme.styles.flex, theme.styles.paper]}>
				<ScrollView keyboardShouldPersistTaps="handled">
					<Header title="Ваши данные" big />
					<Text style={styles.descriptionText}>
						Заполните форму вашими данными. Все данные будут
						сохранены в ваш личный аккаунт
					</Text>
					<Paper style={styles.paper} elevation={0}>
						<Text style={theme.styles.P1}>
							Паспорт
						</Text>
						<FormikInput
							name="passportNumber"
							label="Серия и номер паспорта"
							placeholder="Введите без пробело"
						/>
						<FormikInput
							name="passportDate"
							label="Дата выдачи"
							placeholder="дд.мм.гггг"
						/>
						<FormikInput
							name="passportPlace"
							label="Адрес регистрации"
							placeholder="Как указано в паспорте"
						/>

						<Text style={theme.styles.P1}>
							Водительское удостоверение
						</Text>
						<FormikInput
							name="licenseNumber"
							label="Серия и номер"
							placeholder="Введите без пробело"
						/>
						<FormikInput
							name="licenseDate"
							label="Дата выдачи"
							placeholder="дд.мм.гггг"
						/>
						<FormikInput
							name="licenseDate"
							label="Если вы меняли права, укажите год выдачи первых прав"
							placeholder="дд.мм.гггг"
						/>
						<View style={styles.policyContainer}>
							<View>
								<CheckBox value={false} />
							</View>
							<View style={styles.policyTextContainer}>
								<Text style={styles.policyText}>
									Я прочитал и согласен с
									<TextButton
										style={styles.policyTextButton}
										title="Политикой обработки персональных данных"
										onPress={() =>
											api.navigation.navigate(
												'DocumentPopup',
												{
													uri:
														'https://storage.yandexcloud.net/getarent-documents-bucket/c6364667735bbdaf.pdf',
												}
											)
										}
									/>
								</Text>
							</View>
						</View>
						<PrimaryButton
							style={styles.button}
							title="Продолжить"
							onPress={onSubmit}
						/>
					</Paper>
				</ScrollView>
			</SafeAreaView>
		</Formik>
	);
};

export default Signup

const styles = StyleSheet.create({
	button: {
		marginBottom: theme.spacing(4),
	},
	descriptionText: {
		...theme.styles.P2R,
		marginHorizontal: theme.spacing(6),
		paddingHorizontal: theme.spacing(4),
	},
	paper: {
		marginHorizontal: theme.spacing(6),
		padding: theme.spacing(4),
	},
	policyContainer: {
		display: 'flex',
		flexDirection: 'row',
		marginBottom: theme.spacing(4),
	},
	policyText: {
		...theme.styles.P1R,
		marginLeft: theme.spacing(2),
		marginTop: theme.spacing(2),
	},
	policyTextButton: {
		...theme.styles.P1R,
		color: theme.colors.blue,
	},
	policyTextContainer: {
		lineHeight: theme.normalize(8),
	},
});
