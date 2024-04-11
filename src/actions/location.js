import { createActions, handleActions } from 'redux-actions';
import * as actionTypes from 'actionTypes';

const defaultState = {
	waiter: false,
	location: false,
};

export const actions = createActions({
	[actionTypes.INITIAL_LOCATION_REQUEST]: null,
	[actionTypes.INITIAL_LOCATION]: location => ({ location }),
});

export default handleActions(
	{
		[actionTypes.INITIAL_LOCATION_REQUEST]: state => ({
			...state,
			waiter: true,
		}),
		[actionTypes.INITIAL_LOCATION]: (state, { payload: { location } }) => ({
			...state,
			location,
			waiter: false,
		}),
	},
	defaultState
);
