import { createActions, handleActions } from 'redux-actions';
import * as actionTypes from 'actionTypes';
import { addDays, addHours, isBefore, getMinutes, set } from 'date-fns';

const filters = require('constants/filters');

export const sortTypes = {
	POPULAR: 'POPULAR',
	CHEAP: 'CHEAP',
	EXPENSIVE: 'EXPENSIVE',
	SUPERDRIVER: 'SUPERDRIVER',
	REVIEWS: 'REVIEWS',
};

const defaultState = {
	searchBar: false,
	place: false,
	period: { start: null, end: null },
	data: [],
	meta: {},
	error: false,
	refreshing: false,
	waiter: false,
	init: false,
	filtersState: filters.default.initialValues,
	filters: {
		sortType: sortTypes.POPULAR,
	},
	filtersCount: 0,
	searchControlsOffset: 0,
	mapBounds: false,
};

export const actions = createActions({
	[actionTypes.TOGGLE_SEARCH_BAR]: opened => opened,
	[actionTypes.SET_SEARCH_CONTROLS_OFFSET]: offset => offset,
	[actionTypes.SEARCH_SET_PLACE]: (place, preventRequest = false) => ({
		place,
		preventRequest,
	}),
	[actionTypes.SEARCH_SET_MAP_BOUNDS]: (bounds, preventRequest) => ({
		bounds,
		preventRequest,
	}),
	[actionTypes.SEARCH_SET_PERIOD]: (start, end, preventRequest = false) => ({
		period: { start, end },
		preventRequest,
	}),
	[actionTypes.SET_FILTERS]: filter => ({ filter }),
	[actionTypes.SEARCH_SET_FILTERS]: filtersState => ({ filtersState }),
	[actionTypes.SEARCH_RESET_FILTERS]: null,
	[actionTypes.SEARCH_REQUEST]: refreshing => ({ refreshing }),
	[actionTypes.SEARCH]: (
		data = [],
		meta = {},
		bounds = false,
		error = false
	) => ({
		data,
		meta,
		bounds,
		error,
	}),
});

export default handleActions(
	{
		[actionTypes.TOGGLE_SEARCH_BAR]: (state, { payload }) => ({
			...state,
			searchBar: payload,
		}),
		[actionTypes.SET_SEARCH_CONTROLS_OFFSET]: (state, { payload }) => ({
			...state,
			searchControlsOffset: payload,
		}),
		[actionTypes.SEARCH_SET_PLACE]: (state, { payload: { place } }) => {
			const period = state.period;
			const now =  new Date();
			const minutes = getMinutes(now)
			let nowRounded = now;

			if (minutes >=0 && minutes <=29 ) {
				nowRounded = set(now, {minutes: 30, seconds: 0, milliseconds: 0})
			} else {
				nowRounded = set(addHours(now, 1), {minutes: 0, seconds: 0, milliseconds: 0})
			}

			if (!period.start || isBefore(period.start, nowRounded)) {
				period.start = nowRounded
			}

			if (!period.end || isBefore(period.end, period.start)) {
				period.end = addDays(period.start, 3);
			}

			return {
				...state,
				place,
				period,
			}
		},
		[actionTypes.SEARCH_SET_MAP_BOUNDS]: (
			state,
			{ payload: { bounds } }
		) => ({
			...state,
			mapBounds: bounds,
		}),
		[actionTypes.SEARCH_SET_PERIOD]: (state, { payload: { period } }) => ({
			...state,
			period,
		}),
		[actionTypes.SET_FILTERS]: (state, { payload: { filter } }) => {

			return { 
				...state, 
				filters: {
					...state.filters,
					...filter,
				}, 
			};
		},
		[actionTypes.SEARCH_SET_FILTERS]: searchSetFiltersReducer,
		[actionTypes.SEARCH_RESET_FILTERS]: state => {
			const { filtersState, filters, filtersCount } = defaultState;

			return { ...state, filtersState, filters, filtersCount };
		},
		[actionTypes.SEARCH_REQUEST]: (state, { payload: { refreshing } }) => ({
			...state,
			[refreshing ? 'refreshing' : 'waiter']: true,
		}),
		[actionTypes.SEARCH]: (
			state,
			{ payload: { data, meta, bounds, error } }
		) => ({
			...state,
			place: {
				...state.place,
				bounds: bounds || state.place?.bounds || false,
			},
			data,
			meta,
			error,
			init: true,
			waiter: false,
			refreshing: false,
		}),
	},
	defaultState
);

function searchSetFiltersReducer(state, { payload: { filtersState } }) {
	const equals = (a, b) => JSON.stringify(a) === JSON.stringify(b),
		diff = Object.keys(initialValues).reduce(
			(res, name) => {
				const current = filtersState[name],
					initialCurrent = initialValues[name];

				if (!equals(initialCurrent, current)) {
					if (typeof current !== 'object') {
						res.filters[name] = current;
						res.count++;
					} else {
						const arr = Object.keys(current).filter(
								key => current[key]
							),
							{ length } = arr;

						if (length) {
							res.filters[name] = arr;
							res.count += length;
						}
					}
				}

				return res;
			},
			{ filters: {}, count: 0 }
		);

	return {
		...state,
		filtersState,
		filtersCount: diff.count,
		filters: diff.filters,
	};
}
