import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'

const Stack = createNativeStackNavigator()

function isReactFragment(variableToInspect) {
	if (variableToInspect.type) {
		return variableToInspect.type === React.Fragment
	}
	return variableToInspect === React.Fragment
}

const mapChildren = children => React.Children.map(children, child => {
	if (React.isValidElement(child)) {
		if (isReactFragment(child)) return mapChildren(child.props.children)

		const { options, ...childProps } = child.props
		
		return <Stack.Screen
			name={child.props.name}
			children={props => React.cloneElement(child, {
				...childProps,
				...props
			})}
			options={{
				// swipeEnabled: false,
				// lazy: true,
				
				...options
			}}
		/>
	}
}).flat(3)

export const NestedNavigation = ({
	children,
	initialRouteName,
	...props
}) => {
	return <Stack.Navigator
		initialRouteName={initialRouteName}
		stackPresentation="containedModal"
		screenOptions={{ headerShown: false }}

		{ ...props }
	>
		{ mapChildren(children) }
	</Stack.Navigator>
}

export default NestedNavigation
