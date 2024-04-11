import { StyleSheet } from 'react-native';

import theme from 'theme';

export default StyleSheet.create({
	container: {
		paddingTop: theme.spacing(6),
		paddingBottom: theme.spacing(6),
	},
	content: {
		flex: 1,
		paddingHorizontal: theme.spacing(6),
	},
	textAreaLabel: {
		marginBottom: theme.spacing(2.5),
	},
	textAreaInput: {
		...theme.styles.P2R,
		height: theme.normalize(120),
		textAlignVertical: 'top',
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
	radioBtns: {
		marginBottom: theme.spacing(4),
	},
});
