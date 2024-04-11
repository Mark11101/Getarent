import { StyleSheet, Dimensions } from "react-native";

import theme from "theme";

const HEIGHT = Dimensions.get("window").height;
const WIDTH = Dimensions.get("window").width;

export default StyleSheet.create({
    content: {
        flex: 1,
        backgroundColor: theme.colors.white,
    },
    scroll: {
        backgroundColor: theme.colors.white,
        borderRadius: 20,
        paddingVertical: 20,
        paddingHorizontal: 24,
        paddingBottom: 100,
        minHeight: HEIGHT / 2,
        top: 100,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        top: 90,
        left: 16,
        zIndex: 1000,
        marginBottom: 15,
    },
    headerText: {
        fontFamily: 'DelaGothicOne-Regular',
        fontSize: 16,
        lineHeight: 18,
        color: theme.colors.white,
        position: 'absolute',
        left: 45,
        paddingTop: 8,
        width: '80%',
    },
    goBackBtn: {
        width: 32,
        height: 32,
        borderRadius: 50,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#ffffff33',
        marginRight: 10,
        position: 'absolute',
    },
    goBackBlackBtn: {
        backgroundColor: theme.colors.black,
    },
    panel: {
        padding: 16,
        borderRadius: 20,
        backgroundColor: '#F5F5F7',
    },
    webView: {
        marginBottom: 40,
    },
    supportTitle: {
        fontFamily: 'DelaGothicOne-Regular',
        fontSize: 16,
        lineHeight: 18,
        color: theme.colors.black,
        marginBottom: 16,
    },
    supportSubTitle: {
        fontFamily: 'Inter-Regular',
        fontSize: 14,
        lineHeight: 20,
        color: theme.colors.black,
        marginBottom: 16,
    },
    noDataText: {
        fontFamily: 'Inter-Regular',
        fontSize: 14,
        lineHeight: 22,
        color: '#878F9B',
        paddingVertical: 40,
    },
    title: {
        fontFamily: 'DelaGothicOne-Regular',
        fontSize: 24,
        lineHeight: 36,
        marginBottom: 14,
        color: theme.colors.black,
    },
    divider: {
        height: 1,
        backgroundColor: '#DBE3EF',
        marginBottom: 16,
    },
    sectionName: {
        fontFamily: 'Inter',
        fontSize: 12,
        lineHeight: 18,
        color: '#878F9B',
        marginBottom: 16,
    }
});

export const tagsStyles = {
    body: {
        color: '#222'
    },
    h1: {
        fontFamily: 'DelaGothicOne-Regular',
        fontSize: 26,
        lineHeight: 36,
        marginBottom: 0,
    },
    h2: {
        fontFamily: 'Inter-Regular',
        fontSize: 16,
        lineHeight: 22,
        fontWeight: '700',
        marginTop: 32,
        marginBottom: 0,
    },
    h3: {
        fontFamily: 'Inter-Regular',
        fontSize: 16,
        lineHeight: 22,
        fontWeight: '700',
        marginTop: 32,
        marginBottom: 0,
    },
    h4: {
        fontFamily: 'Inter-Regular',
        fontSize: 14,
        lineHeight: 20,
        fontWeight: '700',
        marginBottom: 0,
    },
    ul: {
        fontSize: 14,
        paddingLeft: 16,
        marginBottom: 0,
    },
    ol: {
        fontSize: 14,
        paddingLeft: 16,
    },
    li: {
        fontFamily: 'Inter-Regular',
        marginBottom: 3,
        lineHeight: 20,
        top: -1,
        left: 3,
    },
    p: {
        fontFamily: 'Inter-Regular',
        fontSize: 14,
        lineHeight: 22,
        marginBottom: 0,
    },
    strong: {
        fontFamily: 'Inter-Regular',
        fontSize: 14,
        lineHeight: 22,
    },
    figure: {
        width: 100
    },
    img: {
        maxWidth: WIDTH / 1.1
    }
};

export const classesStyles = {
    'table': {
        left: -30,
        maxWidth: WIDTH / 1.15
    }
};
