import React from 'react';
import { View, StyleSheet, Text } from 'react-native';

import Circle from './Circle';
import { STATUS_LINE } from 'constants';

import theme from 'theme';

const StatusLine = ({ style, status, ...rest }) => {

	let color = theme.colors.grey;

	if (!status) {
		return;
	};

	switch (STATUS_LINE[status]?.type) {

		case 'success': {
			color = theme.colors.green;
			break;
		}
		case 'error': {
			color = theme.colors.red;
			break;
		}
		default:
			break;
	};

	return (
		<View style={[styles.container, style]} {...rest}>
			<Circle
				style={styles.statusCircle}
				diameter={theme.normalize(16)}
				color={color}
			/>
			<Text
				style={styles.statusTitle}
				removeClippedSubviews={false}
				collapsable={false}
			>
				{STATUS_LINE[status]?.text || null}
			</Text>
		</View>
	);
};

export default React.memo(StatusLine);

const styles = StyleSheet.create({
	container: {
		flexDirection: 'row',
	},
	statusCircle: {
		marginRight: theme.spacing(3),
		marginVertical: theme.spacing(1),
	},
	statusTitle: {
		...theme.styles.P2R,
	},
});
