import React from 'react';
import { View, StyleSheet } from 'react-native';

import theme from 'theme';

const NavigationProgress = ({ total = 5, current = 3, style }) => {
	
	const arr = [...Array(total)].map((_, i) => i);
	const currentPercent = `${(100 / (total - 1)) * (current - 1)}%`;

	return (
		<View style={[styles.root, style]}>
			<View style={styles.line} />
			<View
				style={[
					styles.line,
					{
						width: currentPercent,
						backgroundColor: theme.colors.blue,
					},
				]}
			/>
			<View style={styles.container}>
				{arr.map((x, i) => (
					<View
						style={[
							styles.circle,
							x < current && {
								backgroundColor: theme.colors.blue,
							},
						]}
						key={i}
					/>
				))}
			</View>
		</View>
	);
};

export default React.memo(NavigationProgress);

const styles = StyleSheet.create({
	root: {
		position: 'relative',
		width: '100%',
	},
	container: {
		width: '100%',
		flexDirection: 'row',
		justifyContent: 'space-between',
	},
	circle: {
		borderRadius: 50,
		width: 10,
		height: 10,
		backgroundColor: theme.colors.grey,
		position: 'relative',
	},
	line: {
		width: '100%',
		height: 4,
		backgroundColor: theme.colors.grey,
		borderRadius: 5,
		position: 'absolute',
		top: 3,
	},
});
