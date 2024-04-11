import { StyleSheet } from "react-native";

import theme from "theme";

export default StyleSheet.create({
    safeAreaView: {
        flex: 1,
        backgroundColor: theme.colors.white
    },
    header: {
        flexDirection: 'row',
        paddingVertical: 15,
        marginBottom: 17,
    },
    goBackBtn: {
        opacity: 0.5,
        paddingRight: 16,
        paddingLeft: 24,
    },
    headerText: {
        fontFamily: 'DelaGothicOne-Regular',
        fontSize: 16,
        lineHeight: 18,
        color: theme.colors.black,
    },
    content: {
        paddingHorizontal: 16,
    },
    input: {
        borderRadius: 50,
        borderWidth: 1,
        borderColor: theme.colors.blue,
        paddingHorizontal: 20,
        paddingVertical: 9,
        width: '90%',
        marginRight: 16,
    },
    inputView: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 19,
    },
    row: {
        flexDirection: 'row',
    },
    article: {
        flexDirection: 'row',
    },
    sectionText: {
        fontFamily: 'Inter-Regular',
        fontSize: 12,
        lineHeight: 18,
        color: '#878F9B',
    },
    articleTitle: {
        fontFamily: 'Inter-Regular',
        fontSize: 16,
        lineHeight: 24,
        color: theme.colors.black,
        marginBottom: 16,
    },
    articleText: {
        fontFamily: 'Inter-Regular',
        fontSize: 12,
        lineHeight: 18,
        color: theme.colors.black,
        marginBottom: 20,
    },
    divider: {
        height: 1,
        backgroundColor: '#DBE3EF',
        marginBottom: 16,
    },
    noDataText: {
        fontFamily: 'Inter-Regular',
        fontSize: 14,
        lineHeight: 22,
        color: '#878F9B',
        textAlign: 'center',
    },
    articleBackground: {
        backgroundColor: '#DBE3EF',
    }
});
