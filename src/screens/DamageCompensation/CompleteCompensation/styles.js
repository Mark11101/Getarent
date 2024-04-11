import { StyleSheet, Dimensions } from "react-native";

import theme from 'theme';

const HEIGHT = Dimensions.get('window').height;

export default StyleSheet.create({
    container: {
        height: Dimensions.get('window').height,
        backgroundColor: theme.colors.white,
        justifyContent: 'center',
    },
    icon: {
        marginBottom: theme.spacing(8),
    },
    center: {
        height: HEIGHT * 2 / 3,
        paddingHorizontal: theme.spacing(6),
        alignItems: 'center',
        justifyContent: 'flex-end',
    },
    text: {
        ...theme.styles.H3,
        textAlign: 'center',
    },
    bottom: {
        justifyContent: 'flex-end',
        height: HEIGHT / 3,
        marginBottom: theme.spacing(25),
        paddingHorizontal: theme.spacing(6),
    },
    resumeBtn: {
    },
});
