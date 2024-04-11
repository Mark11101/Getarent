import { StyleSheet } from 'react-native'
import theme from 'theme'
import { WINDOW_HEIGHT, WINDOW_WIDTH } from '../../constants/app'

const styles = StyleSheet.create({
	modal: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center',
		backgroundColor: 'rgba(0,0,0,0.5)',
	},
	modalPanel: {
		padding: 40,
		borderRadius: 20,
		alignItems: 'center',
		backgroundColor: theme.colors.white,
		width: WINDOW_WIDTH * 0.9,
		maxHeight: WINDOW_HEIGHT * 0.9,
	},
	modalCloseBtn: {
		position: 'absolute',
		right: 16 - 20,
		top: 16 - 20,
		padding: 20
	}
})

export default styles
