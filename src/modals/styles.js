import { StyleSheet } from 'react-native'
import theme from '../theme'

const styles = StyleSheet.create({
	title: {
		fontFamily: theme.fonts.delaGothicOne,
		color: theme.colors.black,

		marginBottom: 16,
		fontSize: 16,
		lineHeight: 18,

		marginVertical: 16,
		textAlign: 'center'
	},
	text: {
        fontFamily: theme.fonts.inter,
        color: theme.colors.black,
		fontSize: 14,
		lineHeight: 20,
		textAlign: 'center'
	},
	popupFooter: {
		marginTop: 32,
		height: 38,
		width: '100%',
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'center'
	},
	submitBtn: {
		borderRadius: 30, 
        height: 38,

		alignSelf: 'flex-start',
		justifyContent: 'center',
		alignItems: 'center',

		paddingHorizontal: 20,

		fontSize: 16,
		lineHeight: 22,
		marginRight: 16,
		marginBottom: 24
	},
	secondaryBtn: {
		alignSelf: 'flex-start',
		justifyContent: 'center',
		alignItems: 'center',

		height: 38,
		marginTop: 0
	},
	radioGroup: {
		marginTop: 32,
		alignItems: 'flex-start'
	},
	radioBtn: {
		marginBottom: 5,
	},
	radioLabel: {
		marginLeft: 10,
	}
})

export default styles
