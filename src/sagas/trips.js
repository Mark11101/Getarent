import { takeLatest, put, select } from 'redux-saga/effects';
import * as actionTypes from 'actionTypes';
import actions from 'actions';
import api from 'api';

export default function* root() {
	yield takeLatest(
		[actionTypes.TRIPS_REQUEST, actionTypes.TRIPS_RESET],
		tripsRequest
	);
}

export function* tripsRequest({ type, payload: { role, status } = {} }) {
	if (type === actionTypes.TRIPS_RESET) {
		return;
	}

	let trips = [],
		error;

	const authorized = yield select(st => st.profile.authorized);

	if (authorized) {
		({ trips, error } = yield api.web.getTrips(role, status));

		if (error && api.navigation.getCurrentRouteName() === 'Trips') {
			yield put(actions.error(error));
		}
	}

	yield put(actions.trips(trips, error));
}
