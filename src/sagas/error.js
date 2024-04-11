import { takeEvery } from 'redux-saga/effects';
import { Alert } from 'react-native';
import * as actionTypes from 'actionTypes';
import { extractErrorMessage } from 'functions';

export default function* root() {
	yield takeEvery(actionTypes.ERROR, error);
}

export function error({ payload: { title, error } }) {
	Alert.alert(title, extractErrorMessage(error));
}
