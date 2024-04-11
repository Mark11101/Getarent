import 'config';
import { isAfter } from 'date-fns';
import { Provider } from 'react-redux';
import notifee from '@notifee/react-native';
import React, { useEffect, useState } from 'react';
import 'react-native-devsettings/withAsyncStorage';
import FlashMessage from "react-native-flash-message";
import { checkNotifications } from 'react-native-permissions';
import { ModalFactory } from 'react-await-modal';
import popupFactory from './modals/popupFactory';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Animated, LogBox, Dimensions, Platform, PermissionsAndroid, AppState } from 'react-native';

import api from 'api';
import actions from 'actions';
import store from './store';
import { callNotifAlert } from './functions';
import RootStack from './navigation';
import { SearchControlsAnimatedValue } from 'context';
import FetchDataHandler from './components/FetchDataHandler';
import { DevMode, UpdatesChecker, NotificationsHandler } from 'components';
import FirstLaunchScreens from './components/FirstLaunchScreens/FirstLaunchScreens';
import {LossNetConnection} from "./components/LossNetConnection";
import { MyTrackerCustomerUserId } from './myTrackerService';
import { enableScreens } from 'react-native-screens';

LogBox.ignoreLogs(['Remote debugger']);

const HEIGHT = Dimensions.get('window').height;

const animated = new Animated.Value(0);
const animatedSlideValue = new Animated.Value(0);

const SLIDE_DURATION = 380;

enableScreens(true)

const App = () => {

	const [isFirstLaunch, setIsFirstLaunch] = useState(null);
	const [isCloseFirstLaunchScreens, setIsCloseFirstLaunchScreens] = useState(false);

	const [waiter, setWaiter] = useState(false);


	useEffect(() => {
	    MyTrackerCustomerUserId();
		store.dispatch(actions.appDidMount());
	}, []);	

	useEffect(() => {
          
        const subscription = AppState.addEventListener('change', async (state) => {
			
			if (state === 'active') {

				if (store.getState().profile.role === 'HOST') {

					checkNotifications().then(({ status }) => {
						status !== 'granted' && callNotifAlert();
						store.dispatch(actions.setNotificationsPermissionStatus(status));
					});
				};

				if (Platform.OS === 'android' && !(store.getState().layout.isOnChatScreen)) {

					// android background/killed notifications counter 
					const result = notifee.getDisplayedNotifications().then(async (notifications) => {

						const { chatOpenTime } = await api.storage.get('chatOpenTime');
	
						const unreadMessages = notifications.filter((notification) => (
							!!notification.notification.body &&
							notification.notification.android.channelId === "chat" &&
							isAfter(Number(notification.date), Number(chatOpenTime))
						));
						
						store.dispatch(actions.setUnreadMessages(unreadMessages));
					});

					// android app killed/background notifications deeplink
					const initialNotification = await notifee.getInitialNotification();
	
					if (initialNotification?.pressAction?.id === 'default') {
	
						const notification = initialNotification.notification;
	
						if (notification.data.type === 'talkjs') {
							if (notification.data.senderId === 'support@getarent.ru') {
								setTimeout(() => {
									api.navigation.navigate('Chats', { 
										screen: 'Support'
									})
								}, 500)
							} else {
	
								setTimeout(() => {
									
									const myId = store.getState().profile.id;
									const carId = notification.data.custom.carId;
									const anotherUserName = notification.data.name;

									let anotherUserId = notification.data.senderId;

									if (myId === anotherUserId) {
										anotherUserId = data.conversation.custom.secondUserId
									};
	
									if (myId && anotherUserId && anotherUserName) {
	
										const isHost = store.getState().profile.role === 'HOST';
										
										api.navigation.navigate('Chat', { 
											conversationData: {
												id: isHost ? `${carId}-${myId}-${anotherUserId}` : `${carId}-${anotherUserId}-${myId}`,
												custom: notification.data.custom,
											},
											otherUser: {
												id: anotherUserId,
												name: anotherUserName,
											},
											onPressBack: () => api.navigation.navigate('Chats', { screen: 'Trips' })
										})
									};
								}, 500)
							}
						};
					}
				};

            };
		});

		return () => { subscription.remove() };

    }, []);
	
	useEffect(() => {

		const checkApplicationPermission = async () => {

			if (Platform.OS === 'android') {

			  try {
				await PermissionsAndroid.request(
				  PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
				);
			  } 
			  catch (error) {}
			}
		};

		checkApplicationPermission();

	}, []);

	useEffect(() => {

		isCloseFirstLaunchScreens && Animated.timing(animatedSlideValue, {
			toValue: -440,
			duration: SLIDE_DURATION,
			useNativeDriver: true,
		}).start()

	}, [isCloseFirstLaunchScreens]);

	useEffect(() => {

		const setFirstLaunch = async () => {
	
			const { isAppFirstLaunchImplemented } = await api.storage.get('isAppFirstLaunchImplemented');

			if (isAppFirstLaunchImplemented !== 'true') {
				setIsFirstLaunch(true);

			} else {
				setIsFirstLaunch(false)
			}
		};

		setFirstLaunch();

	}, []);

	if (isFirstLaunch === null) {
		return null
	};
	
	const linking = {
		prefixes: [
			'http://getarent.ru',
			'https://getarent.ru',
			'http://iew8iesh.k8s.getarent.ru',
			'https://iew8iesh.k8s.getarent.ru',
			'getarent://getarent.ru',
			'getarent://iew8iesh.k8s.getarent.ru',
		],
		config: {
			screens: {
				RootTabs: {
					screens: {
						SearchTab: 'app/search',
						Trips: 'app/my-rents',
						Cars: 'car-rental-income',
						Chats: {
							screens: {
								Trips: 'app/chats/trips',
								Support: 'app/chats/support',
							}
						},
						ProfileRoot: {
							screens: {
								Profile: 'app/account',
							}
						},
					},
				},
				Car: 'app/car/card/:uuid',
				PublicProfile: 'app/account/public/:uuid',
				Reviews: 'app/account/public/:uuid/reviews',

				// Authorized GUEST
				ProfilePayments: 'app/account/card',

				// Authorized HOST
				CarEdit: 'app/car/edit/:carId/*',

				// Authorized GUEST, HOST
				RentRoom: 'app/rent-room/:uuid',
				Chat: 'app/chats/:chatId',

				// Authorized GUEST, HOST, OBSERVER
				Documents: 'app/account/documents',
				
				RentOutArticle: 'app/rent-out/article/:articleId'
			},
		},
	};
	
	return (
		<GestureHandlerRootView style={{ flex: 1 }}>
			<Provider {...{ store }}>
				<SafeAreaProvider>
					<LossNetConnection />
					{
						isFirstLaunch
						&&
							<Animated.View style={[{
								position: 'absolute', 
								height: HEIGHT, 
								zIndex: 100, 
								transform: [{translateX: animatedSlideValue}]
							}]}>
								<FirstLaunchScreens onClose={() => setIsCloseFirstLaunchScreens(true)} />
							</Animated.View>
					}
					<NavigationContainer
						ref={api.navigation.setTopLevelNavigator}
						onStateChange={api.navigation.logger}
						linking={linking}
					>
						<SearchControlsAnimatedValue.Provider value={animated}>
							<RootStack />
						</SearchControlsAnimatedValue.Provider>
					</NavigationContainer>
					<DevMode />
					<UpdatesChecker />
					<FetchDataHandler />
					<NotificationsHandler />
				</SafeAreaProvider>
			</Provider>
            <FlashMessage position="top" />
		</GestureHandlerRootView>
	);
}

export default App;
