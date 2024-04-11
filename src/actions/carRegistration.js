import { createActions, handleActions } from 'redux-actions';

import * as actionTypes from 'actionTypes';

const defaultState = {
    name: '',
	surname: '',
    patronymic: '',
    passport: '',
    address: '',
	companyName: '',
	INN: '',
	companyAddress: '',
	isIndividual: true,
	frontSidePassport: {},
	registrationSidePassport: {},
	isEPTS: true,
	seriesEPTS: '',
	numberEPTS: '',
	seriesPTS: '',
	numberPTS: '',
	frontSidePTS: {},
	backSidePTS: {},
	frontSideSTS: {},
	backSideSTS: {},
	brand: '',
	model: '',
	year: '',
	price: '',
	city: '',
	registrationNumber: '',
	VINNumber: '',
	bodyType: '',
	engineType: '',
	enginePower: '',
	displacementType: '',
	transmissionType: '',
	transmissionBoxType: '',
	seatsNumber: '',
};

export const actions = createActions({
	[actionTypes.UPDATE_CAR_REGISTRATION_DATA]: data => ({ data }),
	[actionTypes.RESET_CAR_REGISTRATION_DATA]: null,
});

export default handleActions(
	{
		[actionTypes.UPDATE_CAR_REGISTRATION_DATA]: (state, { payload: { data } }) => ({
			...state,
			...data,
		}),
		[actionTypes.RESET_CAR_REGISTRATION_DATA]: () => defaultState,
	},
	defaultState
);
