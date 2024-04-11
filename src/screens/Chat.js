import {
	View,
	Text,
	Platform,
	StyleSheet,
	SafeAreaView,
	TouchableOpacity,
	ActivityIndicator,
	KeyboardAvoidingView,
} from 'react-native';
import * as TalkJS from '@talkjs/react-native';
import DeviceInfo from "react-native-device-info";
import React, { useEffect, useState } from 'react';
import { shallowEqual, useSelector, useDispatch } from 'react-redux';

import api from '../api';
import actions from 'actions';
import { userToChatUser } from '../functions';
import { Header, Waiter } from '../components';

import theme from 'theme';

export default function Chat({
	route: {
		params: { 
			conversationData, 
			otherUser, 
			chatId, 
			onPressBack, 
			withoutScreenLink = false,
		},
	},
}) {
	
	const dispatch = useDispatch();

	const {
		id,
		role,
		email,
		avatar,
		firstName,
	} = useSelector(st => st.profile, shallowEqual);

	const unreadMessages = useSelector(st => st.layout.unreadMessages);
    const notificationsPermissionStatus = useSelector(st => st.layout.notificationsPermissionStatus);

	const devMode = useSelector(st => st.devMode);

	const appId = devMode ? 'tdcdkAzZ' : 'r6QYSHxp';

	const [conversationBuilder, setConversationBuilder] = useState();

	const me = userToChatUser({
		uuid: id,
		email: email,
		avatar: avatar,
		firstName: firstName || email,
	});

	useEffect(() => {

		const buildConversationBuilder = async () => {

			let convBuilder = {};

			if (conversationData == null) {

				if (chatId == null) {
					
					convBuilder = TalkJS.getConversationBuilder(
						TalkJS.oneOnOneId(me, otherUser)
					);

				} else {
					convBuilder = TalkJS.getConversationBuilder(chatId);
				}

			} else {

				convBuilder = TalkJS.getConversationBuilder(
					conversationData.id
				);

				const isHost = role === 'HOST';

				let custom = {};
			
				if (isHost) {
					custom = {
						category: 'user',
						hostId: id,
						hostOs: Platform.OS,
						hostVersionOs: DeviceInfo.getSystemVersion(),
						hostNotifications: notificationsPermissionStatus,
					}
				} else {
					custom = {
						category: 'user',
						guestId: id,
						guestOs: Platform.OS,
						guestVersionOs: DeviceInfo.getSystemVersion(),
						guestNotifications: notificationsPermissionStatus,
					}
				}

				convBuilder.setAttributes({
					...conversationData,
					custom: {
						...conversationData.custom,
						...custom,
					}
				});
			};

			convBuilder.setParticipant({ ...me, role: 'default' });

			if (otherUser) {

				otherUser.phone = null; // E.164 standard
				convBuilder.setParticipant({ ...otherUser, role: 'default' });

			} else if (chatId) {
				
				const hostId = chatId.substring(37, 73);
				const guestId = chatId.substring(74);

				const otherUserId = role === 'HOST' ? guestId : hostId;

				const { firstName, avatar, email } = await api.web.profile(
					otherUserId
				);

				const other = userToChatUser({
					uuid: otherUserId,
					firstName: firstName,
					avatar: avatar,
					email: email,
				});

				convBuilder.setParticipant({ ...other, role: 'default' });
			}

			setConversationBuilder(convBuilder);
		};

		buildConversationBuilder();

		// Decrease unread messages number

		return () => {

			const filteredUnreadMessages = !!conversationData && unreadMessages?.filter((unreadMessage) => {
	
				if (unreadMessage.sender?.id) {
					return role === 'HOST'
						? unreadMessage.sender.id !== conversationData.custom.hostId
						: unreadMessage.sender.id !== conversationData.custom.guestId
				} else if (unreadMessage.notification?.data?.senderId) {
					return role === 'HOST'
						? unreadMessage.notification.data.senderId !== conversationData.custom.hostId
						: unreadMessage.notification.data.senderId !== conversationData.custom.guestId
				}
			});
			
			filteredUnreadMessages.length !== 0 
			&& 
				dispatch(actions.setUnreadMessages(filteredUnreadMessages));
		}
		
	}, []);

	return (
		<KeyboardAvoidingView
			style={styles.body}
			behavior={'padding'}
			keyboardVerticalOffset={30}
			enabled={Platform.OS === 'android'}
		>
			<SafeAreaView style={styles.body}>
				<Header 
					title="Чат"
					onPressBack={() => {
						onPressBack ? onPressBack() : api.navigation.goBack();
					}} 
				>
					{
						(!!conversationData.custom.rentId || !!conversationData.custom.carId) && !withoutScreenLink
						&&
							<View style={{ width: '80%', paddingTop: 4 }}>
								<TouchableOpacity style={{ alignSelf: 'flex-end' }} onPress={() => 
									!!conversationData.custom.rentId
									?
										api.navigation.navigate('RentRoom', { 
											uuid: conversationData.custom.rentId,
										})
									:
										api.navigation.navigate('Car', { uuid: conversationData.custom.carId })
								}>
									<Text style={{ color: theme.colors.blue }}>
										{
											!!conversationData.custom.rentId
											?
												'Перейти к аренде'
											:
												'Перейти к автомобилю'
										}
									</Text>
								</TouchableOpacity>
							</View>
					}
				</Header>
				<View style={styles.main}>
					<TalkJS.Session
						me={me}
						appId={appId}
						enablePushNotifications={true}
					>
						{
							conversationBuilder 
							?
								<TalkJS.Chatbox
									conversationBuilder={conversationBuilder}
									loadingComponent={<ActivityIndicator size="large" />}
								/>
							:
								<Waiter />
						}
					</TalkJS.Session>
				</View>
			</SafeAreaView>
		</KeyboardAvoidingView>
	);
}

const styles = StyleSheet.create({
	body: {
		...theme.styles.container,
	},
	main: {
		flex: 1,
		justifyContent: 'center',
	},
	link: {
		position: 'absolute',
		top: 0,
		width: '100%',
		height: 65,
		zIndex: 1000,
	}
});
