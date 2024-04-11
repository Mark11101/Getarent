import { all, takeLatest, select, put } from 'redux-saga/effects';
import * as actionTypes from 'actionTypes';
import actions from 'actions';
import api from 'api';

const normalizeBounds = ({ sw, ne } = {}) => ({
	southWest: [sw?.lon, sw?.lat],
	northEast: [ne?.lon, ne?.lat],
});

export default function* root() {
	yield all([
		takeLatest(
			[
				actionTypes.SEARCH_REQUEST,
				actionTypes.SEARCH_SET_FILTERS,
				actionTypes.SEARCH_RESET_FILTERS,
			],
			searchRequest
		),
		takeLatest(
			[
				actionTypes.SEARCH_SET_PERIOD,
				actionTypes.SEARCH_SET_PLACE,
				actionTypes.SEARCH_SET_MAP_BOUNDS,
			],
			setParams
		),
	]);
}

export function* searchRequest() {
	const {
			period: { start, end },
			filters,
			place,
			mapBounds,
		} = yield select(st => st.search),
		currentRoute = api.navigation.getCurrentRoute(),
		isMapScreen =
			currentRoute.name === 'Map' || !!currentRoute.params?.fromMap,
		{ data, meta, error } = yield api.web.search(
			start,
			end,
			filters,
			!isMapScreen && place.location,
			isMapScreen ? mapBounds : place?.location ? false : place?.bounds
		);
	yield put(
		actions.search(
			data,
			meta,
			isMapScreen ? false : normalizeBounds(meta?.bounds),
			error
		)
	);
}

export function* setParams({ payload: { preventRequest } }) {
	if (preventRequest) {
		return;
	}

	yield put(actions.searchRequest());
}
