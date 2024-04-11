import React, { useMemo } from 'react'
import theme from '../../../theme'
import { Animated, StyleSheet, View } from 'react-native'

export const GhostLabel = ({ children, label, getValue = props => props.value, ...props }) => {
	const [ value ] = useMemo(
		() => React.Children.map(children, child => React.isValidElement(child) && getValue(child.props)),
		[ children ]
	)

	const labelOpacity = React.useRef(new Animated.Value(value ? 0 : 1)).current

	React.useEffect(() => {
		Animated.timing(labelOpacity, {
			toValue: value ? 1 : 0,
			duration: 150,
			useNativeDriver: true,
		}).start()
	}, [ labelOpacity, value ])

	return <View style={[ styles.container, props.containerStyle ]}>
		{
			!!label && <Animated.Text style={[ styles.label, props.labelStyle, { opacity: labelOpacity } ]}>
				{ label }
			</Animated.Text>
		}
		{ children }
	</View>
}

const styles = StyleSheet.create({
	container: {
		width: '100%',
		marginBottom: 30
	},
	label: {
		position: 'absolute',
		left: 13,
		top: -10,
		zIndex: 2,

		color: '#878F9B',
		fontFamily: theme.fonts.inter,
		fontSize: 12,
		lineHeight: 20,
		backgroundColor: theme.colors.backgroundWhite,
		paddingHorizontal: 5,
		alignItems: 'flex-start'
	}
})
