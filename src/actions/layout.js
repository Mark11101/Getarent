import { createActions, handleActions } from 'redux-actions';
import * as actionTypes from 'actionTypes';

const defaultState = {
	isOnChatScreen: false,
	// isOnProfileScreen: false, // NOT USED
	unreadMessages: [],
	unreadMessagesCount: 0,
	notificationsPermissionStatus: '',
	initialSelectedRole: 'GUEST',
};

export const actions = createActions({
	[actionTypes.TOGGLE_INVEST_MODAL]: null,
	[actionTypes.SET_ON_CHAT_SCREEN]: (condition) => ({ condition }),
	// [actionTypes.SET_ON_PROFILE_SCREEN]: (condition) => ({ condition }), // NOT USED
	[actionTypes.SET_UNREAD_MESSAGES]: (array) => ({ array }),
	[actionTypes.SET_UNREAD_MESSAGES_COUNT]: (count) => ({ count }),
	[actionTypes.SET_NOTIFICATIONS_PERMISSION_STATUS]: (status) => ({ status }),
	[actionTypes.SET_INITIAL_SELECTED_ROLE]: (role) => ({ role }),
});

export default handleActions(
	{
		[actionTypes.SET_ON_CHAT_SCREEN]: (state, { payload: { condition } }) => ({
			...state,
			isOnChatScreen: condition,
		}),
		// [actionTypes.SET_ON_PROFILE_SCREEN]: (state, { payload: { condition } }) => ({
		// 	...state,
		// 	isOnProfileScreen: condition,
		// }), // NOT USED
		[actionTypes.SET_UNREAD_MESSAGES]: (state, { payload: { array } }) => ({
			...state,
			unreadMessages: array,
		}),
		[actionTypes.SET_UNREAD_MESSAGES_COUNT]: (state, { payload: { count } }) => ({
			...state,
			unreadMessagesCount: count,
		}),
		[actionTypes.SET_NOTIFICATIONS_PERMISSION_STATUS]: (state, { payload: { status } }) => ({
			...state,
			notificationsPermissionStatus: status,
		}),
		[actionTypes.SET_INITIAL_SELECTED_ROLE]: (state, { payload: { role } }) => ({
			...state,
			initialSelectedRole: role,
		}),
	},
	defaultState
);
