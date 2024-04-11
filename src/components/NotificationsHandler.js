import { isAfter } from 'date-fns';
import { Platform, Alert } from 'react-native';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import messaging from '@react-native-firebase/messaging';
import notifee, { EventType } from '@notifee/react-native';
import PushNotification from "react-native-push-notification";
import PushNotificationIOS from '@react-native-community/push-notification-ios';

import api from 'api';
import actions from 'actions';
import store from '../store';

// android counters

// foreground: NotificationsHandler 215
// background: App 122
// killed: App 122 & NotificationsHandler 107 <- wtf

// ios counters

// foreground: NotificationsHandler 188
// background: NotificationsHandler 94
// killed: NotificationsHandler 94

// ---------------------------------------------------

// android deeplinks

// foreground: NotificationsHandler 241
// background: App 136
// killed: App 136

// ios deeplinks

// foreground: NotificationsHandler 142
// background: NotificationsHandler 142
// killed: NotificationsHandler 142


const NotificationsHandler = () => {

	const dispatch = useDispatch();

	const { id, role } = useSelector(st => st.profile);

	const isOnChatScreen = useSelector(st => st.layout.isOnChatScreen);

	const unreadMessages = useSelector(st => st.layout.unreadMessages);
	const unreadMessagesCount = useSelector(st => st.layout.unreadMessagesCount);

    const onNotificationReceived = async (remoteMessage) => {

        const { data, notification } = remoteMessage;
        const { title, body } = notification;
        // Alert.alert(title)
        notifee.displayNotification({
            title,
            body,
            data,
            android: {
                channelId: 'chat',
                smallIcon: 'ic_small_icon',
                color: 'black',
            },
        });
    };

	useEffect(() => {

		const getFcmToken = async () => {

			const fcmToken = await messaging().getToken();
			
			console.log(`Token from Firebase api: ${fcmToken}`);

            try {
                const res = await api.web.getFcmToken(fcmToken);

                if (res?.error) {
                    throw res.error;
                } else {
                    console.log('Token from getarent api: ' + res.token)
                }
                if (fcmToken && (!res.token || fcmToken !== res.token )) {
                    api.web.postFcmToken(fcmToken)
                };

            } catch {}
		};

		const requestToken = async () => {

			const authStatus = await messaging().requestPermission();

			const enabled =
				authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
				authStatus === messaging.AuthorizationStatus.PROVISIONAL;

            enabled && getFcmToken();
		};

        const createNotifChannel = async () => {

            await notifee.createChannel({
                id: 'chat',
                name: 'Chat Messages',
            });
        }

		if (id) {

            requestToken();
            createNotifChannel();
        };
        
        return messaging().onMessage(onNotificationReceived);

	}, [id]);

    // Killed app chat counter
    useEffect(() => {

        const setUnreadmessages = async () => {

            const { chatOpenTime } = await api.storage.get('chatOpenTime');

            // ios counter
            if (Platform.OS === 'ios') {
  
                PushNotificationIOS.getDeliveredNotifications((notifications) => {

                    let unreadMessages = notifications.filter((notification) => (
                        isAfter(notification.userInfo.talkjs?.message.createdAt, Number(chatOpenTime))
                    ));
    
                    unreadMessages = unreadMessages.map((notification) => notification.userInfo.talkjs);
    
                    dispatch(actions.setUnreadMessages(unreadMessages));
                });
                
            // android counter
            } else {
                
                const result = notifee.getDisplayedNotifications().then((notifications) => {
                    
                    const unreadMessages = notifications.filter((notification) => (
                        !!notification.notification.body &&
                        notification.notification.android.channelId === "chat" &&
                        isAfter(Number(notification.date), Number(chatOpenTime))
                    ));
                    
                    dispatch(actions.setUnreadMessages(unreadMessages));
                });
            }
        };

        setUnreadmessages();

    }, []);

    // ios fore/back-ground & killed deeplink handler
    useEffect(() => {

		return notifee.onForegroundEvent(({ type, detail }) => {

			const notification = detail?.notification?.data;

            const isTalkjs = !!notification.talkjs;
            
			switch (type) {

				case EventType.PRESS:

                    if (isTalkjs) {

                        const data = notification.talkjs;

                        if (data.sender.id === 'support@getarent.ru') {

                            api.navigation.navigate('Chats', { 
                                screen: 'Support'
                            })

                        } else {
                            
                            const myId = id;
                            const anotherUserName = data.sender.name;
                            const carId = data.conversation.custom.carId;
                            
                            let anotherUserId = data.sender.id;
                            
                            if (myId === anotherUserId) {
                                anotherUserId = data.conversation.custom.secondUserId
                            };

                            if (myId && anotherUserId && anotherUserName) {

                                const isHost = role === 'HOST';
                                
                                api.navigation.navigate('Chat', { 
                                    conversationData: {
                                        id: isHost ? `${carId}-${myId}-${anotherUserId}` : `${carId}-${anotherUserId}-${myId}`,
                                        custom: data.conversation.custom,
                                    },
                                    otherUser: {
                                        id: anotherUserId,
                                        name: anotherUserName,
                                    },
                                    onPressBack: () => api.navigation.navigate('Chats')
                                }, true);
                            };
                        }
                    }
					
					break;
			}
		});
	}, [id]);
    
    useEffect(() => {

        // ios foreground counter
        if (Platform.OS === 'ios') {

            PushNotificationIOS.addEventListener(
                'notification', 
                (notification) => {
                    
                    const data = notification.getData();
                    
                    if (!!data.talkjs && !(store.getState().layout.isOnChatScreen)) {
                        dispatch(actions.setUnreadMessages([...unreadMessages, data.talkjs]));
                    }
                }
            );

        } else {

            const unsubscribe = messaging().onMessage(async (remoteMessage) => {

                const isTalkjs = !!remoteMessage.data.talkjs;
                
                const notification = isTalkjs && JSON.parse(remoteMessage.data.talkjs);
                
                const dat = {
                    channelId: 'chat',
                    channelName: 'Chat Messages',
                    notification: notification || null,
                    message: remoteMessage.data.message,
                    title: remoteMessage.data.title || '',
                    smallIcon: "ic_small_icon",
                    largeIcon: "",
                };
                    
                // Display android local notification, for ios check AppDelegate.mm
                PushNotification.localNotification(dat);
                
                // android foreground counter
                if (notification.sender.id !== id) {
    
                    if (isTalkjs && !isOnChatScreen) {
                        dispatch(actions.setUnreadMessages([...unreadMessages, notification]));
                    }
                };
    
                // android foreground deeplink
                PushNotification.configure({
                    onNotification: (data) => {
                        
                        if (!!data.notification?.conversation) {
                            
                            if (data.notification.sender.id === 'support@getarent.ru') {
                                api.navigation.navigate('Chats', { 
                                    screen: 'Support'
                                })
                            } else {
    
                                const myId = id;
                                const anotherUserName = data.notification.sender.name;
                                const carId = data.notification.conversation.custom.carId;
                                
                                let anotherUserId = data.notification.sender.id;

                                if (myId === anotherUserId) {
                                    anotherUserId = data.conversation.custom.secondUserId
                                };
    
                                if (myId && anotherUserId && anotherUserName && carId) {

                                    const isHost = role === 'HOST';
    
                                    api.navigation.navigate('Chat', { 
                                        conversationData: {
                                            id: isHost ? `${carId}-${myId}-${anotherUserId}` : `${carId}-${anotherUserId}-${myId}`,
                                            custom: data.notification.conversation.custom,
                                        },
                                        otherUser: {
                                            id: anotherUserId,
                                            name: anotherUserName,
                                        },
                                        onPressBack: () => api.navigation.navigate('Chats')
                                    }, true);
                                };
                            }
    
                        } else if (!!data.data.conversationId) {
                            
                            if (data.data.senderId === 'support@getarent.ru') {
                                api.navigation.navigate('Chats', { 
                                    screen: 'Support'
                                })
                            } else {
    
                                const myId = id;
                                const anotherUserName = data.data.name;
                                const carId = data.conversation.custom.carId;
                                
                                let anotherUserId = data.data.senderId;

                                if (myId === anotherUserId) {
                                    anotherUserId = data.conversation.custom.secondUserId
                                };
    
                                if (myId && anotherUserId && anotherUserName && carId) {

                                    const isHost = role === 'HOST';
                                    
                                    api.navigation.navigate('Chat', { 
                                        conversationData: {
                                            id: isHost ? `${carId}-$${myId}-${anotherUserId}` : `${carId}-$${anotherUserId}-${myId}`,
                                            custom: data.conversation.custom,
                                        },
                                        otherUser: {
                                            id: anotherUserId,
                                            name: anotherUserName,
                                        },
                                        onPressBack: () => api.navigation.navigate('Chats')
                                    })
                                }
                            }
                        }
                    }
                });
            });
    
            return () => {
                unsubscribe()
            };
        }
        
    }, [unreadMessages, isOnChatScreen]);

    useEffect(() => {
        dispatch(actions.setUnreadMessagesCount(unreadMessages.length));
    }, [unreadMessages]);

    useEffect(() => {
        
        if (isOnChatScreen) {

            unreadMessages.length !== 0 && dispatch(actions.setUnreadMessages([]));
            unreadMessagesCount   !== 0 && dispatch(actions.setUnreadMessagesCount(0));

            const setChatOpenTime = async () => {
                await api.storage.set('chatOpenTime', new Date().getTime().toString());
            }; 

            setChatOpenTime();
        };

    }, [isOnChatScreen])

    return <></>
};

export default NotificationsHandler;
