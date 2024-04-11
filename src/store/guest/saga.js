import { all, call, cancel, fork, put, race, select, take, takeLatest } from "redux-saga/effects"
import api from "../../api"
import * as actionTypes from 'actionTypes'
import actions from "actions"
import { killModal } from "react-await-modal"
import { isBannedSelector, isGuestSelector, profileSelecotor, roleSelector } from "../profile/selectors"
import { MODAL_KEY, requestNeedDocumentsModal } from "../../modals"
import { guestLicenseSelector, guestPassportSelector } from "./selectors"
import { REGISTRATION_STEPS } from "../../constants/guestRegistration"
import { ROLE } from "../../constants/roles"
import { createErrorCallback, createHandledEffect, pipe } from "../utils"

const isNoDocError = message => !/^Cannot GET/.test(message)

function* startLoader() {
	yield put(actions.setGuestLoader(true))
}

function* stopLoader() {
	yield put(actions.setGuestLoader(false))
}

function* loadDriversLicense() {
	const { error, ...license } = yield call(api.web.guest.driversLicense.get)
	
	if (error?.statusCode === 404 && isNoDocError(error?.message)) return
	if (license?.serialNumber) {
		yield put(actions.loadDriversLicense(license))
		return
	}
	if (error) throw error
	console.log({ error, license })
}

function* loadPassport() {
	const { error, ...passport } = yield call(api.web.guest.passport.get)

	if (error?.statusCode === 404 && isNoDocError(error?.message)) return
	if (passport?.serialNumber) {
		yield put(actions.loadPassport(passport))
		return
	}
	if (error) throw error
	console.log({ error, passport })
}

const handledLicenseRequest = createHandledEffect(
	pipe(startLoader, loadDriversLicense),
	createErrorCallback('Не удалось получить данные ВУ'),
	stopLoader
)

const handledPassportRequest = createHandledEffect(
	pipe(startLoader, loadPassport),
	createErrorCallback('Не удалось получить данные паспорта'),
	stopLoader
)

const BASE_PATH = [
	'ProfileRoot',
	'GuestRegistration'
]

function* modalWithBackgroundDataFetch(fetchData = true) {
	if (fetchData) yield all([
		fork(loadDriversLicense),
		fork(loadPassport)
	])

	const answer = yield call(requestNeedDocumentsModal)
	console.log({answer})
	if (!answer) {
		yield call(api.navigation.navigate, 'Observer')
		return false
	}
}

function* restoreRegistration() {
	try {
		yield call(startLoader)
		const role = yield select(roleSelector)

		if (!role) throw {}

		if (role === ROLE.GUEST) {
			const profile = yield select(profileSelecotor)
	
			const answer = yield call(modalWithBackgroundDataFetch)
			if (answer === false) return
	
			const license = yield select(guestLicenseSelector)
			const passport = yield select(guestPassportSelector)
			console.log({ profile, license, passport })
	
			if (passport.serialNumber) {
				yield call(api.navigation.deepNavigate, ...BASE_PATH, REGISTRATION_STEPS.FINAL_STEP)
			} else if (profile.lastName && license.serialNumber) {
				yield call(api.navigation.deepNavigate, ...BASE_PATH, REGISTRATION_STEPS.PASSPORT)
			}
		} else {
			const answer = yield call(modalWithBackgroundDataFetch, false)
			if (answer === false) return
			yield call(api.navigation.deepNavigate, ...BASE_PATH, REGISTRATION_STEPS.DRIVER_LICENSE)
		}
	} catch (err) {
		console.error(err)
		yield call(killModal, MODAL_KEY.NEED_DOCUMENTS_MODAL)
		yield put(actions.error('Не удалось получить данные, попробуйте еще раз'))
	} finally {
		yield call(stopLoader)
	}
}

const handledDocumentsRequest = createHandledEffect(
	pipe(startLoader, loadDriversLicense, loadPassport),
	createErrorCallback('Не удалось получить документы'),
	stopLoader
)

export default function* guestSaga() {
	let task

	while (true) {
		// waiting for guest auth / role set / logout
		const result = yield race({
			login: take(({ type, payload }) => type === actionTypes.LOGIN && [ ROLE.OBSERVER, ROLE.GUEST ].includes(payload?.profile?.role)),
			setRole: take(({ type, payload }) => type === actionTypes.SET_ROLE && payload?.role === ROLE.GUEST),
			logout: take(actionTypes.LOGOUT),
			ban: take(({ type, payload }) => type === actionTypes.SET_PROFILE && isBannedSelector(payload)),
			// unban: take(({ type, payload }) => type === actionTypes.SET_PROFILE && !isBannedSelector(payload) && isGuestSelector(payload)),
		})

		if (result.logout || result.ban) {
			// reseting state and canceling tasks on logout
			yield put(actions.resetGuestDocuments())
			if (task) yield cancel(task)
			task = undefined
			continue
		}

		if (task) yield cancel(task) // canceling old tasks on rights update
		
		const role = yield select(roleSelector)

		// run new tasks
		task = yield all([
			...(
				role === ROLE.GUEST ? [
					takeLatest(actionTypes.LOAD_DRIVERS_LICENSE_REQUEST, handledLicenseRequest),
					takeLatest(actionTypes.LOAD_PASSPORT_REQUEST, handledPassportRequest),
					takeLatest(actionTypes.PROFILE_REQUEST, handledDocumentsRequest),
				] : []
			),
			takeLatest(actionTypes.RESTORE_GUEST_REGISTRATION_REQUEST, restoreRegistration),
		])
	}
}
