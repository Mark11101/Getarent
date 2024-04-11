import React from 'react'
import { View, TouchableOpacity } from 'react-native'
import theme from '../../theme'
import { CroppedStarSvg } from '../Svg'

const StarsRating = ({ value, total = 5, onChange = () => {}, style }) => {
	return <View style={[ theme.styles.flexRowCentered, style ]}>
		{
			[ ...new Array(total)].map((_, idx) => <TouchableOpacity
				key={String(idx)}
				activeOpacity={0.7}
				onPress={() => onChange(idx + 1)}
			>
				<CroppedStarSvg
					width={17}
					height={16}
					color={
						value > idx
							? theme.colors.black
							: theme.colors.grey
					}
					style={{ marginRight: 5 }}
				/>
			</TouchableOpacity>)
		}
	</View>
}

export default StarsRating
