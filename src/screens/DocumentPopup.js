import React from 'react';
import PDFView from 'react-native-view-pdf';
import { WebView } from 'react-native-webview';
import { SafeAreaView, StyleSheet, Platform } from 'react-native';

import api from 'api';
import { Header, PrimaryButton, Waiter } from 'components';

import theme from 'theme';

const Popup = ({
	route: {
		params: { uri },
	},
}) => {

	const [waiter, setWaiter] = React.useState(false);

	React.useEffect(() => {
		setWaiter(true);
		return () => setWaiter(false)
	}, []);

	const isPdf = uri.indexOf(".pdf") != -1;
	const isAndroid = Platform.OS === 'android';

	return (
		<SafeAreaView style={[theme.styles.paper, theme.styles.flex]}>
			<Header />
			{
				isAndroid && isPdf
				?
					<PDFView
						fadeInDuration={250.0}
						style={{ flex: 1 }}
						resource={uri}
						resourceType='url'
						onLoad={() => setWaiter(false)}
					/>
				:
					<WebView
						style={{ flex: 1 }}
						source={{
							uri,
						}}
						onLoad={() => setWaiter(false)}
					/>
			}
			<PrimaryButton
				style={styles.button}
				title="Спасибо, всё понятно"
				onPress={() => api.navigation.goBack()}
			/>
			{waiter && <Waiter />}
		</SafeAreaView>
	);
};

export const DocumentPopup = React.memo(Popup);

const styles = StyleSheet.create({
	button: {
		margin: theme.spacing(4),
	},
});
