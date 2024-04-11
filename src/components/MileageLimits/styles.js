import { StyleSheet } from "react-native";

import theme from 'theme';

export default StyleSheet.create({
	limitRow: {
		...theme.styles.P1R,
		marginBottom: 8,
	},
	helpText: {
		...theme.styles.note,
		color: theme.colors.darkGrey,
	},
});
