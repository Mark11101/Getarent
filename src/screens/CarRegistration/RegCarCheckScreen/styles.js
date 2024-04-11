import { StyleSheet, Dimensions } from 'react-native';

import theme from 'theme';

const width = Dimensions.get('window').width;

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
    item: {
        ...theme.styles.P1,
        color: theme.colors.white,
    },
    divider: {
        color: theme.colors.white,
    },
});
