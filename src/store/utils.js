import { all, call, put } from "redux-saga/effects"
import actions from "actions"
import popupFactory from "../modals/popupFactory"

export const createHandledEffect = (cb = () => {}, errorCb = err => console.error(err), finallyCb = () => {}) => {
	return function* (...args) {
		try {
			yield call(cb, ...args)
		} catch(err) {
			yield call(errorCb, err)
		} finally {
			yield call(finallyCb, ...args)
		}
	}
}

export const createErrorCallback = (message = 'Неизвестная ошибка', onError = () => {}) => {
	return function* (err) {
		console.log(err)
		// if (err.statusCode)
		yield call([ popupFactory, popupFactory.killAll ], { onError: true })
		yield call(onError)
		yield put(actions.error(message))
	}
}

export const pipe = (...effects) => {
	return function* (...args) {
		yield all(effects.map(effect => call(effect, ...args)))
	}
}
