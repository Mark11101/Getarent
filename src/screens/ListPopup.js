import React from 'react';
import { SafeAreaView, ScrollView, Text, StyleSheet, View } from 'react-native';

import api from 'api';
import { Header, PrimaryButton, SectionItem } from 'components';

import theme from 'theme';

const Popup = ({ route: { params } }) => {

	const { header, content } = params;
	
	return (
		<SafeAreaView style={[theme.styles.paper, theme.styles.flex]}>
			<ScrollView
				keyboardShouldPersistTaps="handled"
				showsVerticalScrollIndicator={false}
				style={theme.styles.container}
			>
				<View>
					<Header title={header} />
					<View style={styles.list}>
						{content.map(({ text, id }) => (
							<SectionItem key={id}>
								<Text style={styles.description}>{text}</Text>
							</SectionItem>
						))}
					</View>
				</View>
			</ScrollView>
			<PrimaryButton
				title="Продолжить"
				style={styles.button}
				onPress={() => api.navigation.goBack()}
			/>
		</SafeAreaView>
	);
};

export const ListPopup = React.memo(Popup);

const styles = StyleSheet.create({
	description: {
		...theme.styles.P1R,
		marginBottom: theme.spacing(6),
	},
	list: {
		paddingLeft: theme.spacing(6),
		paddingRight: theme.spacing(12),
	},
	button: {
		margin: theme.spacing(4),
	},
});
