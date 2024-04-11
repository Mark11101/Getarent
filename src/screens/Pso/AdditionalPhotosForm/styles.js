import { StyleSheet } from 'react-native';

import theme from 'theme';

const styles = StyleSheet.create({
	photos: {
		width: '100%',
		flexDirection: 'row',
		flexWrap: 'wrap',
		justifyContent: 'space-between',
	},
	uploader: {
		...theme.styles.thumbnail,
		width: theme.normalize(150),
		height: theme.normalize(115),
		marginBottom: 15,
	},
	thumbnail: {
		...theme.styles.thumbnail,
		width: theme.normalize(150),
		height: theme.normalize(115),
		marginBottom: 15,
	},
});

export default styles
