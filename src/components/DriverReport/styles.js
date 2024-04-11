import { StyleSheet, Dimensions } from "react-native";

import theme from 'theme';

const WIDTH = Dimensions.get('window').width;
const HEIGHT = Dimensions.get('window').height;

export default StyleSheet.create({
    driverReport: {
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        paddingHorizontal: 8,
    },
    bold: {
        fontFamily: 'Inter-Bold',
        fontSize: 14,
        lineHeight: 20,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        marginTop: 30,
    },
    title: {
        fontFamily: 'Inter-Bold',
        fontSize: 16,
        lineHeight: 22,
        marginBottom: 16,
        color: theme.colors.black,
    },
    closeBtn: {
        fontFamily: 'Inter-Regular',
        fontSize: 14,
        marginBottom: 16,
    },
    person: {
        borderRadius: 20,
        borderWidth: 1,
        borderColor: '#DBE3EF',
        padding: 16,
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
    },
    avatar: {
        marginRight: 8
    },
    name: {
        fontFamily: 'DelaGothicOne-Regular',
        lineHeight: 18,
        fontSize: 16,
        marginBottom: 5,
        color: theme.colors.black,
    },
    greyText: {
        fontFamily: 'Inter-Regular',
        fontSize: 14,
        lineHeight: 20,
        color: '#878F9B',
    },
    section: {
        padding: 16,
    },
    line: {
        flexDirection: 'row',
        alignItems: 'top',
        marginBottom: 16,
    },
    lineIcon: {
        marginRight: 8,
    },
    lineTitle: {
        fontFamily: 'Inter-Regular',
        fontSize: 14,
        lineHeight: 20,
        flexWrap: 'wrap',
        color: theme.colors.black,
    },
    subtitle: {
        flex: 1, 
        flexWrap: 'wrap',
        marginBottom: 4
    },
    greyPanel: {
        padding: 16,
        borderRadius: 20,
        backgroundColor: '#F5F5F7',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 16,
    },
    greyPanelIcon: {
        marginRight: 10
    },
    greyPanelText: {
        fontFamily: 'Inter-Regular',
        fontSize: 14,
        lineHeight: 20,
        color: theme.colors.black,
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    modal: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    modalPanel: {
        padding: 16,
        borderRadius: 20,
        alignItems: 'center',
        backgroundColor: theme.colors.white,
        width: WIDTH * 0.9,
        maxHeight: HEIGHT * 0.9,
    },
    modalCloseBtn: {
        alignSelf: 'flex-end'
    },
    modalImage: {
        marginBottom: 16,
    },
    modalContent: {
        paddingHorizontal: 10,
        paddingBottom: 15,
    },
    modalTitle: {
        fontFamily: 'DelaGothicOne-Regular',
        lineHeight: 18,
        fontSize: 16,
        marginBottom: 16,
        color: theme.colors.black,
        textAlign: 'center',
    },
    modalText: {
        fontFamily: 'Inter-Regular',
        fontSize: 14,
        lineHeight: 22,
        color: theme.colors.black,
        marginBottom: 20,
    },
    modalTextBold: {
        fontFamily: 'Inter-Bold',
        fontSize: 14,
        lineHeight: 22,
        color: theme.colors.black,
    },
    modalResumeBtn: {
        borderRadius: 30,
        height: 38,
    },
    subtitle: {
        fontFamily: 'Inter',
        fontSize: 14,
        lineHeight: 22,
        marginBottom: 16,
        color: theme.colors.black,
    }
});
