import { takeLatest, put, call, all } from 'redux-saga/effects'
import api from '../../api'
import actions from 'actions'
import * as actionTypes from './actionTypes'
import { createErrorCallback, createHandledEffect } from '../utils'

const updateProfile = createHandledEffect(
	function* ({ payload }) {
		const { error, ...profile } = yield call(api.web.user.update, payload)
		if (error) throw error
		if (Object.keys(profile).length) {
			yield put(actions.setProfile(profile))
			return
		}
		console.log({ error, profile })
	},
	createErrorCallback('Не удалось обновить данные профиля')
)

export default function* profileSaga() {
	yield all([
		takeLatest(actionTypes.UPDATE_PROFILE_REQUEST, updateProfile)
	])
}
