import { actions as other } from './other';
import { actions as location } from './location';
import { actions as suggest } from './suggest';
import { actions as search } from './search';
import { actions as profile } from './profile';
import { actions as car } from './car';
import { actions as rentRoom } from './rentRoom';
import { actions as trips } from './trips';
import { actions as devMode } from './devMode';
import { actions as payment } from './payment';
import { actions as pso } from './pso';
import { actions as reviews } from './reviews';
import { actions as cities } from './cities';
import { actions as serviceStats } from './serviceStats';
import { actions as carRegistration } from './carRegistration';
import { actions as layout } from './layout';
import { actions as guest } from '../store/guest/actions'
import { actions as host } from '../store/host/actions'

export default {
	...other,
	...location,
	...suggest,
	...search,
	...profile,
	...car,
	...rentRoom,
	...trips,
	...devMode,
	...payment,
	...pso,
	...reviews,
	...cities,
	...serviceStats,
	...carRegistration,
	...layout,
	...guest,
	...host
};
