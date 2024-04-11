import { StyleSheet } from 'react-native';

import theme from 'theme';

export default StyleSheet.create({
	title: {
		marginRight: 10, 
		bottom: -1,
		...theme.styles.P1,
	},
	included: {
		backgroundColor: '#DBE3EF', 
		borderRadius: 10,
		alignItems: 'center',
		paddingHorizontal: 10,
		paddingVertical: 5,
		marginBottom: -2,
	},
	description: {
		...theme.styles.P1R,
	},
	list: {
		paddingLeft: theme.spacing(6),
		paddingRight: theme.spacing(12),
	},
	submitBtn: {
		bottom: 0,
		margin: 10,
	},
});
