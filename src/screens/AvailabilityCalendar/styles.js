import { StyleSheet, Dimensions } from "react-native";

import theme from "theme";

const TAB_WIDTH = 139;

const HEIGHT = Dimensions.get('window').height;

export default StyleSheet.create({

    ...theme.row,
    ...theme.margins,

    container: {
        flex: 1,
        backgroundColor: theme.colors.white,
    },

    header: {

        paddingLeft: 8,
        paddingRight: 24,

        goBackBtn: {
            padding: 16,
            opacity: 0.6,
        },

        title: {
            fontFamily: 'DelaGothicOne-Regular',
            fontSize: 16,
            lineHeight: 18,
            color: theme.colors.black,
        }
    },

    cars: {

        searchBtn: {
            paddingLeft: 24,
            paddingRight: 24,
            padding: 24,
            paddingBottom: 18,
        },

        tab: {

            width: TAB_WIDTH,
            marginRight: 16,
            padding: 8,

            image: {
                borderRadius: 8,
                marginRight: 8,
            },

            title: {
                fontFamily: 'Inter',
                fontSize: 14,
                lineHeight: 22,
                color: theme.colors.black,
                maxWidth: '95%',
            },

            helpText: {
                fontFamily: 'Inter',
                fontSize: 12,
                lineHeight: 18,
                color: '#878F9B',
            },

            indicator: {
                position: "absolute",
                height: 1,
                bottom: 0,
                width: TAB_WIDTH,
                backgroundColor: theme.colors.black,
            }
        },
    },
	weekDays: {
		flexDirection: 'row',
        borderBottomWidth: 1,
        borderBottomColor: '#DBE3EF',
        borderTopWidth: 1,
        borderTopColor: '#DBE3EF',
		paddingBottom: 8,
        paddingTop: 16,
        marginBottom: 16,
	},
	weekDay: {
        fontFamily: 'Inter',
        fontSize: 12,
        lineHeight: 18,
        color: '#878F9B',
		textAlign: 'center',
		flex: 1,
	},
    loading: {
        position: 'absolute',
        height: HEIGHT,
        top: 90,
        left: 0,
        right: 0,
        opacity: 0.5,
        backgroundColor: 'white',
    },
    searchInput: {
        borderWidth: 1,
        borderRadius: 30,
        borderColor: "#DBE3EF",
        width: '100%',
        paddingHorizontal: 18,
        backgroundColor: theme.colors.white,
    },
    noData: {

        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 32,

        text: {
            fontFamily: 'Inter-Regular',
            fontSize: 18,
            lineHeight: 30,
            color: theme.colors.darkGrey,
            textAlign: 'center',
        }
    }

});
