import { StyleSheet } from 'react-native';
import theme from 'theme';

export default StyleSheet.create({
	container: {
		flex: 1,
		paddingTop: 0,
		paddingBottom: theme.spacing(6),
		backgroundColor: theme.colors.white,
	},
	offset: {
		marginHorizontal: theme.spacing(6),
		padding: theme.spacing(0),
	},
	lightText: {
		...theme.getFontProps('regular', 11, 18),
		marginTop: 10,
	},
	headerTitle: {
		...theme.getFontProps('semibold', 13, 24),
	},
	title: {
		...theme.getFontProps('semibold', 16, 26),
	},
	thumbnail: {
		...theme.styles.thumbnail,
		marginBottom: theme.spacing(2.5),
		marginRight: theme.spacing(2.5),
	},
	photos: {
		flexDirection: 'row',
		flexWrap: 'wrap',
		marginVertical: theme.spacing(6),
	},
	stepView: {
		...theme.styles.grow,
		marginHorizontal: theme.spacing(6),
		padding: theme.spacing(0),
	},
	nextStepBtn: {
		...theme.styles.shrink,
		marginTop: 'auto',
	},
	mainPhotosForm: {
		marginTop: 10,
	},
});
