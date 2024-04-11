import { StyleSheet } from "react-native";

import theme from 'theme';

const styles = StyleSheet.create({
	row: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		paddingVertical: 16,
		width: '100%',
	},	
	title: {
		...theme.styles.P1,
		width: '80%',
	},
    arrowView: {},
    arrowIcon: {
		marginRight: 7,
        transform: [{ rotate: '90deg'}],
    },
	buttonTextNotExpanded: {
		display: 'flex',
		margin: 0,
		padding: 0,
	},
	buttonTextExpanded: {
		display: 'flex',
		alignSelf: 'flex-start',
		margin: 0,
		padding: 0,
	},
	parentHr: {
		height: 1,
		color: theme.colors.white,
		width: '100%',
	},
	expandedView: {
		marginBottom: 16,
	}
});

export default styles;
