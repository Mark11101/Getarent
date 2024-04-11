import React from 'react'
import { View, TouchableOpacity } from 'react-native'

export const ConditionallyTouchable = ({ onPress, children, ...props }) => {
	return onPress?.call
		? <TouchableOpacity activeOpacity={0.7} onPress={onPress} { ...props }>
			{ children }
		</TouchableOpacity>
		: <View { ...props }>
			{ children }
		</View>
}

export default ConditionallyTouchable
