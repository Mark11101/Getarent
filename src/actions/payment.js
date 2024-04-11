import { createActions, handleActions, combineActions } from 'redux-actions';
import * as actionTypes from 'actionTypes';

const defaultState = {
	rentId: false,
	orderId: false,
	paymentUrl: false,
	paymentCard: false,
	paymentScreenData: false,
	waiter: false,
};

export const actions = createActions({
	[actionTypes.CREATE_RENT]: (
		createRentRequestParams = [],
	) => ({ createRentRequestParams }),
	[actionTypes.PAYMENT_REQUEST]: (
		createRentRequestParams = [],
		repeat = false
	) => ({ createRentRequestParams, repeat }),
	[actionTypes.PAYMENT_SET_RENT_ID]: rentId => ({ rentId }),
	[actionTypes.PAYMENT_SET_ORDER_ID]: orderId => ({ orderId }),
	[actionTypes.PAYMENT_SET_PAYMENT_URL]: paymentUrl => ({ paymentUrl }),
	[actionTypes.PAYMENT]: success => ({ success }),
	[actionTypes.PAYMENT_RESET]: rentId => ({ rentId }),
	[actionTypes.BANK_CARD_REQUEST]: () => ({}),
	[actionTypes.SET_BANK_CARD]: paymentCard => ({ paymentCard }),
	[actionTypes.ATTACH_BANK_CARD]: (stage, rentId) => ({ stage, rentId }),
	[actionTypes.DETACH_BANK_CARD]: () => ({}),
	[actionTypes.RESET_BANK_CARD]: () => ({}),
	[actionTypes.SET_PAYMENT_URL]: paymentUrl => ({ paymentUrl }),
	[actionTypes.SET_PAYMENT_SCREEN_DATA]: paymentScreenData => ({ paymentScreenData }),
	[actionTypes.PAY_FOR_RENT]: rentId => ({ rentId }),
	[actionTypes.RESET_PAYMENT_WAITER]: () => ({}),
});

export default handleActions(
	{
		[actionTypes.CREATE_RENT]: state => ({ ...state, waiter: true }),
		[actionTypes.PAYMENT_REQUEST]: state => ({ ...state, waiter: true }),
		[combineActions(
			actionTypes.PAYMENT_SET_RENT_ID,
			actionTypes.PAYMENT_SET_ORDER_ID,
			actionTypes.PAYMENT_SET_PAYMENT_URL
		)]: (state, { payload }) => ({
			...state,
			...payload,
			waiter: false,
		}),
		[actionTypes.PAYMENT_RESET]: () => defaultState,
		[actionTypes.BANK_CARD_REQUEST]: state => ({ ...state }),
		[actionTypes.ATTACH_BANK_CARD]: state => ({ ...state, waiter: true }),
		[actionTypes.DETACH_BANK_CARD]: state => ({ ...state }),
		[actionTypes.SET_BANK_CARD]: (state, { payload }) => ({ ...state, ...payload }),
		[actionTypes.RESET_BANK_CARD]: (state) => ({ ...state, paymentCard: false }),
		[actionTypes.SET_PAYMENT_URL]: (state, { payload }) => ({ ...state, ...payload, waiter: false }),
		[actionTypes.SET_PAYMENT_SCREEN_DATA]: (state, { payload }) => ({ ...state, ...payload }),
		[actionTypes.PAY_FOR_RENT]: (state, { payload }) => ({ ...state, ...payload }),
		[actionTypes.RESET_PAYMENT_WAITER]: state => ({ ...state, waiter: false }),
	},
	defaultState
);
