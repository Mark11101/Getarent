import { takeLatest, put, select } from 'redux-saga/effects';
import * as actionTypes from 'actionTypes';
import actions from 'actions';
import api from 'api';

export default function* root() {
	yield takeLatest(
		[actionTypes.RENT_ROOM_REQUEST, actionTypes.RENT_ROOM_RESET],
		rentRoomRequest
	);
}

export function* rentRoomRequest({ type, payload: { uuid, role } = {} }) {
	if (type === actionTypes.RENT_ROOM_RESET) {
		return;
	}

	let contentInfo = {};

	try {
		const {data: loadedContentInfo} = yield api.web.getRentDetailPageInfo();
		contentInfo = loadedContentInfo || {};
	} catch (e) {
		console.log(e);
	}

	const { car, rent,preRentalInspection,postRentalInspection, host, guest, driver, bill, error } =
		yield api.web.getRentRoom(uuid, role);

	yield put(actions.rentRoom(car, rent, preRentalInspection,postRentalInspection, host, guest, driver, bill,contentInfo, error));
}
