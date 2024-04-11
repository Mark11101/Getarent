import { createActions, handleActions } from 'redux-actions';
import * as actionTypes from 'actionTypes';

const defaultState = {};

export const actions = createActions({
	[actionTypes.GET_SERVICE_STATS]: null,
	[actionTypes.SERVICE_STATS]: serviceStats => ({ serviceStats }),
});

export default handleActions(
	{
		[actionTypes.SERVICE_STATS]: (state, { payload }) => ({
			...state,
			...payload,
		}),
	},
	defaultState
);
