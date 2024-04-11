import { StyleSheet } from "react-native";

import theme from 'theme';

const styles = StyleSheet.create({
	content: {
		...theme.styles.container,
		justifyContent: 'space-between',
		paddingHorizontal: theme.spacing(6),
		paddingBottom: theme.spacing(6),
	},
	photos: {
		flexDirection: 'row',
		flexWrap: 'wrap',
		justifyContent: 'space-between',
	},
	thumbnail: {
		...theme.styles.thumbnail,
		marginBottom: theme.spacing(2.5),
	},
	text: {
		marginBottom: theme.spacing(4),
		...theme.styles.src.P2R,
	},
	button: {
		marginTop: theme.spacing(4),
	},
});

export default styles
