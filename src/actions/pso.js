import { createActions, handleActions } from 'redux-actions';
import * as actionTypes from 'actionTypes';

const defaultState = {
	photos: [],
	deletedIds: [],
};

export const actions = createActions({
	[actionTypes.PSO_SET_INITIAL_PHOTOS]: initialPhotos => ({
		initialPhotos,
	}),
	[actionTypes.PSO_RESET_STATE]: null,
	[actionTypes.PSO_ADD_PHOTO]: photo => ({
		photo,
	}),
	[actionTypes.PSO_REMOVE_PHOTO]: id => ({
		id,
	}),
});

export default handleActions(
	{
		[actionTypes.PSO_SET_INITIAL_PHOTOS]: (state, { payload }) => {
			return {
				...state,
				photos: payload.initialPhotos,
			};
		},
		[actionTypes.PSO_RESET_STATE]: state => {
			return {
				...state,
				photos: [],
				deletedIds: [],
			};
		},
		[actionTypes.PSO_ADD_PHOTO]: (state, { payload }) => {
			return {
				...state,
				photos: [...state.photos, payload.photo],
			};
		},
		[actionTypes.PSO_REMOVE_PHOTO]: (state, { payload }) => {
			const photoToRemove = state.photos.find(
				({ sequentialIdWithinStep }) =>
					sequentialIdWithinStep === payload.id
			);
			const deletedIds = !photoToRemove?.respInfo.isUpload
				? [
						...state.deletedIds,
						photoToRemove.respInfo.key || photoToRemove.id,
				  ]
				: state.deletedIds;
			return {
				...state,
				photos: state.photos.filter(
					f => f.sequentialIdWithinStep !== payload.id
				),
				deletedIds,
			};
		},
	},
	defaultState
);
