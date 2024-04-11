import { StyleSheet } from 'react-native';

import theme from 'theme';

export default StyleSheet.create({
	safeArea: {
		flex: 1,
		width: null,
		height: null,
		backgroundColor: '#282c34',
	},
	container: {
        paddingVertical: theme.spacing(8),
        paddingHorizontal: theme.spacing(6),
    },
    section: {
        marginBottom: theme.spacing(4),
    },
    personTypes: {
		marginBottom: 20,
    },
    radionBtnText: {
        ...theme.styles.H4,
        fontSize: 15,
        fontWeight: '700',
		color: theme.colors.white,	
    },
    input: {
		marginBottom: 20,
    },
    labelStyle: {
        marginBottom: 5,
        fontWeight: 'bold',
    },
    inputStyle: {
        fontWeight: 'bold',
    },
    navigationBtns: {
        flexDirection: 'row',
        width: '100%',
        paddingBottom: 60,
    },
    backBtn: {
        flex: 1,
        marginRight: 20,
    },
    resumeBtn: {
        flex: 1,
        backgroundColor: '#249cbc',
    },
});
