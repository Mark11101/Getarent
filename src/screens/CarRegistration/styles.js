import { StyleSheet, Dimensions } from 'react-native';

import theme from 'theme';

const WIDTH = Dimensions.get('window').width;
const HEIGHT = Dimensions.get('window').height;

export default StyleSheet.create({
	safeArea: {
		flex: 1,
		width: null,
		height: null,
		backgroundColor: '#282c34',
	},
	container: {
        paddingHorizontal: theme.spacing(6),
    },
	title: {
		...theme.styles.H2,
		color: theme.colors.white,	
		marginBottom: 20,
	},
	text: {
		...theme.styles.P1,
		color: theme.colors.white,	
		marginBottom: 20,
	},
	emoji: {
		fontSize: 100,
		textAlign: 'center',
	},
	resume: {
		position: 'absolute',
		bottom: 30,
		width: '100%',
        paddingHorizontal: theme.spacing(6),
	},
	resumeBtn: {
		backgroundColor: '#249cbc',
	},
	resumeBtnTitle: {
		color: theme.colors.white,
	},
    modal: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    modalPanel: {
        padding: 16,
        borderRadius: 20,
        alignItems: 'center',
        backgroundColor: theme.colors.white,
        width: WIDTH * 0.9,
        maxHeight: HEIGHT * 0.9,
    },
    modalCloseBtn: {
        alignSelf: 'flex-end'
    },
    modalImage: {
        marginBottom: 16,
    },
    modalContent: {
        paddingHorizontal: 10,
        paddingBottom: 15,
    },
    modalTitle: {
        fontFamily: 'DelaGothicOne-Regular',
        lineHeight: 18,
        fontSize: 16,
        marginBottom: 16,
        color: theme.colors.black,
        textAlign: 'center',
    },
    modalText: {
        fontFamily: 'Inter-Regular',
        fontSize: 14,
        lineHeight: 22,
        color: theme.colors.black,
        marginBottom: 20,
    },
    modalResumeBtn: {
        borderRadius: 30,
        height: 38,
    }
});
