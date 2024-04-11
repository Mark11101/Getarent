import { createActions, handleActions } from 'redux-actions';
import * as actionTypes from 'actionTypes';

const defaultState = {
	car: {},
	rent: {},
	host: {},
	guest: {},
	bill: [],
	contentInfo: {},
	waiter: false,
	refreshing: false,
};

export const actions = createActions({
	[actionTypes.RENT_ROOM_REQUEST]: (uuid, role, refreshing = false) => ({
		uuid,
		role,
		refreshing,
	}),
	[actionTypes.RENT_ROOM]: (
		car,
		rent,
		preRentalInspection,
		postRentalInspection,
		host,
		guest,
		driver,
		bill,
		contentInfo,
		error = false
	) => ({
		car,
		rent,
		preRentalInspection,
		postRentalInspection,
		host,
		guest,
		driver,
		bill,
		contentInfo,
		error,
	}),
	[actionTypes.RENT_ROOM_RESET]: null,
});

export default handleActions(
	{
		[actionTypes.RENT_ROOM_REQUEST]: (
			state,
			{ payload: { uuid, role, refreshing } }
		) => ({
			...state,
			uuid,
			role,
			refreshing,
			waiter: refreshing ? false : true,
		}),
		[actionTypes.RENT_ROOM]: (
			state,
			{ payload: { car, rent,preRentalInspection,postRentalInspection, host, guest, driver, bill, contentInfo, error } }
		) => ({
			car,
			rent,
			preRentalInspection,
			postRentalInspection,
			host,
			guest,
			driver,
			bill,
			contentInfo,
			error,
			waiter: false,
			refreshing: false,
		}),
		[actionTypes.RENT_ROOM_RESET]: () => defaultState,
	},
	defaultState
);
