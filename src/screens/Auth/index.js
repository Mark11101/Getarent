import React from 'react';
import { View, Platform, TouchableOpacity, SafeAreaView } from 'react-native';
import s from './styles';
import { DismissKeyboardWrapper } from '../../components'
import theme from '../../theme'
import GoBackIcon from 'img/rent-out/go-back-icon.svg'
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { SignInTab, SignUpTab } from './Tabs';
import api from 'api';

const Tab = createMaterialTopTabNavigator()

export const Auth = ({ navigation, route: { params: { onAuthAction, onGoBackAction } = {} } }) => {
	return (
		<DismissKeyboardWrapper style={theme.styles.container}>
			<SafeAreaView style={{ flex: 1 }}>
				<View style={s.headerContainer}>
					<TouchableOpacity
						style={s.goBackBtn}
						onPress={() => {
							if (onGoBackAction) {
								api.navigation[onGoBackAction.type](...onGoBackAction.payload)
								navigation.setParams({
									onGoBackAction: null,
									onAuthAction: null
								})
							} else {
								if (navigation.getState().index === 0) {
									return navigation.replace('Unauthorized')
								}
								navigation.goBack()
							}
						}}
					>
						<GoBackIcon />
					</TouchableOpacity>
				</View>
				<View style={s.auth}>
					<View style={s.container}>
						<Tab.Navigator
							initialRouteName='SignUp'
							sceneContainerStyle={{
								backgroundColor: theme.colors.white,
								paddingHorizontal: theme.spacing(6),
							}}
							tabBarPressColor='transparent'
							screenOptions={{
								swipeEnabled: false,
								tabBarActiveTintColor: theme.colors.white,
								tabBarInactiveTintColor: theme.colors.blue,
								pressColor: 'transparent',
								tabBarIndicatorStyle: {
									height: Platform.OS === 'ios' ? 28 : 30,
									borderRadius: 50,
									bottom: 5,
									left: 6,
									width: '46%',
									backgroundColor: theme.colors.blue, 
								},
								tabBarStyle: {
									borderRadius: 50,
									backgroundColor: '#F5F5F7',
									padding: 5,
									marginBottom: 26,
									marginHorizontal: theme.spacing(6),
								},
								tabBarItemStyle: {
									height: Platform.OS === 'ios' ? 28 : 32,
								},
							}}
						>
							<Tab.Screen
								name='SignUp'
								children={props => (
									<SignUpTab
										{ ...props }
									/>
								)}
								options={{
									tabBarLabel: 'Регистрация',
									tabBarLabelStyle: {
										fontSize: 14,
										fontFamily: 'Inter-Regular',
										textTransform: 'capitalize',
										height: 37,
									}
								}}
							/>
							<Tab.Screen
								name='SignIn'
								children={props => (
									<SignInTab
										{ ...props }
										onAuthAction={onAuthAction}
									/>
								)}
								options={{
									tabBarLabel: 'Вход',
									tabBarLabelStyle: {
										fontSize: 14,
										fontFamily: 'Inter-Regular',
										textTransform: 'capitalize',
										height: 37,
									},
								}}
							/>
						</Tab.Navigator>
					</View>
				</View>
			</SafeAreaView>
		</DismissKeyboardWrapper>
	)
}

