import { StyleSheet } from 'react-native';

import theme from 'theme';

const styles = StyleSheet.create({
	container: {
		justifyContent: 'center',
		alignItems: 'center',
		borderWidth: theme.normalize(1),
		borderRadius: theme.normalize(4),
		borderStyle: 'dashed',
		borderColor: theme.colors.midBlue,
		width: theme.normalize(72),
		height: theme.normalize(72),
		backgroundColor: theme.colors.lightBlue,
	},
	inputStyledContainer: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		borderWidth: theme.normalize(1),
		borderRadius: theme.normalize(4),
		borderStyle: 'dashed',
		borderColor: theme.colors.midBlue,
		width: '100%',
		backgroundColor: theme.colors.lightBlue,
	},
	inputStyledText: {
		...theme.styles.P1R,
		flex: 1,
		lineHeight: undefined,
		textAlignVertical: 'center',
		paddingVertical: theme.spacing(3),
		paddingHorizontal: theme.spacing(4),
	},
	text: {
		...theme.styles.XS,
		color: theme.colors.blue,
	},
	inputStyledIcon: {
		marginHorizontal: theme.spacing(4),
	},
	inputStyledCheckIcon: {
		marginLeft: theme.spacing(4),
	},
	waiter: {
		marginLeft: theme.spacing(6),
		marginRight: theme.spacing(2),
	},
});

export default styles
