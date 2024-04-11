import { StyleSheet, Dimensions } from "react-native";

import theme from "theme";

const WIDTH = Dimensions.get('window').width;

export default StyleSheet.create({
    safeAreaView: {
        flex: 1,
        backgroundColor: theme.colors.white
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 16,
        paddingRight: 24,
        paddingTop: 25,
    },
    goBackBtn: {
        opacity: 0.5,
        paddingRight: 24,
        paddingLeft: 24,
    },
    chatBtn: {
        flexDirection: 'row',
    },
    chatBtnIcon: {
        marginRight: 8
    },
    chatBtnText: {
        fontFamily: 'Inter-Regular',
        fontSize: 14,
        lineHeight: 20,
        color: theme.colors.black,
    },
    headerText: {
        fontFamily: 'DelaGothicOne-Regular',
        fontSize: 26,
        lineHeight: 36,
        color: theme.colors.black,
        marginBottom: 16,
        paddingHorizontal: 24,
    },
    headerRightBlock: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    search: {
        marginRight: 24,
        paddingLeft: -24,
    },
    filter: {
        marginBottom: 32,
    },
    filterContent: {
        paddingHorizontal: 24,
    },
    content: {
        opacity: 0,
        position: 'absolute',
        width: '100%',
        paddingHorizontal: 8,
        zIndex: 500,
    },
    banners: {
        paddingHorizontal: 16
    },
    bannerImage: {
        borderRadius: 20
    },
    bannerInfo: {
        position: 'absolute',
        left: 16,
        bottom: 16,
        borderRadius: 20
    },
    bannerInfoTitle: {
        fontFamily: 'Inter-Regular',
        fontSize: 14,
        lineHeight: 22,
        color: theme.colors.black,
        bottom: 0,
        position: 'absolute',
        width: '80%',
    },
    bannerInfoSubTitle: {
        fontFamily: 'Inter-Regular',
        fontSize: 12,
        lineHeight: 18,
        color: theme.colors.white,
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    subTitle: {
        fontFamily: 'DelaGothicOne-Regular',
        fontSize: 16,
        lineHeight: 18,
        color: theme.colors.black,
        marginLeft: 16,
        marginBottom: 15,
    },
    articleslistTitle: {
        // fontFamily: 'Inter-Regular',
        // fontSize: 16,
        // lineHeight: 24,
        // color: theme.colors.black,
        // paddingBottom: 16,
        // maxWidth: '90%',
    },
    articleListItem: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '100%',
        marginBottom: 16,
    },
    accordionListItem: {
        flexDirection: 'row',
        alignItems: 'center',
        width: WIDTH / 1.3,
    },
    articleListItemIcon: {
        width: 64,
        height: 64,
        borderRadius: 18,
        marginRight: 16,
    },
    accordionListItemIcon: {
        width: 64,
        height: 64,
        borderRadius: 18,
        marginRight: 16,
    },
    accordionView: {
        marginBottom: 10,
    },
    expandedViewStyle: {
        paddingTop: 10,
        marginBottom: 0,
    },
    articleListItemText: {
        fontFamily: 'Inter-Regular',
        fontSize: 14,
        lineHeight: 20,
        color: theme.colors.black,
        flex: 1, 
        flexWrap: 'wrap',
    },
    divider: {
        height: 1,
        backgroundColor: '#DBE3EF',
        marginBottom: 16,
    },
});
