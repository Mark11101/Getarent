import React from 'react';
import { SafeAreaView, Text, StyleSheet, View } from 'react-native';

import { Header } from 'components';

import theme from 'theme';

const Popup = ({ route: { params } }) => {

	const { header, text } = params;
	
	return (
		<SafeAreaView style={[theme.styles.paper, theme.styles.flex]}>
			<View>
				<Header title={header} />
				<View style={styles.list}>
					<Text style={styles.description}>
						{text}
					</Text>
				</View>
			</View>
		</SafeAreaView>
	);
};

export const QuestionTipPopup = React.memo(Popup);

const styles = StyleSheet.create({
	description: {
		...theme.styles.P1R,
		marginBottom: theme.spacing(6),
	},
	list: {
		paddingLeft: theme.spacing(6),
		paddingRight: theme.spacing(12),
	},
});
