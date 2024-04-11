import { createActions, handleActions } from 'redux-actions';
import * as actionTypes from 'actionTypes';

const defaultState = {
	query: '',
	list: [],
	init: false,
	waiter: false,
	refreshing: false,
};

export const actions = createActions({
	[actionTypes.SUGGEST_REQUEST]: (query, refreshing = false) => ({
		query,
		refreshing,
	}),
	[actionTypes.SUGGEST]: (list, error = false) => ({ list, error }),
	[actionTypes.SUGGEST_SET_QUERY]: query => ({ query }),
	[actionTypes.SUGGEST_RESET]: null,
});

export default handleActions(
	{
		[actionTypes.SUGGEST_REQUEST]: (
			state,
			{ payload: { query, refreshing } }
		) => ({
			...state,
			query,
			refreshing,
			waiter: refreshing ? false : true,
		}),
		[actionTypes.SUGGEST]: (state, { payload: { list, error } }) => ({
			...state,
			list,
			error,
			init: true,
			waiter: false,
			refreshing: false,
		}),
		[actionTypes.SUGGEST_SET_QUERY]: (state, { payload }) => ({
			...state,
			...payload,
		}),
		[actionTypes.SUGGEST_RESET]: () => defaultState,
	},
	defaultState
);
