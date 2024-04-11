import { StyleSheet } from "react-native";

import theme from 'theme';

export default StyleSheet.create({
    guarantorOfSecurity: {
        paddingTop: theme.spacing(7),
        backgroundColor: 'white',
    },
    container: {
        paddingHorizontal: 24,
        paddingBottom: theme.spacing(15),
    },
    icon: {
        alignItems: 'center',
        marginBottom: 30,
    },
    title: {
        ...theme.styles.P1,
        marginBottom: 16,
    },
    text: {
        ...theme.styles.P1R,
        marginBottom: 30,
    },
});
