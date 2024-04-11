import { takeLatest, put } from 'redux-saga/effects';
import * as actionTypes from 'actionTypes';
import actions from 'actions';
import api from 'api';

export default function* root() {
	yield takeLatest(actionTypes.CAR_REQUEST, carRequest);
}

export function* carRequest({ payload: { uuid } = {} }) {
	const { car, user, error } = yield api.web.getCarCard(uuid);

	yield put(actions.car(car, user, error));
}
