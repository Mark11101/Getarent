import { StyleSheet } from 'react-native';
import { useDispatch } from 'react-redux';
import { WebView } from 'react-native-webview';
import React, { useRef, useCallback } from 'react';

import Waiter from './Waiter';
import Empty from './Empty';

import theme from 'theme';

const errorText = 'Карта пока недоступна, попробуйте позже';

const emptyProps = {
	icon: 'error',
	error: errorText,
	iconColor: theme.colors.grey,
	iconSize: theme.normalize(92),
	buttonText: 'Обновить страницу',
};
	
const renderLoading = () => <Waiter />;

const WebPage = (
	{ 
		uri, 
		scalable, 
		handleRequest, 
		whitelist = 'https://client.getinchat.com', 
		...rest 
	},
	ref
) => {

	const dispatch = useDispatch();

	const wv = useRef();

	const renderError = useCallback(			
		() => (
			<Empty
				style={styles.empty}
				{...emptyProps}
				buttonAction={() => (ref || wv)?.current?.reload()}
			/>
		),
		[ref]
	);

	const onShouldStartLoadWithRequest = useCallback(

		({ url }) => {

			const isSame = url === uri || url === `${uri}/`;

			if (handleRequest) {
				
				const res = handleRequest(url, isSame);

				if (typeof res === 'boolean') {
					return res;
				}
			};

			if (isSame) {
				return true;
			};

			const isWhitelisted =
				!!whitelist &&
				[].concat(whitelist).some(u => url.startsWith(u));

			if (isWhitelisted) {
				return true;
			};

			return false;
		},
		
		[uri, whitelist, handleRequest]
	);

	const INJECTED_JAVASCRIPT =
		"const meta = document.createElement('meta'); meta.setAttribute('content', 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0'); meta.setAttribute('name', 'viewport'); document.getElementsByTagName('head')[0].appendChild(meta);";

	return (
		<WebView
			ref={ref || wv}
			startInLoadingState
			style={theme.styles.container}
			injectedJavaScript={scalable ? null : INJECTED_JAVASCRIPT}
			source={{ uri }}
			{...{
				renderLoading,
				renderError,
				onShouldStartLoadWithRequest,
			}}
			{...rest}
		/>
	);
}

export default React.forwardRef(WebPage);

const styles = StyleSheet.create({
	empty: {
		backgroundColor: theme.colors.white,
		paddingHorizontal: theme.spacing(6),
	},
});
