import { StyleSheet, Dimensions } from "react-native";

import theme from 'theme';

const width = Dimensions.get('window').width;

export default StyleSheet.create({
    pickers: {
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 10,
    },
    row: {
        flexDirection: 'row',
    },
    picker: {
        width: '25%',
    },
    itemStyle: {
        fontSize: 18,
    },
    weekdays: {
        marginBottom: 10,
        justifyContent: 'space-between',
        backgroundColor: '#f4f4f5',
        padding: 10,
        borderRadius: 10,
    },
    weekday: {
        borderWidth: 1,
        borderRadius: 50,
        borderColor: theme.colors.midBlue,
        paddingVertical: 6,
        paddingHorizontal: 7,
        alignSelf: 'flex-start',
        marginBottom: 15,
    },
    selectedWeekday: {
        backgroundColor: theme.colors.midBlue,
    },
    unavailableWeekday: {
        backgroundColor: theme.colors.red,
        borderColor: theme.colors.red,
    },
    weekdayTitle: {
        fontSize: 14,
        color: theme.colors.blue,
        opacity: 0.9,
    },
    selectedWeekdayTitle: {
        color: theme.colors.white,
        opacity: 1,
    },
    unavailableWeekdayTitle: {
        color: theme.colors.white,
    },
    time: {
        ...theme.styles.P3R,
        fontSize: 12,
        opacity: 0.5,
    },
    selectedWeekdayTime: {
        opacity: 1,
    },  
});
