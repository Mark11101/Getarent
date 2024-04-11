import { StyleSheet } from "react-native";

import theme from 'theme';

const styles = StyleSheet.create({
	container: {
		width: theme.normalize(150),
		flexDirection: 'column',
		marginBottom: theme.spacing(3.5),
	},
	primaryWrap: {
		justifyContent: 'flex-end',
		alignItems: 'flex-end',
		borderWidth: theme.normalize(1),
		borderRadius: theme.normalize(4),
		borderStyle: 'dashed',
		borderColor: theme.colors.midBlue,
		width: theme.normalize(150),
		height: theme.normalize(115),
		backgroundColor: theme.colors.lightBlue,
		position: 'relative',
	},
	secondaryWrap: {
		justifyContent: 'center',
		alignItems: 'center',
		borderWidth: theme.normalize(1),
		borderRadius: theme.normalize(4),
		borderStyle: 'dashed',
		borderColor: theme.colors.midBlue,
		width: theme.normalize(150),
		height: theme.normalize(115),
		backgroundColor: theme.colors.lightBlue,
	},
	icon: {
		marginBottom: theme.normalize(10),
		marginRight: theme.normalize(10),
	},
	hint: {
		...theme.getFontProps('semibold', 10, 12),
		color: theme.colors.greyBlue,
	},
	text: {
		...theme.styles.XS,
		color: theme.colors.blue,
	},
});

export default styles
