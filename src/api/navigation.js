import { CommonActions, StackActions, TabActions } from '@react-navigation/native'

let _actions = [],
	_navigator = { dispatch: action => _actions.push(action) };

function setTopLevelNavigator(navigatorRef) {
	_navigator = navigatorRef;

	if (_actions.length) {
		_actions.forEach(_navigator.dispatch);
		_actions = [];
	}
}

function navigate(name, params, key) {
	if (key === true) {
		key = name;
	} else if (params === true) {
		key = name;
		params = undefined;
	}

	_navigator.dispatch(
		CommonActions.navigate({
			name,
			params,
			key,
		})
	);
}

const getRecursiveNavigationQuery = (screensArr, params) => {
	if (!screensArr.length) return params

	const screen = screensArr.shift()

	return {
		screen,
		params: getRecursiveNavigationQuery(screensArr, params)
	}
}

/**
 * Navigates to the deeply nested screen
 * 
 * For example:
 * 
 * deepNavigate('ProfileRoot', 'Auth, 'SignUp', { isHost: true })
 * 
 * OR
 * 
 * deepNavigate([ 'ProfileRoot', 'Auth, 'SignUp' ], { isHost: true })
 * 
 * REPLACES
 * 
 * navigate('ProfileRoot', {
 * 	screen: 'Auth',
 * 	params: {
 * 	  screen: 'SignUp',
 * 	  params: {
 * 	    isHost: true
 *    }
 * 	}
 * })
 * 
 * @param  {...String} args 
 */
function deepNavigate(...args) {
	if (Array.isArray(args[0])) {
		const screens = args.shift()
		args = [ ...screens, args[0] ]
	}

	let [ root, params ] = [ args.shift(), args.pop() ]
	if (typeof params === 'string') {
		params = { screen: params }
	}

	const query = getRecursiveNavigationQuery(args, params)

	console.log('Deep navigation with args: ', [ root, query ])

	return navigate(root, query)
}

function replace(name, params) {
	_navigator.dispatch(StackActions.replace(name, params));
}

function push(name, params) {
	_navigator.dispatch(StackActions.push(name, params));
}

function jumpTo(name, params) {
	_navigator.dispatch(TabActions.jumpTo(name, params));
}

function setParams(key, params) {
	_navigator.dispatch({
		...CommonActions.setParams(params),
		source: key,
	});
}

function goBack(source, target) {
	if (_navigator.canGoBack()) {
		_navigator.dispatch({ ...CommonActions.goBack(), source, target });
	} else {
		_navigator.navigate('RootTabs');
	}
}

function reset(index, routes) {
	_navigator.dispatch(CommonActions.reset({ index, routes }));
}

function getCurrentRoute() {
	return _navigator?.getCurrentRoute && _navigator.getCurrentRoute();
}

function getCurrentRouteName() {
	return getCurrentRoute()?.name;
}

function logger(state) {
	if (__DEV__) {
		const currentRoute = getCurrentRoute();

		// console.tron.display({
		// 	name: 'NAVIGATION',
		// 	preview: JSON.stringify(currentRoute, null, 4),
		// 	value: { currentRoute, state },
		// });
	}
}

const navigation = {
	setTopLevelNavigator,
	navigate,
	deepNavigate,
	replace,
	jumpTo,
	push,
	setParams,
	goBack,
	reset,
	getCurrentRoute,
	getCurrentRouteName,
	logger
}

export default navigation
