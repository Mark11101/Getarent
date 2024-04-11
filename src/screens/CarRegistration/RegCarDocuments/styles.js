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
    photo: {
        width: '48%',
        height: 112,
        backgroundColor: 'transparent',
        borderColor: theme.colors.white,
    },
    photoText: {
        color: theme.colors.white,
        textAlign: 'center',
        marginTop: 10,
    },
    thumbnail: {
        width: '48%',
        height: 112,
    },
    photos: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    title: {
        ...theme.styles.H25,
        color: theme.colors.white,
        marginBottom: 15,
    },
    subTitle: {
        ...theme.styles.P1_5,
        color: theme.colors.white,
        marginBottom: 10,
        fontWeight: '700',
    },
    section: {
        marginBottom: 40,
    },
    helpText: {
        ...theme.styles.P2,
        color: theme.colors.white,
        marginBottom: 15,
    },
    radioBtns: {
		marginBottom: 20,
        flexDirection: 'row',
    },
    radionBtnText: {
        ...theme.styles.H4,
        fontSize: 15,
        fontWeight: '700',
		color: theme.colors.white,	
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
    },
});
