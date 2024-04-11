import { takeEvery, put } from 'redux-saga/effects';
import * as actionTypes from 'actionTypes';
import actions from 'actions';
import api from 'api';

export default function* root() {
	yield takeEvery(actionTypes.GET_SERVICE_STATS, serviceStatsRequest);
}

export function* serviceStatsRequest() {
	const serviceStats = yield api.web.getServiceStats();

	yield put(actions.serviceStats(serviceStats));
}
