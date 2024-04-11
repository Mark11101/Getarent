import { StyleSheet, Dimensions, Platform } from "react-native";

import theme from 'theme';

const WIDTH = Dimensions.get('window').width;

export default StyleSheet.create({
    
    ...theme.spaceBetween,
    ...theme.margins,
    ...theme.row,

    container: {
        flex: 1,
        backgroundColor: '#F5F5F7',
    },
    whiteBg: {
        backgroundColor: theme.colors.white
    },
    topPanel: {
        backgroundColor: '#F5F5F7',
        borderBottomLeftRadius: 20,
        borderBottomRightRadius: 20,
        paddingLeft: 16,
        paddingRight: 24,
        paddingTop: 32,
        paddingBottom: 16,
        marginBottom: 16,
    },
    welcomText: {
        fontFamily: 'DelaGothicOne-Regular',
        fontSize: 16,
        lineHeight: 18,
        color: theme.colors.black,
        marginRight: 16,
    },
    superHost_icon: {
        marginRight: 4
    },
    superHost_text: {
        fontFamily: 'Inter-Regular',
        fontSize: 12,
        lineHeight: 18,
        color: theme.colors.black,
    },
    rating: {
        borderRadius: 8,
        backgroundColor: theme.colors.white,
        paddingHorizontal: 4,
        paddingVertical: 2,
        flexDirection: 'row',
        alignItems: 'center',
    },
    rating_number: {
        fontFamily: 'Inter-Bold',
        fontSize: 12,
        lineHeight: 18,
        color: theme.colors.black,
        marginRight: 4,
    },
    infoPanel: {
        padding: 8,
        width: 100,
        height: 100,
        marginRight: 8,
        borderRadius: 16,
        justifyContent: 'space-between',
        backgroundColor: theme.colors.white,
    },
    infoPanel_icon: {
        marginBottom: 10,
    },
    infoPanel_image: {
        borderRadius: 18,
    },
    infoPanel_infoText: {
        fontFamily: 'Inter-Bold',
        fontSize: 14,
        lineHeight: 22,
        color: theme.colors.black,
        maxWidth: '80%',
    },
    infoPanel_helpText: {
        fontFamily: 'Inter',
        fontSize: 12,
        lineHeight: 18,
        color: theme.colors.black,
    },
    infoPanel_grey: {
        backgroundColor: '#F5F5F7'
    },
    infoPanel_car: {
        width: 152,
        height: 185,
        padding: 4,
        borderRadius: 20,
    },
    horizontalScroll: {
        paddingTop: 16, 
        paddingBottom: 32,
    },
    calendar: {
        height: 100,
        borderRadius: 20, 
        overflow: 'hidden', 
        marginBottom: 32,
        transform: [{ scaleX: -1 }],
    },
    calendar_content: {
        position: 'absolute',
        zIndex: 1000,
        transform: [{ scaleX: Platform.constants['Release'] <= 7 ? 0 : -1 }],
        width: '100%',
        left: -16,
        top: 16,
    },
    calendar_title: {
        fontFamily: 'Inter',
        fontSize: 16,
        lineHeight: 24,
        color: theme.colors.white,
    },
    calendar_subtitle: {
        fontFamily: 'Inter',
        fontSize: 12,
        lineHeight: 18,
        color: theme.colors.white,
    },
    counter: {
        fontFamily: 'Inter',
        fontSize: 14,
        lineHeight: 22,
        color: '#878F9B',
        marginRight: 8,
    },
    blockHeader_main: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 16,
    },
    blockHeader_text: {
        fontFamily: 'Inter',
        fontSize: 16,
        lineHeight: 22,
        color: theme.colors.black,
    },
    carStatusBar: {
        position: 'absolute',
        borderRadius: 10,
        paddingVertical: 2,
        paddingHorizontal: 8,
        zIndex: 1500,
        left: 12,
        top: 8,
    },
    carStatusBar_icon: {
        marginRight: 4
    },
    carStatusBar_text: {
        fontFamily: 'Inter',
        fontSize: 12,
        lineHeight: 18,
        color: theme.colors.white,
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
    addCar: {
        marginBottom: 32,
        backgroundColor: theme.colors.blue,
        borderRadius: 30,
        paddingVertical: 9,
        paddingHorizontal: 30,
        justifyContent: 'center',
    },
    addCar_icon: {
        marginRight: 10,
    },
    addCar_text: {
        fontFamily: 'Inter',
        fontSize: 14,
        lineHeight: 20,
        color: theme.colors.white,
    },
    panel: {
        padding: 16,
        borderRadius: 20,
        backgroundColor: '#F5F5F7',
    },
    divider: {
        height: 1,
        backgroundColor: '#DBE3EF',
        marginBottom: 16,
    },
    banners: {
        width: '100%',
        marginBottom: 24,
        paddingTop: 16, 
    },
});
