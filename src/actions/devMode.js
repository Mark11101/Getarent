import { createActions, handleActions } from 'redux-actions';
import * as actionTypes from 'actionTypes';

const defaultState = true;

export const actions = createActions({
	[actionTypes.DEV_MODE]: (status = false) => status,
	[actionTypes.TOGGLE_DEV_MODE]: null,
});

export default handleActions(
	{
		[actionTypes.DEV_MODE]: (state, { payload }) => payload,
	},
	defaultState
);
