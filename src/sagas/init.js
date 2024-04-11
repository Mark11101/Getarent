import { takeLatest, put } from 'redux-saga/effects';
import * as actionTypes from 'actionTypes';
import SplashScreen from 'react-native-splash-screen';
import actions from 'actions';
import api from 'api';

export default function* root() {
	yield takeLatest(actionTypes.APP_DID_MOUNT, init);
}

export function* init() {
	const { devMode = false } = yield api.storage.get('devMode');

	yield put(actions.devMode(devMode));

	SplashScreen.hide();

	const { refresh } = yield api.auth.getToken();
	const { profile } = yield api.storage.get('profile');

	if (!refresh || !profile) {
		return;
	}

	if (profile) {
		yield put(actions.login(profile));
	}
}
