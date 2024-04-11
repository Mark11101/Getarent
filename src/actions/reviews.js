import { createActions, handleActions } from 'redux-actions';
import * as actionTypes from 'actionTypes';

const defaultState = {
	reviews: []
};

export const actions = createActions({
	[actionTypes.GET_BEST_REVIEWS]: null,
	[actionTypes.BEST_REVIEWS]: reviews => ({ reviews }),
});

export default handleActions(
	{
		[actionTypes.BEST_REVIEWS]: (state, { payload }) => ({
			...state,
			...payload,
		}),
	},
	defaultState
);
