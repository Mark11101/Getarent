import React from 'react'
import { StyleSheet } from 'react-native'
import { TextInput } from 'react-native-gesture-handler'
import theme from '../../../theme'

export const TextArea = ({ value = '', onChange, style, ...props }) => {

	return <TextInput
		multiline
		style={[ styles.container, ...(Array.isArray(style) ? style : [ style ]) ]}
		value={value}
		onChangeText={text => onChange(text)}

		{ ...props }
	/>
}

const styles = StyleSheet.create({
	container: {
		borderRadius: 19,
		paddingVertical: 9,
		paddingRight: 10,
		paddingLeft: 18,

		borderWidth: 1,
		borderColor: theme.colors.svgLightGrey,

		minHeight: 152,

		...theme.styles.text
	}
})
