import { StyleSheet } from 'react-native'
import theme from '../../theme'

const styles = StyleSheet.create({
	container: {
		width: '100%',

		flexDirection: 'row',
		alignItems: 'center',

		padding: 16,
		marginBottom: 16,

		borderRadius: 20,

		overflow: 'hidden'
	},
	content: {

	},
	title: {
		color: '#fff',
		fontFamily: 'Inter',
		fontSize: 16,
		fontWeight: '400',
		lineHeight: 24
	},
	desc: {
		color: theme.colors.greyBlue,
		fontFamily: 'Inter',
		fontSize: 12,
		fontWeight: '400',
		lineHeight: 18
	},
	icon: {
		position: 'absolute',
		right: -10,
		top: 0,
		zIndex: -1
	}
})

export default styles
