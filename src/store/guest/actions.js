import { createActions, handleActions } from 'redux-actions'
import * as actionTypes from './actionTypes'

const mapPhoto = key => typeof key === 'string' ? {
	key: key.split('/').reverse()[0]
} : null

const defaultState = {
	loading: false,
	driversLicense: {
		serialNumber: '',
		dateOfIssue: '',
		firstLicenseIssueYear: '',
		frontSidePhoto: null,
		reverseSidePhoto: null
	},
	passport: {
		serialNumber: '',
		dateOfIssue: '',
		registrationAddress: '',
		frontSidePhoto: null,
		registrationSidePhoto: null,
		selfiePhoto: null
	}
}

export const actions = createActions({
	[actionTypes.SET_GUEST_LOADER]: loading => Boolean(loading),
	[actionTypes.RESTORE_GUEST_REGISTRATION_REQUEST]: () => null,
	[actionTypes.LOAD_DRIVERS_LICENSE_REQUEST]: () => null,
	[actionTypes.LOAD_DRIVERS_LICENSE]: license => ({
		...license,
		frontSidePhoto: mapPhoto(license.frontSidePhotoKey),
		reverseSidePhoto: mapPhoto(license.reverseSidePhotoKey)
	}),
	[actionTypes.CREATE_DRIVERS_LICENSE_REQUEST]: () => null,
	[actionTypes.CREATE_DRIVERS_LICENSE]: () => null,
	[actionTypes.UPDATE_DRIVERS_LICENSE_REQUEST]: () => null,
	[actionTypes.UPDATE_DRIVERS_LICENSE]: () => null,
	[actionTypes.LOAD_PASSPORT_REQUEST]: () => null,
	[actionTypes.LOAD_PASSPORT]: passport => ({
		...passport,
		frontSidePhoto: mapPhoto(passport.frontSidePhotoKey),
		registrationSidePhoto: mapPhoto(passport.registrationSidePhotoKey),
		selfiePhoto: mapPhoto(passport.selfiePhotoKey)
	}),
	[actionTypes.CREATE_PASSPORT_REQUEST]: () => null,
	[actionTypes.CREATE_PASSPORT]: () => null,
	[actionTypes.UPDATE_PASSPORT_REQUEST]: () => null,
	[actionTypes.UPDATE_PASSPORT]: () => null,
	[actionTypes.RESET_GUEST_DOCUMENTS]: () => null
})

export default handleActions(
	{
		[actionTypes.SET_GUEST_LOADER]: (state, { payload }) => ({
			...state,
			loading: payload
		}),
		[actionTypes.LOAD_DRIVERS_LICENSE]: (state, { payload }) => ({
			...state,
			driversLicense: payload
		}),
		[actionTypes.LOAD_PASSPORT]: (state, { payload }) => ({
			...state,
			passport: payload
		}),
		[actionTypes.RESET_GUEST_DOCUMENTS]: _ => defaultState
	},
	defaultState
)
