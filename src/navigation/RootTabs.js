import React, { useCallback, useMemo } from 'react'
import { View, StyleSheet, Platform } from 'react-native'
import { useDispatch, useSelector, shallowEqual } from 'react-redux'
import api from '../api'
import actions from '../actions'
import { SlideDownPanel, SearchBar } from '../components'
import { useSearchControlsOffset, useSafeSpacing } from '../hooks'
import theme from '../theme'
import * as PS from '../store/profile/selectors'
import compare from '../libs/compare'
import DeviceInfo from 'react-native-device-info'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { Trips, Chats } from '../screens'
import MyCarStack from './MyCarsStack'
import ProfileStack from './ProfileStack'
import SearchStack from './SearchStack'
import { ROLE } from '../constants/roles'

import SearchIconInactive from 'img/bottom-tabs/search_inactive.svg'
import RentsIconInactive from 'img/bottom-tabs/rents_inactive.svg'
import RentOutIconInactive from 'img/bottom-tabs/rent-out_inactive.svg'
import ChatsIconInactive from 'img/bottom-tabs/chats_inactive.svg'
import ProfileIconInactive from 'img/bottom-tabs/profile_inactive.svg'
import SearchIconActive from 'img/bottom-tabs/search_active.svg'
import RentsIconActive from 'img/bottom-tabs/rents_active.svg'
import RentOutIconActive from 'img/bottom-tabs/rent-out_active.svg'
import ChatsIconActive from 'img/bottom-tabs/chats_active.svg'
import ProfileIconActive from 'img/bottom-tabs/profile_active.svg'
import { ModalFactory } from 'react-await-modal'
import popupFactory from '../modals/popupFactory'

const Tab = createBottomTabNavigator()

const TABS = {
	SEARCH: 'LocationTab',
	TRIPS: 'Trips',
	CARS: 'Cars',
	CHATS: 'Chats',
	PROFILE: 'ProfileRoot'
}

const icons = {
	[TABS.SEARCH]: isActive => isActive ? <SearchIconActive widtth={22} height={22} /> : <SearchIconInactive widtth={22} height={22} />,
	[TABS.TRIPS]: isActive => isActive ? <RentsIconActive widtth={21} height={21} /> : <RentsIconInactive widtth={21} height={21} />,
	[TABS.CARS]: isActive => isActive ? <RentOutIconActive widtth={24} height={24} /> : <RentOutIconInactive widtth={24} height={24} />,
	[TABS.CHATS]: isActive => isActive ? <ChatsIconActive widtth={20} height={20} /> : <ChatsIconInactive widtth={20} height={20} />,
	[TABS.PROFILE]: isActive => isActive ? <ProfileIconActive widtth={22} height={22} /> : <ProfileIconInactive widtth={22} height={22} />,
}

const isActiveStyle = (tab, activeTab) => ({
	color: tab === activeTab ? theme.colors.blue : theme.colors.black
})

const Tabs = ({ setOnChatScreen, unreadMessagesCount }) => {
	const [ tab, setTab ] = React.useState('LocationTab')

	const role = useSelector(PS.roleSelector, compare.values)
	const isHostCarAdded = useSelector(PS.isHostCarAddedSelector, compare.values)

	const TAB_COMPONENTS = useMemo(() => [
		{ id: TABS.SEARCH, label: 'Поиск', Component: SearchStack },
		{ id: TABS.TRIPS, label: 'Аренды', Component: Trips },
		{
			id: TABS.CARS,
			label: isHostCarAdded ? 'Мои авто' : 'Добавить авто',
			Component: MyCarStack,
			options: {
				lazy: false,
				tabBarItemStyle: {
					marginHorizontal: isHostCarAdded ? 0 : 15
				}
			}
		},
		{
			id: TABS.CHATS,
			label: 'Чаты',
			Component: Chats,
			options: {
				tabBarBadge: !!unreadMessagesCount ? unreadMessagesCount : null,
			}
		},
		{ id: TABS.PROFILE, label: 'Профиль', Component: ProfileStack },
	], [
		isHostCarAdded,
		unreadMessagesCount,
		role
	])

	return (
		<Tab.Navigator
			screenOptions={{ 
				headerShown: false,
				tabBarStyle: styles.tabsContainer,
			}}
			screenListeners={{
				state: e => {
					const { index, routeNames } = e.data.state
					
					const activeTab = routeNames[index]
					setTab(activeTab)

					setOnChatScreen(activeTab === TABS.CHATS)
				},
			}}
		>
			{
				TAB_COMPONENTS
					.filter(({ id }) => id === TABS.CARS ? role !== ROLE.GUEST : true)
					.map(({ id, label, Component, options = {} }) => (
						<Tab.Screen
							key={id} name={id}
							component={Component}
							options={{
								tabBarLabel: label,
								tabBarIcon: () => icons[id](tab === id),
								tabBarLabelStyle: [ styles.tabsLabel, isActiveStyle(id, tab) ],

								...options
							}}
						/>
					))
			}
		</Tab.Navigator>
	)
}


const RootTabs = (props) => {
	const dispatch = useDispatch()
	const handlers = useSearchControlsOffset()

	const { isOnChatScreen, unreadMessagesCount } = useSelector(state => state.layout, shallowEqual)
	const searchBar = useSelector(state => state.search.searchBar, compare.values)

	const panelStyle = useSafeSpacing('top', 'paddingTop', 6, styles.panel)
	
	const onClose = useCallback(
		() => dispatch(actions.toggleSearchBar(false)),
		[ dispatch ]
	)

	const onBackPress = useCallback(() => {
		const { name } = api.navigation.getCurrentRoute()

		if (name !== 'DatePicker') {
			onClose()
			return true
		}
	}, [ onClose ])

	return (
		<View style={theme.styles.flex} { ...handlers }>
			<Tabs 
				{ ...props } 
				unreadMessagesCount={unreadMessagesCount}
				setOnChatScreen={(condition) => (
					((isOnChatScreen && !condition) || (!isOnChatScreen && condition))
					&&
						dispatch(actions.setOnChatScreen(condition))
				)}
			/>
			<ModalFactory.Manager ref={popupFactory.setRef.bind(popupFactory)} />
			<SlideDownPanel
				style={panelStyle}
				open={searchBar}
				{ ...{ onClose, onBackPress } }
			>
				<SearchBar />
			</SlideDownPanel>
		</View>
	)
}

export default RootTabs

const styles = StyleSheet.create({
	panel: {
		padding: theme.spacing(6),
		backgroundColor: theme.colors.white,
		borderBottomLeftRadius: theme.borderRadius,
		borderBottomRightRadius: theme.borderRadius,
	},
	tabsContainer: {
		flexDirection: 'row',
		// position: 'absolute',
		backgrondColor: theme.colors.white,
		height: DeviceInfo.hasNotch() ? theme.normalize(93) : theme.normalize(60),
	},
	tabsLabel: {
		...theme.styles.src.XS,
		fontSize: Platform.OS === 'ios' ? 11 : 10,
		marginBottom: theme.spacing(1.5),
		width: 100,
	}
})
