import { takeLatest, put } from 'redux-saga/effects';
import * as actionTypes from 'actionTypes';
import { getCurrentPosition } from 'functions';
import actions from 'actions';

export default function* root() {
	yield takeLatest(
		actionTypes.INITIAL_LOCATION_REQUEST,
		initialLocationRequest
	);
}

export function* initialLocationRequest() {
	const res = yield getCurrentPosition(),
		location =
			typeof res === 'object'
				? { lon: res.coords.longitude, lat: res.coords.latitude }
				: res;

	yield put(actions.initialLocation(location));
}
