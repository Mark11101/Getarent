import { StyleSheet } from 'react-native';

import theme from 'theme';

export default StyleSheet.create({
	safeArea: {
		flex: 1,
		width: null,
		height: null,
		backgroundColor: '#282c34',
	},
	container: {
        paddingVertical: theme.spacing(8),
        paddingHorizontal: theme.spacing(6),
    },
    subTitle: {
        ...theme.styles.H4,
        color: theme.colors.white,
        marginBottom: 25,
    },
    inputLabel: {
        ...theme.styles.P1,
        fontWeight: '500',
    },
    inputStyle: {
        height: theme.normalize(37),
        fontWeight: '400',
        paddingVertical: 0,
    },
    inputs: {
        marginBottom: 20,
    },
});
