import { StyleSheet } from "react-native"
import theme from '../../../theme'

const styles = StyleSheet.create({
	sceneContainer: {
		paddingHorizontal: 16,
		backgroundColor: theme.colors.white,
		paddingTop: 16,
	},
	tabBar: {
		marginHorizontal: 16,
		borderRadius: 20,
		backgroundColor: '#F5F5F7',
		height: 58,

		indicator: {
			height: 48,
			width: '47%',
			borderRadius: 14,
			margin: 5,
			backgroundColor: theme.colors.blue
		},
		item: {
			height: '100%'
		},
		label: {
			fontSize: 14,
			fontFamily: theme.fonts.inter,
			textTransform: 'none'
		}
	}
})

export default styles
