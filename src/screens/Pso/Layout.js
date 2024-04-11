import React from 'react';
import theme from 'theme';

import {
	Header,
	Waiter,
	ScrollViewChangeContent,
	SafeAreaSpacingView,
} from 'components';

import psoStyle from './style';

export default function Layout({ goBack, waiter, children }) {
	return (
		<SafeAreaSpacingView style={psoStyle.container}>
			<Header onPressBack={goBack} big />

			<ScrollViewChangeContent
				style={theme.styles.container}
				contentContainerStyle={theme.styles.grow}
			>
				{children}
				{waiter && <Waiter />}
			</ScrollViewChangeContent>
		</SafeAreaSpacingView>
	);
}
