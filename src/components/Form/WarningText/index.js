import React from 'react'
import { Text, View } from 'react-native'
import styles from './styles'
import theme from '../../../theme'
import { WarningSvg } from '../../Svg'

export const WarningText = ({ message, error = false, containerStyle }) => {
	return <View
		style={[
			styles.container,
			...Array.isArray(containerStyle)
				? containerStyle
				: [ containerStyle ]
		]}
	>
		<WarningSvg
			style={styles.icon}
			color={theme.colors[error ? 'red' : 'svgLightGrey']}
		/>
		<Text
			style={[
				styles.message,
				{ color: theme.colors[error ? 'red' : 'black'] }
			]}
		>
			{ message }
		</Text>
	</View>
}
