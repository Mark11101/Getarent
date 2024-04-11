import { StyleSheet } from "react-native";

import theme from 'theme';

export default StyleSheet.create({
    content: {
		paddingBottom: theme.spacing(4),
		paddingTop: 10,
	},
	title: {
		...theme.styles.P1,
		marginBottom: theme.spacing(3),
		paddingHorizontal: theme.spacing(6),
	},
	additionalKmsRow: {
		marginBottom: 16,
		left: theme.spacing(6),
		marginRight: theme.spacing(9),
		flexDirection: 'row',
	},
	additionalKmBtn: {
		maxWidth: 80,
		minWidth: 60,
		height: 60,
		borderWidth: 1,
		borderRadius: 4,
		borderColor: theme.colors.grey,
		justifyContent: 'center',
		alignItems: 'center',
		marginRight: 10,
	},
	additionalKmBtnActive: {
		borderColor: theme.colors.blue,
		backgroundColor: '#F0F6FC',
	},
	additionalKmBtnText: {
		...theme.styles.P5R,
		textAlign: 'center',
		paddingHorizontal: 4,
	},
	additionalKmBtnNumberText: {
		...theme.styles.P3R,
	},
	additionalKmBtnActiveText: {
		color: theme.colors.blue,
	},
	priceWithAdditionalKmsRow: {
		flexDirection: 'row',
		alignItems: 'center',
		paddingBottom: theme.spacing(7),
		paddingHorizontal: theme.spacing(6),
	},
	helpText: {
		...theme.styles.note,
		color: theme.colors.darkGrey,
	},
	currency: {
		fontSize: 14,
	}
});
