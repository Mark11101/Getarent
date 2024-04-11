import { StyleSheet, Dimensions } from "react-native";

import theme from "theme";
import authStyles from '../../screens/Auth/styles';

const HEIGHT = Dimensions.get('window').height;

export default StyleSheet.create({

	...theme.row,
	...theme.margins,
	
	container: {
		flex: 1,
		height: '100%',
		paddingTop: 25,
		backgroundColor: theme.colors.white,
	},
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
	text: {
		...authStyles.licenseText,
		fontSize: 14,
		lineHeight: 20,
		textAlign: 'center',
		marginBottom: 10,
	},

	scrollView: {
		paddingHorizontal: 16,
		backgroundColor: theme.colors.white,
	},
	panel: {
		borderWidth: 1,
		borderRadius: 20,
		borderColor: '#E6E6E8',
		padding: 16,

		title: {
			fontFamily: 'DelaGothicOne-Regular',
			fontSize: 16,
			lineHeight: 18,
			color: theme.colors.black,
			marginBottom: 16,
		},

		infoMessage: {
			fontFamily: 'Inter-Regular',
			fontSize: 12,
			lineHeight: 18,
			color: theme.colors.black,
		},

		resumeBtn: {
			paddingHorizontal: 20,
			fontSize: 16,
			lineHeight: 22,
			marginRight: 24,
			borderRadius: 30, 
			height: 38,
		}
	},
	defaultText: {
		fontFamily: 'Inter-Regular',
		fontSize: theme.normalize(12),
		lineHeight: 20,
		color: theme.colors.black,
	},
	radio: {

		text: {
			fontFamily: 'Inter-Regular',
			fontSize: 14,
			lineHeight: 20,
			color: theme.colors.black,
		}
	},
	checkBox: {

		text: {
			fontFamily: 'Inter-Regular',
			fontSize: 14,
			lineHeight: 20,
			color: theme.colors.black,
			marginLeft: -5,
			textDecorationLine: "none",
		}
	},
	timeSelector: {

		borderWidth: 1,
		borderRadius: 50,
		borderColor: '#DBE3EF',
		paddingHorizontal: 20,
		paddingVertical: 9,
		marginBottom: 16,

		text: {
			fontFamily: 'Inter-Regular',
			fontSize: 14,
			lineHeight: 20,
			color: theme.colors.black,
		}
	},
	picker: {
        width: '33%',
		// backgroundColor: 'red'
    },
    itemStyle: {
        fontSize: 18,
		lineHeight: 30,
		height: HEIGHT - 300,
		// backgroundColor: 'red'
    },
	selectorHeader: {

		width: '90%',
		top: 20,
		justifyContent: 'space-between',

		text: {
			fontFamily: 'Inter-Regular',
			fontSize: 16,
			lineHeight: 20,
			color: '#878F9B',
		}
	},
	selectorCloseBtn: {

		borderWidth: 0.4,
		borderColor: '#878F9B', 
		borderRadius: 30,
		paddingHorizontal: 32,
		paddingVertical: 10,

		text: {
			fontFamily: 'Inter-Regular',
			fontSize: 18,
			lineHeight: 20,
			color: '#878F9B',
		}
	},
	licenseText: {
		fontFamily: 'Inter-Regular',
		fontSize: 12,
		lineHeight: 18,
		color: theme.colors.black,
	},
	textButton: {
		fontFamily: 'Inter-Regular',
		fontSize: 12,
		lineHeight: 18,
		color: theme.colors.black,
		textDecorationLine: "underline",
	},
	submitBtn: {
		borderRadius: 30,
		marginBottom: 60,
		height: 38,
	},
	resumeBtn: {
		top: -50,
		marginTop: 50,
	},
	androidTimePicker: {
		position: 'absolute',
		height: HEIGHT,
		width: '100%',
	},
	photos: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
	},
	photo: {
        width: '48%',
        height: 112,
        backgroundColor: 'transparent',
        borderColor: theme.colors.midBlue,
    },
    photoText: {
        color: theme.colors.blue,
        textAlign: 'center',
        marginTop: 10,
    },
	goBack: {
		position: 'absolute',
		left: 5,
		top: 43,
		paddingVertical: 10,
		paddingHorizontal: 15,
		zIndex: 1000,
	}
})
