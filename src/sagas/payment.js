import { all, takeLatest, put, select } from 'redux-saga/effects';
import * as actionTypes from 'actionTypes';
import actions from 'actions';
import api from 'api';
import { ERROR_CODES } from "../errorCodes";
import { Alert } from "react-native";

export default function* root() {
	yield all([
		takeLatest(actionTypes.CREATE_RENT, createRent),
		takeLatest(actionTypes.PAYMENT_REQUEST, paymentRequest),
		takeLatest(actionTypes.PAYMENT, payment),
		takeLatest(actionTypes.PAYMENT_RESET, paymentReset),
		takeLatest(actionTypes.BANK_CARD_REQUEST, bankCardRequest),
		takeLatest(actionTypes.ATTACH_BANK_CARD, attachBankCard),
		takeLatest(actionTypes.DETACH_BANK_CARD, detachBankCard),
		takeLatest(actionTypes.PAY_FOR_RENT, payForRent),
	]);
}

export function* paymentRequest({
	payload: { createRentRequestParams, repeat } = {},
}) {
	let error, ok, paymentUrl, rentId, orderId;

	({ rentId, orderId, paymentUrl } = yield select(st => st.payment));

	if (!rentId) {
		({ error, ok, paymentUrl, rentId } = yield api.web.createRent(
			...createRentRequestParams
		));

		yield put(actions.paymentSetRentId(rentId));
	} else if (orderId) {
		({ error, ok, paymentUrl } = yield api.web.createRepeatedPayment(
			rentId,
			orderId
		));
	}

	yield put(actions.paymentSetPaymentUrl(paymentUrl));

	if (error) {
        if (error.statusCode === 400) {
            switch (error?.message) {
                case 'Requested Rent dates overlap with existing':
                    return yield put(actions.error('Машина уже арендована на эту дату'))
                case 'Requested Rent Duration is longer than maximum allowed on Car.':
                    return yield put(actions.error('Слишком много дней аренды для этой машины'))
                case 'Requested Rent Duration is shorter than minimum allowed on Car.':
                    return yield put(actions.error('Слишком мало дней аренды для этой машины'))
                case 'Requested dates are in past':
                    return yield put(actions.error('Время создания аренды истекло. Пожалуйста, забронируйте машину еще раз'))
                default:
                    return yield put(actions.error('Извините, данная машина недоступна для бронирования'))

            }
        } else {
            return yield put(actions.error('Извините, данная машина недоступна для бронирования'))
        };
	} else {
		yield put(actions.paymentReset(rentId));
	}

	if (paymentUrl) {
		(repeat ? api.navigation.replace : api.navigation.navigate)(
			'Payment',
			{
				rentId,
				paymentUrl,
			},
			true
		);
	}
}

export function* payment({ payload: { success } }) {
	const { rentId } = yield select(st => st.payment);

	if (success) {
		return yield put(actions.paymentReset(rentId));
	}

	api.navigation.replace('PaymentFailed');
}

export function paymentReset({ payload: { rentId } }) {
	if (rentId) {
		api.navigation.navigate('PaymentSuccess', { uuid: rentId }, true);
	}
}

export function* bankCardRequest() {

	const res = yield api.web.getBankCard();

	if (res?.error) {
		yield put(actions.resetBankCard());
	} else {
		yield put(actions.setBankCard(res));
	}
}

export function* attachBankCard({ payload: { stage, rentId } }) {

	const { paymentUrl, error } = yield api.web.attachBankCard(stage);

	if (error) {
		console.log(error)
		yield put(actions.resetPaymentWaiter())
		yield put(actions.error('Не удалось связаться с банком-эмитентом, попробуйте еще раз'));
	} else {

		yield put(actions.setPaymentUrl(paymentUrl));

		yield api.navigation.navigate(
			'Payment',
			{
				rentId,
				paymentUrl,
			},
			true
		);
	}
}

export function* detachBankCard({ payload: { stage } }) {
	const { error = null } = yield api.web.detachBankCard(stage);

	if (error) {
		const errorMsg = ERROR_CODES[error.code] || 'Не удалось отвязать карту, попробуйте еще раз';
		yield put(actions.error(errorMsg));
	} else {
		yield put(actions.resetBankCard());

		Alert.alert(
			'Платежные данные',
			`Банковская карта успешно отвязана`,
			[
				{ text: 'Ок' },
			]
		)
	}
}

export function* createRent({
	payload: { createRentRequestParams } = {},
}) {
	({ rentId } = yield api.web.createRent(
		...createRentRequestParams
	));

	if (rentId) {

		yield put(actions.paymentSetRentId(rentId));
        yield put(actions.searchRequest()); // to update cars list

		api.navigation.navigate('Catalog');
		api.navigation.navigate('RentRoom', { uuid: rentId }, true);
	}
}

export function* payForRent({ payload: { rentId } }) {

	const { res } = yield api.web.payForRent(rentId);
}
