import React from 'react'
import { View, Text } from 'react-native'
import styles from './styles'
import { formatRating } from '../../functions'
import { StarSvg } from '../Svg'

const InlineRating = ({ value, backgroundColor = '#fff', color = '#222', style }) => {

	return <View style={[ styles.inlineContainer, { backgroundColor }, style ]}>
		<Text style={[ styles.inlineValue, { color } ]}>
			{ formatRating(value) }
		</Text>

		<StarSvg color={color} style={{ marginLeft: 4 }} />
	</View>
}

export default InlineRating
