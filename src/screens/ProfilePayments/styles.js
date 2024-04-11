import { StyleSheet } from 'react-native';

import theme from 'theme';

export default StyleSheet.create({
	content: {
		...theme.styles.container,
		paddingHorizontal: theme.spacing(6),
		paddingBottom: theme.spacing(6),
	},
	title: {
		marginBottom: 10,
	},
	existingCardText: {
		marginBottom: 20,
	}
});
