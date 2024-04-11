import { StyleSheet } from "react-native";
import chroma from 'chroma-js';

import theme from "theme";

const width = theme.normalize(86);

export default StyleSheet.create({
	container: {
		...theme.styles.container,
		justifyContent: 'space-between',
		paddingHorizontal: theme.spacing(6),
		paddingBottom: theme.spacing(6),
	},
	header: {
		marginTop: 30,
		paddingHorizontal: 0,
	},
	content: {
		...theme.styles.container,
		justifyContent: 'center',
		alignItems: 'center',
	},
	circle: {
		width,
		height: width,
		borderRadius: width / 2,
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: chroma(theme.colors.red).alpha(0.15).css(),
	},
	title: {
		...theme.styles.H3,
		marginTop: theme.spacing(7.5),
        marginBottom: theme.spacing(4.5),
	},
    subtitle: {
        textAlign: 'center',
        color: theme.colors.red,
        lineHeight: 22,
    },
	button: {
		marginTop: theme.spacing(4),
	},
});
