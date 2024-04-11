import { StyleSheet } from 'react-native'
import theme from '../../../theme'

const styles = StyleSheet.create({
	container: {
		position: 'absolute',
		left: 0,
		bottom: -18,
		flexDirection: 'row',
		alignItems: 'center',
		height: 18
	},
	icon: {
		marginRight: 6
	},
	message: {
		fontFamily: theme.fonts.inter,
		fontSize: 12,
		lineHeight: 18
	}
})

export default styles
