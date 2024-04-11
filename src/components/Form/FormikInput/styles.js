import { StyleSheet } from "react-native"
import theme from '../../../theme'

const inputLabelhorizontalPadding = 5

const styles = StyleSheet.create({
	container: {
		width: '100%',
		marginBottom: 30
	},
	input: {
		fontSize: 14,
		borderRadius: 50,
		height: 38,
		paddingVertical: 0,
	},
	internalInput: {
		width: '100%',
		marginTop: 0,
		marginBottom: 0
	},
	label: {
		position: 'absolute',
		left: 18 - inputLabelhorizontalPadding,
		top: -10,
		zIndex: 2,

		color: '#878F9B',
		fontFamily: theme.fonts.inter,
		fontSize: 12,
		lineHeight: 20,
		backgroundColor: theme.colors.backgroundWhite,
		paddingHorizontal: inputLabelhorizontalPadding,
		alignItems: 'flex-start'
	},
	clearBtn: {
		position: 'absolute',
		right: 0,
		top: 0,
		zIndex: 2,

		width: 48.5,
		height: 38,
		alignItems: 'center',
		justifyContent: 'center'
	}
})

export default styles
