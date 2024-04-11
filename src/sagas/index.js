import { all, fork } from 'redux-saga/effects';
import init from './init';
import error from './error';
import location from './location';
import suggest from './suggest';
import search from './search';
import profile from './profile';
import car from './car';
import trips from './trips';
import rentRoom from './rentRoom';
import reviews from './reviews';
import devMode from './devMode';
import payment from './payment';
import serviceStats from './serviceStats';
import cities from './cities';
import profileSaga from '../store/profile/saga';
import guestSaga from '../store/guest/saga';
import hostSaga from '../store/host/saga';

export default function* root() {
	yield all(
		[
			init,
			error,
			location,
			suggest,
			search,
			profile,
			car,
			trips,
			rentRoom,
			devMode,
			payment,
			reviews,
			cities,
			serviceStats,
			guestSaga,
			hostSaga,
			profileSaga
		].map(fork)
	);
}
