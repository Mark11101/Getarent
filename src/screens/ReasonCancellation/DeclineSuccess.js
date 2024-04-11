import React from 'react';
import chroma from 'chroma-js';
import { View, Text, StyleSheet } from 'react-native';

import api from 'api';
import { SafeAreaSpacingView, Icon } from 'components';

import theme from 'theme';

const size = theme.normalize(20);
const width = theme.normalize(86);

const DeclineSuccess = ({
    route: {
		params: { uuid, role },
	},
}) => {

	setTimeout(() => {
		api.navigation.push('RentRoom', {
			uuid,
			openUnavailableDatesModal: role === 'HOST',
		});
	}, 1500);

	return (
		<SafeAreaSpacingView style={styles.container}>
			<View style={styles.content}>
				<View style={styles.circle}>
					<Icon
						name="checkmark"
						color={theme.colors.green}
						{...{ size }}
					/>
				</View>
				<Text style={styles.title}>
					Аренда отменена
				</Text>
			</View>
		</SafeAreaSpacingView>
	);
};

export default DeclineSuccess;

const styles = StyleSheet.create({
	container: {
		...theme.styles.container,
		justifyContent: 'space-between',
		paddingHorizontal: theme.spacing(6),
		paddingBottom: theme.spacing(6),
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
		backgroundColor: chroma(theme.colors.green).alpha(0.15).css(),
	},
	title: {
		...theme.styles.H3,
		marginTop: theme.spacing(7.5),
	},
	button: {
		marginTop: theme.spacing(4),
	},
});
