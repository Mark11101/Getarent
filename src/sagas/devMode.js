import { all, takeLatest, select, put } from 'redux-saga/effects';
import * as actionTypes from 'actionTypes';
import actions from 'actions';
import api from 'api';

export default function* root() {
	yield all([
		takeLatest(actionTypes.DEV_MODE, devMode),
		takeLatest(actionTypes.TOGGLE_DEV_MODE, toggleDevMode),
	]);
}

export function* devMode({ payload: status }) {
	api.web.toggleBaseURL(status);

	yield api.storage.set('devMode', status);
}

export function* toggleDevMode() {
	const status = yield select(st => st.devMode);

	yield put(actions.devMode(!status));
}
