import { StyleSheet } from 'react-native';

import theme from 'theme';

export default StyleSheet.create({
    navigationBtns: {
        flexDirection: 'row',
        width: '100%',
        paddingBottom: 60,
    },
    backBtn: {
        flex: 0.35,
        marginRight: 10,
        backgroundColor: theme.colors.lightGrey,
    },
    backBtnTitle: {
        color: '#282c34',
        transform: [{ rotate: '180deg'}]
    },
    resumeBtn: {
        flex: 1.65,
        backgroundColor: '#249cbc',
    },
    resumeBtnTitle: {
        fontWeight: '700',
    }
});
