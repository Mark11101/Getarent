import React from 'react'
import { View, Text } from 'react-native'
import styles from './styles'
import ConditionallyTouchable from '../ConditionallyTouchable'

const Banner = ({
	icon, title, titleStyles, desc, descStyles,
	backgroundColor = 'transparent', style,
	button, onPress, contentWidth
}) => {

	return <ConditionallyTouchable
		style={[ styles.container, { backgroundColor }, style ]}
		onPress={onPress}
	>
		<View style={[ styles.content, { width: contentWidth || '80%'} ]}>
			{
				!!title && <Text style={[ styles.title, titleStyles ]}>
					{ title }
				</Text>
			}
			{
				!!desc && <Text style={[ styles.desc, descStyles ]}>
					{ desc }
				</Text>
			}
			{ button }
		</View>

		{
			!!icon && React.cloneElement(icon, {
				...icon.props,

				style: [ styles.icon, (icon.props.style || {}) ]
			})
		}

	</ConditionallyTouchable>
}

export default Banner
