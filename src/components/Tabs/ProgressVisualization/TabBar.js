import React, { useMemo } from 'react'
import { /* Animated,  */View, TouchableOpacity, StyleSheet, Text } from 'react-native'
import theme from '../../../theme'
import { TickSvg } from '../../Svg'

const ProgressVisualizationTabBar = ({ state, descriptors, navigation, /*  position,  */filledTabsCount, disableOnPress, forbiddenRoutes = [] }) => {
  	return  <View style={{ flexDirection: 'row', marginVertical: 24, marginHorizontal: 5 }}>
	  	{
			state.routes.map((route, index) => {
				const isFirst = useMemo(() => index === 0, [ index ])
				const isLast = useMemo(() => index === (state.routes.length - 1), [ index, state.routes.length ])
				const isPassed = useMemo(() => (filledTabsCount - 1) >= index, [ index, filledTabsCount ])

				const { options } = descriptors[route.key]
				const label = options.tabBarLabel !== undefined
					? options.tabBarLabel
					: options.title !== undefined
					? options.title
					: route.name

				const isFocused = state.index === index

				const _onPress = () => {
					const event = navigation.emit({
						type: 'tabPress',
						target: route.key,
						canPreventDefault: true,
					})

					if (!isFocused && !event.defaultPrevented && isPassed && !forbiddenRoutes.includes(route.name)) {
						navigation.navigate(route.name, route.params)
					}
				}

				const _onLongPress = () => {
					navigation.emit({
						type: 'tabLongPress',
						target: route.key,
					})
				}

				// const inputRange = state.routes.map((_, i) => i)
				// const opacity = position.interpolate({
				// 	inputRange,
				// 	outputRange: inputRange.map(i => (i === index ? 1 : 0))
				// })

				return <TouchableOpacity
					key={route.name}
					accessibilityRole="button"
					accessibilityState={isFocused ? { selected: true } : {}}
					accessibilityLabel={options.tabBarAccessibilityLabel}
					testID={options.tabBarTestID}
					activeOpacity={1}
					onPress={() => !disableOnPress && _onPress()}
					onLongPress={() => !disableOnPress && _onLongPress()}
					style={styles.tab}
				>

					<TickSvg active={isPassed} />

					{
						!isFirst && <View
							style={[
								styles.progressBar,
								{ left: 0 },
								index < filledTabsCount ? { backgroundColor: theme.colors.blue } : null
							].filter(Boolean)}
						/>
					}
					{
						!isLast && <View
							style={[
								styles.progressBar,
								{ right: 0 },
								index < (filledTabsCount - 1) ? { backgroundColor: theme.colors.blue } : null
							].filter(Boolean)}
						/>
					}
				
					<Text style={[
						styles.tabLabel,
						isFocused ? { color: theme.colors.blue } : null
					].filter(Boolean)}>
						{ label }
					</Text>
				</TouchableOpacity>
			})
		}
	</View>
}

const styles = StyleSheet.create({
	tab: {
		flex: 1,
		height: 50,
		alignItems: 'center',
		justifyContent: 'space-between'
	},
	progressBar: {
		position: 'absolute',
		top: 11,
		zIndex: -1,
		width: '50%',
		height: 2,
		backgroundColor: theme.colors.svgLightGrey
	},
	tabLabel: {
		fontFamily: 'Inter',
		fontSize: theme.normalize(12),
		marginHorizontal: -5,
		textAlign: 'center',
		color: theme.colors.black
	}
})

export default ProgressVisualizationTabBar
