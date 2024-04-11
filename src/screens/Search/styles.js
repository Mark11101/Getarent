import { StyleSheet, Dimensions } from 'react-native';

import theme from 'theme';

const height = Dimensions.get('window').height;

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: theme.colors.white,
	},
    flex: {
        ...theme.styles.flex
    },
	noData: {
		height: height * 2 / 3,
		justifyContent: 'center',
	},
	noDataText: {
		...theme.styles.src.P1R,
		color: theme.colors.darkGrey,
		textAlign: 'center',
	}
});

export default styles
