import { StyleSheet } from 'react-native'
import theme from '../../theme'
import { WINDOW_WIDTH } from '../../constants/app';

export default StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        fontFamily: 'DelaGothicOne-Regular',
        lineHeight: 26,
        fontSize: 22,
        marginBottom: 26,
        color: theme.colors.black,
    },
    input: {
        marginBottom: 28,
    },
    inputStyle: {
        fontSize: 14,
        borderRadius: 50,
        height: 38,
        paddingVertical: 0,
    },
    eye: {
		position: 'absolute',
		right: 15,
        top: 10,
    },
    submitBtn: {
        borderRadius: 30, 
        height: 38,
        marginBottom: 150,
    },
    phoneInput: {
        borderWidth: 1,
        borderColor: '#DBE3EF',
        paddingLeft: 54,
        color: theme.colors.black,
        marginBottom: 28,
    },
    phoneInfo: {
        position: 'absolute',
        flexDirection: 'row',
        top: 10,
        left: 18,
        alignItems: 'center',
    },
    phoneFlag: {
        marginRight: 10,
    },
    phoneDivider: {
        color: '#DBE3EF',
    },
    signup: {
        flex: 1,
    },
    warning: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 4,
    },
    warningIcon: {
        marginRight: 6,
    },
    warningText: {
        fontFamily: 'Inter-Regular',
        fontSize: 12,
        color: theme.colors.black,
    },
    checkbox: {
		marginBottom: 50,
        alignItems: 'flex-start',
        maxWidth: '97%',
    },  
    policyText: {
        marginLeft: -5,
        textDecorationLine: "none",
    },
    licenseText: {
        fontSize: 12,
        fontFamily: 'Inter-Regular',
        color: theme.colors.black,
	},
	textButton: {
		...theme.styles.XS,
        textDecorationLine: "underline",
	},
    clearPhone: {
        position: 'absolute',
        paddingHorizontal: 18,
        paddingVertical: 13,
        right: 0,
    },
    title: {
		fontFamily: 'DelaGothicOne-Regular',
        color: theme.colors.black,

		marginBottom: 16,
		fontSize: 16,
		lineHeight: 18,

		marginVertical: 16,
		textAlign: 'center'
	},
    text: {
        fontFamily: 'Inter-Regular',
        color: theme.colors.black,
		fontSize: 14,
		lineHeight: 20
	},
	headerContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingTop: 25,
		marginBottom: -35,
    },
    goBackBtn: {
        opacity: 0.5,
        paddingRight: 24,
        paddingLeft: 24,
    },
	auth: {
		flex: 1,
		top: WINDOW_WIDTH > 350 ? '16%' : '8%'
	},
	button: {
		marginBottom: theme.spacing(4)
	},
	descriptionText: {
		...theme.styles.P2R,
		marginBottom: theme.spacing(8),
		textAlign: 'center'
	},
	paper: {
		marginHorizontal: theme.spacing(6),
		padding: theme.spacing(4)
	},
	titleText: {
		...theme.styles.H3,
		marginTop: theme.spacing(22),
		textAlign: 'center'
	},
	footerLinks: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		flexWrap: 'wrap'
	}
});
