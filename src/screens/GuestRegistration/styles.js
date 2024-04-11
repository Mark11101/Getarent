import { StyleSheet } from "react-native"
import theme from "../../theme"

export default StyleSheet.create({
	formContainer: {
		width: '100%',
		padding: 16,
		flexDirection: 'column',
		alignItems: 'flex-start',
		borderRadius: 20,
		borderStyle: 'solid',
		borderWidth: 1,
		borderColor: '#E6E6E8',
		marginBottom: 24
	},
	header: {
		fontFamily: theme.fonts.delaGothicOne,
        lineHeight: 26,
        fontSize: 22,
        marginBottom: 26,
        color: theme.colors.black,
	},
	secondaryHeader: {
		marginBottom: 16,
		fontSize: 16,
		lineHeight: 18
	},
	primaryBtn: {
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
	popupFooter: {
		marginTop: 32,
		height: 38,
		width: '100%',
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'center'
	},
	licenseText: {
		fontSize: 12,
        fontFamily: 'Inter-Regular',
        color: theme.colors.black,
	},
	text: {
		fontSize: 12,
        fontFamily: 'Inter-Regular',
        color: theme.colors.black,

		fontSize: 14,
		lineHeight: 20
	}
})
