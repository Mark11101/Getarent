import { createActions, handleActions } from 'redux-actions';
import * as actionTypes from 'actionTypes';

const defaultState = {};

export const actions = createActions({
	[actionTypes.GET_CITIES]: null,
	[actionTypes.CITIES]: cities => ({ cities }),
});

export default handleActions(
	{
		[actionTypes.CITIES]: (state, { payload }) => ({
			...state,
			...payload,
		}),
	},
	defaultState
);
