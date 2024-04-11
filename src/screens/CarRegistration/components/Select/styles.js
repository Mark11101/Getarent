import { StyleSheet } from 'react-native';

import theme from 'theme';

export default StyleSheet.create({
    select: {
        borderColor: theme.colors.white,
        marginBottom: 20,
    },
    label: {
        ...theme.styles.P1,
        color: theme.colors.white,
    },
});
