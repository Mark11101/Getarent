import React from 'react';

import { WebPage, SafeAreaView, Header } from 'components';

import theme from 'theme';

const WebViewScreen = ({ route: { params: { url } = {} } }) => {

	return (

		<SafeAreaView top bottom style={theme.styles.container}>
			<Header />
			<WebPage uri={url} />
		</SafeAreaView>
	);
};

export default WebViewScreen;
