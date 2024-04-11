import { createActions, handleActions } from 'redux-actions';
import * as actionTypes from 'actionTypes';

const defaultState = {
	dateStart: false,
	dateEnd: false,
	deliveryPlace: null,
	car: {},
	user: {},
	error: false,
	waiter: false,
	refreshing: false,
};

export const actions = createActions({
	[actionTypes.CAR_REQUEST]: (uuid, refreshing = false) => ({
		uuid,
		refreshing,
	}),
	[actionTypes.CAR]: (car = {}, user = {}, error = false) => ({
		// TODO: remove it, replace with BE logic
		car: { ...car, reviews: car?.reviews/* .reverse() */ },
		user,
		error,
	}),
	[actionTypes.CAR_SET_PERIOD]: (dateStart, dateEnd) => ({
		dateStart,
		dateEnd,
	}),
	[actionTypes.CAR_SET_DELIVERY_PLACE]: deliveryPlace => ({ deliveryPlace }),
	[actionTypes.CAR_RESET]: null,
});

export default handleActions(
	{
		[actionTypes.CAR_REQUEST]: (
			state,
			{ payload: { uuid, refreshing } }
		) => ({
			...state,
			uuid,
			refreshing,
			waiter: refreshing ? false : true,
		}),
		[actionTypes.CAR]: (state, { payload: { car, user, error } }) => ({
			...state,
			car,
			user,
			error,
			waiter: false,
			refreshing: false,
		}),
		[actionTypes.CAR_SET_PERIOD]: (state, { payload }) => ({
			...state,
			...payload,
		}),
		[actionTypes.CAR_SET_DELIVERY_PLACE]: (state, { payload }) => ({
			...state,
			...payload,
		}),
		[actionTypes.CAR_RESET]: () => defaultState,
	},
	defaultState
);
