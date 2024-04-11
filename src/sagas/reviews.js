import { takeEvery, put } from 'redux-saga/effects';
import * as actionTypes from 'actionTypes';
import actions from 'actions';
import api from 'api';

export default function* root() {
	yield takeEvery(actionTypes.GET_BEST_REVIEWS, bestReviewsRequest);
}

export function* bestReviewsRequest() {
	const reviews = yield api.web.getBestReviews();

	yield put(actions.bestReviews(reviews));
}
