import { StyleSheet } from "react-native";

import theme from 'theme';

export default StyleSheet.create({
	killerFeature: {
        flexDirection: 'row',
        borderWidth: 1,
        borderRadius: 20,
        borderColor: '#E6E6E8',
        paddingHorizontal: 16,
        paddingVertical: 20,
        marginBottom: 10,
    },
    content: {
        flexShrink: 1
    },
    icon: {
        marginRight: 16,
    },
    title: {
        ...theme.styles.P1,
        fontSize: 16,
        fontWeight: '700',
        lineHeight: 26,
        marginBottom: 8,
    },
    text: {
        ...theme.styles.P1,
        fontSize: 13,
        fontWeight: '300',
        lineHeight: 24,
    },
    boldText: {
        fontWeight: 'bold',
    },
    readMoreBtn: {
        color: theme.colors.blue,
        marginTop: 7,
        marginBottom: -5,
    }
});
