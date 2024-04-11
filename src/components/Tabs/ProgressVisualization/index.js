import React from 'react'
import { Dimensions } from 'react-native'
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs'
import ProgressVisualizationTabBar from './TabBar'
import { useNavigation } from '@react-navigation/native'
import PreventGoingBack from '../../PreventGoingBack'

const Tabs = createMaterialTopTabNavigator()

const ProgressVisualizationTabs = ({
	children,
	passedSteps = [],
	disableOnPress,
	forbiddenRoutes,
	initialRouteName
}) => {
	const navigation = useNavigation();

	return <Tabs.Navigator
		initialRouteName={initialRouteName}
		style={{
			flex: 1,
			height: Dimensions.get('window').height
		}}
		tabBar={props => <ProgressVisualizationTabBar
			filledTabsCount={passedSteps.length + 1}
			forbiddenRoutes={forbiddenRoutes}
			disableOnPress={disableOnPress}
			{ ...props }
		/>}
	>
		{
			React.Children.map(children, child => {
				if (React.isValidElement(child)) return <Tabs.Screen
					name={child.props.name}
					children={props => {
						const { onBack, ...childProps } = child.props

						return <PreventGoingBack>
							{
								React.cloneElement(child, {
									...childProps,
									...props,
									navigation: navigation,
									isPassed: passedSteps.includes(child.props.name)
								})
							}
						</PreventGoingBack>
					}}
					options={{
						swipeEnabled: false,
						title: child.props.title
					}}
				/>
			})
		}
	</Tabs.Navigator>
}

export default ProgressVisualizationTabs
