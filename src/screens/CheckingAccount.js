import { Formik } from 'formik';
import { useDispatch } from 'react-redux';
import React, { useCallback, useState } from 'react';
import { StyleSheet, SafeAreaView, ScrollView } from 'react-native';

import {
	Paper,
	Waiter,
	Header,
	FormikInput,
	PrimaryButton,
	FormikMaskedInput,
} from 'components';
import api from '../api';
import actions from '../actions';

import theme from 'theme';

const initialValues = {
	companyName: '',
	inn: '',
	kpp: '',
	bik: '',
	bankName: '',
	corrAccountNumber: '',
	accountNumber: '',
};

const checkProperties = (obj) => {

	for (let key in obj) {

		if (!obj[key]) {
			return false;
		};
	};

	return true;
};

export default function CheckingAccount() {

	const dispatch = useDispatch();

	const [waiter, setWaiter] = useState(false);

	const onSubmit = useCallback(

		( values ) => {

			setWaiter(true);
			
			api.web
				.paymentsAccount(values)
				.then(async ({ error }) => {

					if (error) {
						throw error;
					};

					api.navigation.navigate('ProfilePayments');
					
					setWaiter(false);
				})
				.catch(() => {
					
					dispatch(actions.error('Не удалось привязать данные, попробуйте еще раз'));
					setWaiter(false);
				});
		},
		[dispatch]
	);

	return (
		<Formik {...{ initialValues, onSubmit }}>
			{({ values, handleSubmit }) => (
				<SafeAreaView style={[theme.styles.flex, theme.styles.paper]}>
					<ScrollView keyboardShouldPersistTaps="handled">
						<Header title="Расчетный счет" />

						<Paper style={styles.paper} elevation={0}>
							<FormikInput
								name="companyName"
								label="Получатель"
							/>

							<FormikMaskedInput
								name="inn"
								label="ИНН"
								type={'custom'}
								options={{
									mask: '999999999999',
								}}
							/>

							<FormikMaskedInput
								name="kpp"
								label="КПП"
								type={'custom'}
								options={{
									mask: '999999999',
								}}
							/>

							<FormikMaskedInput
								name="bik"
								label="БИК"
								type={'custom'}
								options={{
									mask: '999999999',
								}}
							/>

							<FormikInput
								name="bankName"
								label="Банк получатель"
							/>

							<FormikMaskedInput
								name="corrAccountNumber"
								label="Корреспондентский счет банка"
								type={'custom'}
								options={{
									mask: '99999999999999999999',
								}}
							/>

							<FormikMaskedInput
								name="accountNumber"
								label="Номер расчетного счета"
								type={'custom'}
								options={{
									mask: '99999999999999999999',
								}}
							/>

							<PrimaryButton
								style={styles.button}
								title="Привязать"
								disabled={!checkProperties(values)}
								onPress={handleSubmit}
							/>
						</Paper>
					</ScrollView>
					{waiter && <Waiter />}
				</SafeAreaView>
			)}
		</Formik>
	);
}

const styles = StyleSheet.create({
	button: {
		marginBottom: theme.spacing(4),
	},
	paper: {
		marginHorizontal: theme.spacing(6),
	},
});
