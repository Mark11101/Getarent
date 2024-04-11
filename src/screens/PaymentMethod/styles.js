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
	textView: {
		marginBottom: 30,
	},
	text: {
		fontSize: 13,
		lineHeight: 22,
	},
	bold: {
		fontWeight: 'bold',
	},
	price: {
		marginBottom: 25,
	},
	boldPrice: {
		fontSize: 22,
		fontWeight: 'bold',
	},
	submitBtn: {
		margin: 15
	},
});
