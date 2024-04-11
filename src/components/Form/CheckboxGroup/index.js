import React from 'react'
import { StyleSheet, View } from 'react-native'
import compare from '../../../libs/compare'

export const CheckboxGroup = ({
	children, style, value = {}, onChange,
	valueKey = 'value', onPressKey = 'onPress', nameKey = 'name'
}) => {
	const [ state, setState ] = React.useState(value)

	React.useEffect(() => {
		if (!compare.props()(state, value)) {
			setState(value)
		}
	}, [ value ])

	React.useEffect(() => {
		onChange(state)
	}, [ state ])

	const _onChange = name => {
		setState(prev => ({
			...prev,
			[name]: !prev[name]
		}))
	}

	return <View style={[ styles.container, style ]}>
		{
			React.Children.map(children, child => {
				if (React.isValidElement(child)) {
					return React.cloneElement(child, {
						...child.props,
						
						[valueKey]: state[child.props[nameKey]],
						[onPressKey]: () => _onChange(child.props[nameKey])
					})
				}
			})
		}
	</View>
}

const styles = StyleSheet.create({
	container: {
		flexDirection: 'row',
		flexWrap: 'wrap'
	}
})
