import {
	View,
	Platform,
	StyleSheet,
	SafeAreaView,
	ActivityIndicator,
	KeyboardAvoidingView,
} from 'react-native';
import React from 'react';
import RNRestart from 'react-native-restart';
import * as TalkJS from '@talkjs/react-native';
import DeviceInfo from "react-native-device-info";
import { shallowEqual, useSelector, useDispatch } from 'react-redux';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';

import api from '../api';
import actions from 'actions';
import { Empty, PrimaryButton } from '../components';

import GetarentLogoIcon from '../img/logo.svg';
import SupportChatIcon from '../img/chat/support.svg';
import PreRentChatsIcon from '../img/chat/prerent.svg';
import SupportChatIconFocused from '../img/chat/support-focused.svg';
import PreRentChatsIconFocused from '../img/chat/prerent-focused.svg';

import theme from '../theme';

const Tab = createMaterialTopTabNavigator();

export default function Chats() {

	const dispatch = useDispatch();

	const { authorized, id, isBanned, scoringStatus, email } = useSelector(st => st.profile, shallowEqual);

	const getExplanationMessage = (id, isBanned) => {

		if (!id) {
			return 'Чат недоступен\nПопробуйте перезагрузить приложение'
		} else if (isBanned) {
			return 'Чат недоступен\nАккаунт заблокирован'
		}
	};

	if (!authorized || isBanned || scoringStatus === 'REJECTED' || id == null) {
		
		return (
			<SafeAreaView style={styles.body}>
				<Empty
					icon={'bubbles4'}
					iconSize={theme.normalize(120)}
					iconColor={theme.colors.lightCyan}
					text={authorized && getExplanationMessage(id, (isBanned || scoringStatus === 'REJECTED'))}
					style={styles.main}
					bottomInterface={
						!authorized
						?
							<View style={styles.toAuthBtns}>
								<PrimaryButton
									outlined
									style={{ marginBottom: 13 }}
									title='Зарегистрироваться'
									onPress={() => api.navigation.deepNavigate('ProfileRoot', 'Auth', 'SignUp')}
								/>
								<PrimaryButton
									title='Войти'
									onPress={() => api.navigation.deepNavigate('ProfileRoot', 'Auth', 'SignIn')}
								/>
							</View>
						:
							!id
							&&
								<View style={styles.toAuthBtns}>
									<PrimaryButton
										title='Перезагрузить'
										onPress={() => {
											dispatch(actions.logout());
											RNRestart.restart();
										}}
									/>
								</View>
					}
				/>
			</SafeAreaView>
		);
	};

	const isSupport = email === 'support@getarent.ru' || email === 'support-dev@getarent.ru';

	return (
		<SafeAreaView style={styles.body}>
			<Tab.Navigator
				screenOptions={{
					lazy: false,
					swipeEnabled: false,
					tabBarLabelStyle: {
						fontSize: 12,
						marginTop: 10,
						textTransform: 'capitalize',
					},
				}}
			>
				{
					isSupport
					?
						<Tab.Screen
							name="ForSupport"
							component={ChatForSupport}
							options={{
								tabBarLabel: 'Поддержка',
								tabBarIcon: () => <GetarentLogoIcon width={32} height={32} />
							}}
						/>
					:	
						<>
							<Tab.Screen
								name="Trips"
								component={PreRentChats}
								options={{
									lazy: false,
									tabBarLabel: 'Сообщения',
									tabBarIcon: ({ focused, _ }) => {
										if (focused) {
											return (
												<PreRentChatsIconFocused
													width={32}
													height={32}
												/>
											);
										}
										return <PreRentChatsIcon width={32} height={32} />;
									},
								}}
							/>
							<Tab.Screen
								name="Support"
								component={SupportChat}
								options={{
									lazy: false,
									tabBarLabel: 'Поддержка',
									tabBarIcon: ({ focused, _ }) => {
										if (focused) {
											return (
												<SupportChatIconFocused
													width={32}
													height={32}
												/>
											);
										}
										return <SupportChatIcon width={32} height={32} />;
									},
								}}
							/>
						</>
				}
			</Tab.Navigator>
		</SafeAreaView>
	);
}

const Archive = ({ feedFilter }) => {

	const { id, firstName, email, avatar } = useSelector(
		st => st.profile,
		shallowEqual
	);
	
	const devMode = useSelector(st => st.devMode);

	const isMeSupport = feedFilter.custom.category[1] === 'support';
	
	// https://talkjs.com/docs/Reference/Concepts/Users/
	// https://talkjs.com/docs/Reference/React_Native_SDK/Object_Types/User/
	const me = !isMeSupport ? {
		id: id,
		name: firstName || email,
		email: email ?? null,
		photoUrl: avatar ?? null,
		role: 'default',
	} : {
		id: 'support@getarent.ru',
		name: 'Поддержка Getarent',
		email: 'support@getarent.ru',
		phone: '+78003507780',
		photoUrl: 'https://fonts.gstatic.com/s/i/materialiconsoutlined/support_agent/v12/24px.svg',
	};
	
	const onSelectConversationHandler = ({ others, conversation }) => {

		if (others.length > 0) {
			api.navigation.navigate(
				'Chat',
				{
					conversationData: conversation,
					otherUser: others[0],
				},
				true
			);
		}
	};

	const appId = devMode ? 'tdcdkAzZ' : 'r6QYSHxp';

	return (
		<View style={styles.main}>
			<TalkJS.Session
				me={me}
				appId={appId}
				enablePushNotifications={true}
			>
				<TalkJS.ConversationList
					loadingComponent={<LoadingComponent />}
					feedFilter={feedFilter}
					onSelectConversation={onSelectConversationHandler}
				/>
			</TalkJS.Session>
		</View>
	);
}

const SupportChat = () => {

	const { id, firstName, email, avatar, role } = useSelector(
		st => st.profile,
		shallowEqual
	);
	
    const notificationsPermissionStatus = useSelector(st => st.layout.notificationsPermissionStatus);

	const devMode = useSelector(st => st.devMode);
	
	// https://talkjs.com/docs/Reference/Concepts/Users/
	// https://talkjs.com/docs/Reference/React_Native_SDK/Object_Types/User/
	const me = {
		id: id,
		name: firstName || email,
		email: email ?? null,
		photoUrl: avatar,
		role: 'default',
		// subject: id,
		// custom: null,
		// availabilityText: null,
		// locale: null,
	};

	// https://talkjs.com/docs/Reference/Concepts/Users/
	// https://talkjs.com/docs/Reference/React_Native_SDK/Object_Types/User/
	const supportUser = {
		id: 'support@getarent.ru',
		name: 'Поддержка Getarent',
		email: 'support@getarent.ru',
		phone: '+78003507780',
		photoUrl: 'https://fonts.gstatic.com/s/i/materialiconsoutlined/support_agent/v12/24px.svg',
		welcomeMessage: 'Приветствую! Чем могу быть полезен?',
		role: 'default',
		// custom: null,
		// availabilityText: null,
		// locale: null,
	};

	const conversationBuilder = TalkJS.getConversationBuilder(
		TalkJS.oneOnOneId(me, supportUser)
	);

	// https://talkjs.com/docs/Reference/React_Native_SDK/Object_Types/ConversationBuilder/#conversationattributes
	conversationBuilder.setAttributes({
		id: me.id + '-' + supportUser.id,
		custom: {
			category: 'support',
			userId: me.id,
			userOs: Platform.OS,
			userVersionOs: DeviceInfo.getSystemVersion(),
			userNotifications: notificationsPermissionStatus,
		}
	});

	conversationBuilder.setParticipant({ ...me, role: 'default' });
	conversationBuilder.setParticipant({ ...supportUser, role: 'default' });

	const appId = devMode ? 'tdcdkAzZ' : 'r6QYSHxp';

	return (
		<KeyboardAvoidingView
			behavior={'padding'}
			keyboardVerticalOffset={100}
			style={theme.styles.container}
			enabled={Platform.OS === 'android'}
		>
			<SafeAreaView style={styles.main}>
				<TalkJS.Session
					me={me}
					appId={appId}
					enablePushNotifications={true}
				>
					<TalkJS.Chatbox
						conversationBuilder={conversationBuilder}
						loadingComponent={<LoadingComponent />}
					/>
				</TalkJS.Session>
			</SafeAreaView>
		</KeyboardAvoidingView>
	);
};

const PreRentChats = () => {
	return <Archive feedFilter={{ custom: { category: ['==', 'user'] } }} />;
};

const ChatForSupport = () => {
	return <Archive feedFilter={{ custom: { category: ['==', 'support'] } }} />;
};

const LoadingComponent = () => {
	return <ActivityIndicator size="large" />;
};

const styles = StyleSheet.create({
	body: {
		...theme.styles.container,
	},
	header: {
		...theme.styles.H3,
		paddingTop: theme.spacing(5),
		marginHorizontal: theme.spacing(6),
	},
	main: {
		flex: 1,
		justifyContent: 'center',
	},
	toAuthBtns: {
		padding: 30,
	},
});
