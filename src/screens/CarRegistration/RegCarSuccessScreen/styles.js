import { StyleSheet } from 'react-native';
import chroma from 'chroma-js';

import theme from 'theme';

const width = theme.normalize(86);

export default StyleSheet.create({
	container: {
		flex: 1,
		width: null,
		height: null,
		backgroundColor: '#282c34',
	},
	content: {
		...theme.styles.container,
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: '#282c34',
	},
	circle: {
		width,
		height: width,
		borderRadius: width / 2,
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: chroma(theme.colors.greyBlue).alpha(0.15).css(),
	},
	title: {
        ...theme.styles.H3,
        marginTop: theme.spacing(7.5),
        color: theme.colors.white,
    },
});
