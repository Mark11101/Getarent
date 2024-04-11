import { StyleSheet } from 'react-native';

import theme from 'theme';

export default StyleSheet.create({
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 20,
    },
    title: {
        ...theme.styles.H2,
        fontSize: 23,
        color: theme.colors.white,	
    },
});
