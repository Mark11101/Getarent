import { createActions, handleActions } from 'redux-actions';
import * as actionTypes from 'actionTypes';
import { ROLE } from '../constants/roles';

const defaultState = {
	authorized: false,
	isSignUp: false,
	deletionRequested: false,
	potentialRole: null,
	role: ROLE.OBSERVER,
	carEditData: {
		insurance: {},
		photos: [],
	},
	labels: [],
	blockedDates: [],
	carsList: [],
	publishError: null,
	loading: false,
	editError: null,
};

export const actions = createActions({
	[actionTypes.SIGNUP]: profile => ({ profile }),
	[actionTypes.SIGNUP_REQUEST]: (email, password) => ({ email, password }),
	[actionTypes.LOGIN]: (profile, isSignUp) => ({ profile: { ...profile, isSignUp } }),
	[actionTypes.PROFILE_REQUEST]: null,
	[actionTypes.UPDATE_PROFILE_REQUEST]: null,
	[actionTypes.SET_PROFILE]: profile => ({ profile }),
	[actionTypes.LOGOUT]: null,
	[actionTypes.SET_PROFILE_LOADER]: loading => Boolean(loading),
	[actionTypes.DELETE_ACCOUNT]: null,
	[actionTypes.DELETION_REQUESTED]: null,
	[actionTypes.SET_CAR_EDIT_DATA]: data => ({ data }),
	[actionTypes.GET_CAR_EDIT_DATA]: (carId, withGoBack) => ({ carId, withGoBack }),
	[actionTypes.START_VERIFICATION]: (id, data) => ({ id, data }),
	[actionTypes.START_VERIFICATION_SUCCESS]: null,
	[actionTypes.START_VERIFICATION_FAILURE]: error => ({ error }),
	[actionTypes.POST_EDIT_DATA]: (id, data) => ({ id, data }),
	[actionTypes.POST_EDIT_DATA_SUCCESS]: null,
	[actionTypes.POST_EDIT_DATA_FAILURE]: error => ({ error }),
	[actionTypes.GET_CARS_LIST]: null,
	[actionTypes.SET_ROLE]: role => ({ role }),
	[actionTypes.SET_CARS_LIST]: data => ({ data }),
	[actionTypes.PUBLISH_CAR]: carId => ({ carId }),
	[actionTypes.UNPUBLISH_CAR]: carId => ({ carId }),
	[actionTypes.UPDATE_BLOCKED_DURATIONS]: durations => ({ durations }),
	[actionTypes.RESET_EDIT_ERROR]: null,
	[actionTypes.GET_INSURANCE]: carId => ({ carId }),
	[actionTypes.SET_INSURANCE]: data => ({ data }),
	[actionTypes.TOGGLE_INSURANCE]: (carId, isInsured) => ({ carId, isInsured }),
	[actionTypes.GET_CAR_PHOTOS_LIST]: carId => ({ carId }),
	[actionTypes.SET_CAR_PHOTOS_LIST]: data => ({ data }),
	[actionTypes.SET_PRIMARY_PHOTO]: (photoId, carId) => ({ photoId, carId }),
	[actionTypes.DELETE_CAR_PHOTO]: (photoId, carId) => ({ photoId, carId }),
	[actionTypes.ADD_CAR_PHOTO]: (photos, carId) => ({ photos, carId }),
	[actionTypes.ADD_CAR_PHOTO_SUCCESS]: null,
	[actionTypes.ADD_CAR_PHOTO_ERROR]: null,
	[actionTypes.REMOVE_CAR_EDIT_LOADING]: null,
	[actionTypes.SET_DRIVERS_LICENSE_FIRST_ISSUE_YEAR]: date => ({ date }),
	[actionTypes.SET_POTENTIAL_ROLE]: role => role,
});

export default handleActions(
	{
		[actionTypes.SET_PROFILE_LOADER]: (state, { payload }) => ({
			...state,
			loading: payload
		}),
		[actionTypes.SIGNUP]: (state, { payload: { error } }) => ({
			...state,
			error,
			confirm: !error,
		}),
		[actionTypes.SIGNUP_REQUEST]: state => ({
			...state,
			authorized: false,
			loading: true,
		}),
		[actionTypes.LOGIN]: (state, { payload: { error, profile } }) =>
			error
				? defaultState
				: {
						...state,
						...profile,
						authorized: true,
						loading: false,
				  },
		[actionTypes.LOGOUT]: () => defaultState,
		[actionTypes.DELETE_ACCOUNT]: state => ({ ...state, loading: true }),
		[actionTypes.DELETION_REQUESTED]: state => ({
			...state,
			loading: false,
			deletionRequested: true,
		}),
		[actionTypes.SET_CAR_EDIT_DATA]: (state, { payload: { data } }) => ({ 
			...state, 
			carEditData: {
				insurance: state.carEditData.insurance,
				photos: state.carEditData.photos,
				...data,
			} ,
		}),
		[actionTypes.START_VERIFICATION](state) {
		  return { ...state, publishError: null, loading: true };
		},
		[actionTypes.START_VERIFICATION_SUCCESS](state) {
		  return {
			...state,
			loading: false,
			publishError: null,
		  };
		},
		[actionTypes.START_VERIFICATION_FAILURE](
		  state,
		  {
			payload: { error },
		  },
		) {
		  return { ...state, publishError: error, loading: false };
		},
		[actionTypes.POST_EDIT_DATA](state) {
		  return { ...state, loading: true };
		},
		[actionTypes.POST_EDIT_DATA_SUCCESS](state) {
		  return { ...state, editError: false, loading: false };
		},
		[actionTypes.POST_EDIT_DATA_FAILURE](
		  state,
		  {
			payload: { error },
		  },
		) {
		  return { ...state, editError: error, loading: false };
		},
		[actionTypes.GET_CARS_LIST](state) {
		  return { ...state, loading: true };
		},
		[actionTypes.PROFILE_REQUEST](state) {
		  return { ...state, loading: true };
		},
		[actionTypes.SET_PROFILE]: (state, { payload: { profile } }) => (
			state.authorized 
			? 
				{ 
					...state, 
					...profile,
					loading: false, 
				} 
			: 
				defaultState
		),
		[actionTypes.SET_CARS_LIST]: (state, { payload: { data } }) => ({ 
			...state, 
			carsList: data,
			editError: null,
			loading: false,
		}),
		[actionTypes.UPDATE_BLOCKED_DURATIONS]: (state, { payload: { durations } }) => ({ 
			...state, 
			blockedDates: durations,
		}),
		[actionTypes.SET_ROLE]: (state, { payload: { role } }) => ({
			...state,
			role,
		}),
		[actionTypes.RESET_EDIT_ERROR]: state => ({ ...state, editError: null }),
		[actionTypes.SET_INSURANCE]: (state, { payload: { data } }) => ({ 
			...state, 
			carEditData: {
				...state.carEditData,
				insurance: data,
			},
		}),
		[actionTypes.SET_CAR_PHOTOS_LIST]: (state, { payload: { data } }) => ({ 
			...state, 
			carEditData: {
				...state.carEditData,
				photos: data,
			},
			loading: false,
		}),
		[actionTypes.ADD_CAR_PHOTO](state) {
			return { ...state, loading: true };
		},
		[actionTypes.ADD_CAR_PHOTO_SUCCESS](state)  {
			return { ...state, loading: false };
		},
		[actionTypes.ADD_CAR_PHOTO_ERROR](state)  {
			return { ...state, loading: false };
		},
		[actionTypes.DELETE_CAR_PHOTO](state)  {
			return { ...state, loading: true };
		},
		[actionTypes.REMOVE_CAR_EDIT_LOADING](state)  {
			return { ...state, loading: false };
		},
		[actionTypes.SET_POTENTIAL_ROLE]: (state, { payload }) => ({
			...state,
			potentialRole: payload
		}),
	},
	defaultState
);
