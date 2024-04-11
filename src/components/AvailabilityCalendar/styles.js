import { StyleSheet } from "react-native";

import theme from 'theme';

export default StyleSheet.create({

    ...theme.row,
    ...theme.margins,

    modal: {
        padding: 8,
        paddingBottom: 32,
        paddingHorizontal: 8,
        alignItems: 'center',

        info: {
            marginTop: 16,
        },

        text: {
            fontFamily: 'Inter',
            fontSize: 12,
            lineHeight: 18,
            color: theme.colors.black,
        },

        helpText: {
            fontFamily: 'Inter',
            fontSize: 14,
            lineHeight: 22,
            color: '#878F9B',
            marginTop: 24,
            textAlign: 'center',
        },
    },

    guest: {

        borderRadius: 16,
        width: '100%',
        padding: 16,
        backgroundColor: '#F5F5F7',

        avatar: {
            marginRight: 16,
        },

        name: {
            fontFamily: 'DelaGothicOne-Regular',
            fontSize: 16,
            lineHeight: 18,
            color: theme.colors.black,
            marginRight: 16,
            marginBottom: 8,
        },

        rating: {

            borderRadius: 8,
            backgroundColor: theme.colors.white,
            paddingHorizontal: 6,
            paddingVertical: 2,
            flexDirection: 'row',
            alignItems: 'center',
            top: -5,

            number: {
                fontFamily: 'Inter-Bold',
                fontSize: 10,
                lineHeight: 14,
                color: theme.colors.black,
                marginRight: 4,
            },
        },

        info: {
            fontFamily: 'Inter',
            fontSize: 14,
            lineHeight: 22,
            color: theme.colors.black,
        },

        date: {
            fontFamily: 'Inter',
            fontSize: 14,
            lineHeight: 22,
            color: '#878F9B',
        }

    }
});
