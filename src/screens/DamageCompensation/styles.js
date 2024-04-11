import { StyleSheet } from "react-native";;

import theme from 'theme';

export default StyleSheet.create({
    container: {
        paddingHorizontal: theme.spacing(6),
        marginBottom: theme.spacing(20),
    },
    text: {
        ...theme.styles.P1R,
        marginBottom: theme.spacing(8),
    },
    category: {
        flexDirection: 'row',
        alignItems: 'center',
		shadowOpacity: 0.15,
        paddingTop: theme.spacing(3),
        paddingBottom: theme.spacing(3),
        paddingLeft: theme.spacing(4),
        marginBottom: theme.spacing(3),
    },
    categoryIcon: {
        marginRight: theme.spacing(3),
    },
    categoryText: {
        ...theme.styles.P1,
    }
});
