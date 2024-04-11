import React from 'react'
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs'
import theme from '../../../theme'
import styles from './styles'
import { isIos } from '../../../constants/app'
// import { Keyboard } from 'react-native'

const Tab = createMaterialTopTabNavigator()

const defaultScreenOptions = {
	tabBarActiveTintColor: theme.colors.white,
	tabBarInactiveTintColor: theme.colors.blue,
	tabBarPressColor: 'transparent',
	tabBarStyle: styles.tabBar,
	tabBarIndicatorStyle: styles.tabBar.indicator,
	tabBarItemStyle: styles.tabBar.item
}

const Tabs = ({
	children,
	screenOptions = () => ({}),
	sceneContainerStyle,
	...props
}) => {
	return <Tab.Navigator
		sceneContainerStyle={[ styles.sceneContainer, sceneContainerStyle ]}
		// keyboardDismissMode='on-drag'
		screenOptions={{
			...defaultScreenOptions,
			...screenOptions(defaultScreenOptions),

			animationEnabled: true /* !isIos */ // IOS sometimes freezing on animated tab change while keyboard is open 
		}}
		{ ...props }
	>
		{
			React.Children.map(children, child => {
				if (React.isValidElement(child)) return <Tab.Screen
					name={child.props.name}
					children={props => {
						return React.cloneElement(child, {
							...child.props,
							...props,
						})
					}}
					options={{
						title: child.props.title,
						tabBarLabelStyle: styles.tabBar.label,
					}}
				/>
			})
		}
		
	</Tab.Navigator>
}

export default Tabs
