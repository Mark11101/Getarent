import { createActions, handleActions } from 'redux-actions';
import * as actionTypes from 'actionTypes';

const defaultState = {
	trips: [],
	error: false,
	waiter: false,
	refreshing: false,
	init: false,
};

export const actions = createActions({
	[actionTypes.TRIPS_REQUEST]: (role, status, refreshing = false) => ({
		role,
		status,
		refreshing,
	}),
	[actionTypes.TRIPS]: (trips = [], error = false) => ({ trips, error }),
	[actionTypes.TRIPS_RESET]: null,
});

export default handleActions(
	{
		[actionTypes.TRIPS_REQUEST]: (state, { payload: { refreshing } }) => ({
			...state,
			waiter: !refreshing,
			refreshing,
		}),
		[actionTypes.TRIPS]: (state, { payload: { trips, error } }) => ({
			...state,
			trips,
			error,
			waiter: false,
			refreshing: false,
			init: true,
		}),
		[actionTypes.TRIPS_RESET]: () => defaultState,
	},
	defaultState
);
