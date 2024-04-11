import { debounce, select, put } from 'redux-saga/effects';
import * as actionTypes from 'actionTypes';
import actions from 'actions';
import api from 'api';

export default function* root() {
	yield debounce(500, actionTypes.SUGGEST_REQUEST, suggestRequest);
}

export function* suggestRequest({ payload: { query } }) {
	const { location } = yield select(st => st.location),
		{ data, error } = query
			? yield api.web.suggest(query, location)
			: { data: [] };

	if (Array.isArray(data)) {
		yield put(actions.suggest(data));
	} else {
		yield put(
			actions.suggest(
				[],
				error ? JSON.stringify(error, null, 4) : 'Что-то пошло не так'
			)
		);
	}
}
