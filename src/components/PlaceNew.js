import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

import SearchIcon from 'img/main-screen/search.svg';

import theme from 'theme';

const Place = ({ placeholder }) => {

	return (
		<View style={styles.container}>
			<View style={styles.iconContainer}>
				<SearchIcon width={16} height={16} />
			</View>
			<Text style={styles.placeholder}>
				{placeholder}
			</Text>
		</View>
	);
};

export default React.memo(Place);

const styles = StyleSheet.create({
    container: {
		height: theme.normalize(48),
		flexDirection: 'row',
		alignItems: 'center',
        justifyContent: 'center',
		paddingRight: theme.spacing(4),
	},
	iconContainer: {
		height: theme.normalize(48),
		width: theme.normalize(48),
		justifyContent: 'center',
		alignItems: 'center',
	},
	placeholder: {
		...theme.styles.src.P2,
	},
});
