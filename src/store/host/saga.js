import { all, call, cancel, put, take, race, takeLatest } from "redux-saga/effects"
import api from "../../api"
import * as actionTypes from 'actionTypes'
import actions from "actions"
import { createErrorCallback, createHandledEffect, pipe } from "../utils"
import { ROLE } from "../../constants/roles"
import { isBannedSelector, isHostSelector } from "../profile/selectors"

function* startLoader() {
	yield put(actions.setHostLoader(true))
}

function* stopLoader() {
	yield put(actions.setHostLoader(false))
}

function* loadPreferences() {
	const { error, ...prefs } = yield call(api.web.host.getPreferences)
	
	if (prefs?.id) {
		yield put(actions.loadHostPreferences(prefs))
		return
	}
	if (error) throw error
	console.log({ error, prefs })
}

function* loadPaymentMethod() {
	const methodsOrError = yield call(api.web.host.getPaymentMethods)
	
	if (Array.isArray(methodsOrError)) {
		const methodsWithDetails = methodsOrError
			.filter(({ details }) => !!details && typeof details === 'object')
		
		if (methodsWithDetails.length) {
			yield put(actions.setHostPaymentMethod(methodsWithDetails))
		}
		return
	}
	console.log({ error: methodsOrError })
	throw methodsOrError
}

function* sendPaymentDetails({ payload }) {
	const { isIndividual, ...body } = payload
	
	const { error, ...res } = yield call(api.web.host.sendPaymentDetails, body, isIndividual)

	if (res.ok) {
		yield put(actions.loadHostPaymentMethodRequest())
		return
	}
	if (error) throw error
	console.log({ error, res })
}

function* updateWorkingHours({ payload }) {
	const { error, ...prefs } = yield call(api.web.host.updatePreferences, payload)
	
	if (prefs.id) {
		yield put(actions.loadHostPreferences(prefs))
		return
	}
	if (error) throw error
	console.log({ error, prefs })
}

function* updateBio({ payload }) {
	const { error, ...prefs } = yield call(api.web.host.updatePreferences, payload)
	
	if (prefs.id) {
		yield put(actions.loadHostPreferences(prefs))
		return
	}
	if (error) throw error
	console.log({ error, prefs })
}

const handledPreferencesRequest = createHandledEffect(
	pipe(startLoader, loadPreferences),
	createErrorCallback('Не удалось получить данные о рабочих часах', stopLoader),
	stopLoader
)

const handledPaymentMethodRequest = createHandledEffect(
	pipe(startLoader, loadPaymentMethod),
	createErrorCallback('Не удалось получить настройки получения выплат', stopLoader),
	stopLoader
)

const handledDataRequest = createHandledEffect(
	pipe(startLoader, loadPreferences, loadPaymentMethod),
	createErrorCallback('Не удалось получить данные', stopLoader),
	stopLoader
)

export default function* hostSaga() {
	let task

	while (true) {
		// waiting for guest auth / role set / logout
		const result = yield race({
			login: take(({ type, payload }) => type === actionTypes.LOGIN && payload?.profile?.role === ROLE.HOST),
			setRole: take(({ type, payload }) => type === actionTypes.SET_ROLE && payload?.role === ROLE.HOST),
			logout: take(actionTypes.LOGOUT),
			ban: take(({ type, payload }) => type === actionTypes.SET_PROFILE && isBannedSelector(payload)),
			// unban: take(({ type, payload }) => type === actionTypes.SET_PROFILE && !isBannedSelector(payload) && isHostSelector(payload)),
		})

		if (result.logout || result.ban) {
			// reseting state and canceling tasks on logout
			yield put(actions.resetHost())
			if (task) yield cancel(task)
			task = undefined
			continue
		}

		if (task) yield cancel(task) // canceling old tasks on rights update

		// run new tasks
		task = yield all([
			takeLatest(actionTypes.PROFILE_REQUEST, handledDataRequest),
			takeLatest(actionTypes.LOAD_HOST_PREFERENCES_REQUEST, handledPreferencesRequest),
			takeLatest(actionTypes.LOAD_HOST_PAYMENT_METHOD_REQUEST, handledPaymentMethodRequest),
			takeLatest(actionTypes.UPDATE_HOST_WORKING_HOURS_REQUEST, createHandledEffect(
				updateWorkingHours,
				createErrorCallback('Не удалось обновить данные')
			)),
			takeLatest(actionTypes.UPDATE_HOST_BIO_REQUEST, createHandledEffect(
				updateBio,
				createErrorCallback('Не удалось обновить данные')
			)),
			takeLatest(actionTypes.SET_HOST_PAYMENT_METHOD_REQUEST, createHandledEffect(
				sendPaymentDetails,
				createErrorCallback('Не удалось обновить данные')
			))
		])

		yield put(actions.profileRequest()) // for instant data load
	}
}
