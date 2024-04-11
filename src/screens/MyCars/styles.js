import { StyleSheet } from "react-native";

import theme from 'theme';

export default StyleSheet.create({

    ...theme.spaceBetween,
    ...theme.margins,
    ...theme.row,

    safeAreaView: {
        flex: 1,
        backgroundColor: theme.colors.white,
    },
    content: {
        padding: 16,
        paddingBottom: 100,
    },
    goBack: {
        position: 'absolute',
        left: 8,
        top: 9 + 50,
        zIndex: 1500,
        borderRadius: 50,
        backgroundColor: 'white',
    },
    goBackBtn: {
        paddingVertical: 10,
        paddingHorizontal: 15,
    },
    chatBtnIcon: {
        marginRight: 8
    },
    chatBtnText: {
        fontFamily: 'Inter-Regular',
        fontSize: 14,
        lineHeight: 20,
        color: theme.colors.black,
        top: 1,
    },
    header: {
        width: '100%',
        justifyContent: 'flex-end',
        marginBottom: 16,
        paddingTop: 50,
        paddingRight: 16,
    },
    headerText: {
        fontFamily: 'DelaGothicOne-Regular',
        fontSize: 26,
        lineHeight: 36,
        color: theme.colors.black,
        marginBottom: 16,
    },
    search: {

        icon: {
            top: 2,
            marginRight: 16,
        },

        input: {
            borderWidth: 1,
            borderRadius: 30,
            borderColor: "#DBE3EF",
            width: '100%',
            paddingHorizontal: 18,
            backgroundColor: theme.colors.white,
        }
    },
    title: {
        fontFamily: 'DelaGothicOne-Regular',
        fontSize: 26,
        lineHeight: 36,
        color: theme.colors.black,
        marginBottom: 16,
    },
    carStatusBar: {

        position: 'absolute',
        borderRadius: 10,
        paddingVertical: 2,
        paddingHorizontal: 8,
        zIndex: 1500,
        left: 12,
        top: 8,

        icon: {
            marginRight: 4
        },

        text: {
            fontFamily: 'Inter',
            fontSize: 12,
            lineHeight: 18,
            color: theme.colors.white,
        },
    },
    carStatusBarBackground: {
        position: 'absolute',
        borderRadius: 10,
        paddingVertical: 2,
        paddingHorizontal: 8,
        backgroundColor: theme.colors.grey,
        opacity: 0.8,
        height: 22,
        zIndex: 1000,
        left: 12,
        top: 8,
    },
    infoPanel: {

        main: {
            width: '100%',
            height: 271,
            marginRight: 8,
            justifyContent: 'space-between',
            backgroundColor: theme.colors.white,
            borderRadius: 20,
            marginBottom: 16,
            borderWidth: 1,
            borderColor: '#DBE3EF',
        },

        icon: {
            marginBottom: 10,
        },

        image: {
            width: '100%',
            maxHeight: 217,
            borderTopLeftRadius: 18,
            borderTopRightRadius: 18,
        },
        
        infoText: {
            fontFamily: 'Inter',
            fontSize: 16,
            lineHeight: 18,
            color: theme.colors.black,
            marginRight: 8,
        },

        helpText: {
            fontFamily: 'Inter',
            fontSize: 14,
            lineHeight: 22,
            color: '#878F9B',
        },

        price: {
            fontFamily: 'Inter',
            fontSize: 16,
            lineHeight: 24,
            color: theme.colors.black,
        }
    },
    infoPanel_content: {
        paddingLeft: 16,
        paddingRight: 32, 
        bottom: 16,
    },
    rating: {
        position: 'absolute',
        right: 20,
        top: 10,
        borderRadius: 8,
        backgroundColor: '#F5F5F7',
        paddingHorizontal: 4,
        paddingVertical: 2,
        flexDirection: 'row',
        alignItems: 'center',
    },
    ratingNumber: {
        fontFamily: 'Inter-Bold',
        fontSize: 12,
        lineHeight: 18,
        color: theme.colors.black,
        marginRight: 4,
    },
    deletedCarsBtn: {

        paddingVertical: 8,

        icon: {
            marginRight: 8
        },

        text: {
            fontFamily: 'Inter',
            fontSize: 14,
            lineHeight: 20,
        }
    },
    goHomeBtn: {
        position: 'absolute',
        bottom: 30,
        width: '90%',
        alignSelf: 'center',
        borderRadius: 50,
        height: 40,
    }
});
