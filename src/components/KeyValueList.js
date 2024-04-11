import React from 'react'
import { Platform, StyleSheet, Text, View } from 'react-native'
import theme from '../theme'

const KeyValueList = ({ items }) => {

	return <View style={listStyles.list}>
		{
			items.map(item => <View key={item.key} style={listStyles.item}>
				<View style={listStyles.label}>
					<Text style={listStyles.text}>
						{ item.key }
					</Text>
					<View style={listStyles.bar} />
				</View>

				<Text style={[ listStyles.value, listStyles.text ]}>
					{ item.value }
				</Text>
			</View>)
		}
	</View>
}

const listStyles = StyleSheet.create({
	list: {
		flex: 1
	},
	item: {
		flexDirection: 'row',
		marginBottom: 16
	},
	label: {
		width: '50%',

		alignItems: 'flex-start',
		flexDirection: 'row'
	},
	value: {
		width: '50%'
	},
	text: {
		fontFamily: 'Inter-Regular',
		fontSize: 14,
		color: theme.colors.black,
		lineHeight: 18
	},
	bar: {
		marginLeft: 8,
		marginRight: 16,
		height: 9,
		flex: 1,
		borderBottomWidth: 1,
		borderStyle: Platform.OS === 'android' ? 'dashed' : 'solid',
		borderColor: theme.colors.svgLightGrey
	}
})

export default KeyValueList
