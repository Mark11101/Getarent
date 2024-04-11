/**
 * @format
 */

import React from 'react';
import 'react-native-gesture-handler';
import { AppRegistry } from 'react-native';
import notifee from '@notifee/react-native';
import messaging from '@react-native-firebase/messaging';
import { registerPushNotificationHandlers } from '@talkjs/react-native';

import App from './src/App';
import api from './src/api';
import { name as appName } from './app.json';

import { initMyTracker } from './src/myTrackerService';
initMyTracker();

registerPushNotificationHandlers(
	{
		channelId: 'chat',
		channelName: 'Chat Messages',
	},
	{
		sound: true,
		badge: true,
		alert: true,
	}
).then(pushNotificationHandler =>
	console.log('TalkJS deviceToken', pushNotificationHandler.deviceToken)
);

const onNotificationReceived = async (remoteMessage) => {

	if (typeof remoteMessage.data?.talkjs === 'string') {

		try {
			const talkjsData = JSON.parse(remoteMessage.data.talkjs);

			await notifee.displayNotification({
				title: talkjsData.sender.name,
				body: talkjsData.message.text,
				data: {
					senderId: talkjsData.sender.id,
					type: !!talkjsData ? 'talkjs' : 'service',
					conversationId: talkjsData.conversation.id,
					name: talkjsData.sender.name,
					photoUrl: talkjsData.sender.photoUrl || '',
					custom: talkjsData.conversation.custom,
				},
				android: {
					channelId: 'chat',
					smallIcon: 'ic_small_icon',
					color: 'black',
					pressAction: {
						id: 'default',
					},
				},
			});
		} catch (error) {
			console.log(`Display Chat Notification error`, error);
		}

		return
	};
};

messaging().setBackgroundMessageHandler(onNotificationReceived);

function HeadlessCheck({ isHeadless }) {

	if (isHeadless) {
		// App has been launched in the background by iOS, ignore
		return null;
	}

	return <App />;
}

AppRegistry.registerComponent(appName, () => HeadlessCheck);
