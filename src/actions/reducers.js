import { combineReducers } from 'redux';
import location from './location';
import suggest from './suggest';
import search from './search';
import profile from './profile';
import car from './car';
import rentRoom from './rentRoom';
import trips from './trips';
import devMode from './devMode';
import payment from './payment';
import pso from './pso';
import reviews from './reviews';
import serviceStats from './serviceStats';
import cities from './cities';
import carRegistration from './carRegistration';
import layout from './layout';
import guest from '../store/guest/actions'
import host from '../store/host/actions'

export default combineReducers({
	location,
	suggest,
	search,
	profile,
	car,
	rentRoom,
	trips,
	devMode,
	payment,
	pso,
	reviews,
	serviceStats,
	cities,
	carRegistration,
	layout,
	guest,
	host
});
