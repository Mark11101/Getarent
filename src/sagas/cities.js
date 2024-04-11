import { takeEvery, put } from 'redux-saga/effects';
import * as actionTypes from 'actionTypes';
import actions from 'actions';
import api from 'api';

export default function* root() {
	yield takeEvery(actionTypes.GET_CITIES, citiesRequest);
};

export function* citiesRequest() {
	const cities = yield api.web.getCities();

	yield put(actions.cities(cities));
};
