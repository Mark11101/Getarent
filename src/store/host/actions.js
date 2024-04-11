import { createActions, handleActions } from 'redux-actions'
import * as actionTypes from './actionTypes'

const defaultState = {
	loading: false,
	paymentMethod: null,
	preferences: {
		rentalAgreement: null,
		workingHours: null,
		bio: null
	}
}

export const actions = createActions({
	[actionTypes.SET_HOST_LOADER]: loading => Boolean(loading),
	[actionTypes.LOAD_HOST_PREFERENCES_REQUEST]: () => null,
	[actionTypes.LOAD_HOST_PREFERENCES]: prefs => prefs,
	[actionTypes.LOAD_HOST_PAYMENT_METHOD_REQUEST]: () => null,
	[actionTypes.SET_HOST_PAYMENT_METHOD_REQUEST]: (data, isIndividual) => ({ ...data, isIndividual }),
	[actionTypes.SET_HOST_PAYMENT_METHOD]: payload => Array.isArray(payload) ? payload[0] : payload,
	[actionTypes.UPDATE_HOST_WORKING_HOURS_REQUEST]: payload => ({ workingHours: payload }),
	[actionTypes.UPDATE_HOST_BIO_REQUEST]: payload => ({ bio: payload }),
	[actionTypes.RESET_HOST]: () => null
})

export default handleActions(
	{
		[actionTypes.SET_HOST_LOADER]: (state, { payload }) => ({
			...state,
			loading: payload
		}),
		[actionTypes.LOAD_HOST_PREFERENCES]: (state, { payload }) => ({
			...state,
			preferences: payload
		}),
		[actionTypes.SET_HOST_PAYMENT_METHOD]: (state, { payload }) => ({
			...state,
			paymentMethod: payload
		}),
		[actionTypes.RESET_HOST]: _ => defaultState
	},
	defaultState
)
