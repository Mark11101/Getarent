import { createActions } from 'redux-actions';
import * as actionTypes from 'actionTypes';

export const actions = createActions({
	[actionTypes.APP_DID_MOUNT]: () => null,
	[actionTypes.ERROR]: (error, title = 'Что-то пошло не так') => ({ error, title }),
});
