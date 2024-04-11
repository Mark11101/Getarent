import React from 'react';
import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import theme from 'theme';

const LayoutStripe = ({ children }) => {

	const { top } = useSafeAreaInsets();

	return (
		<View style={theme.styles.container}>
			<View
				style={{
					flex: 1,
					marginTop: top,
				}}
			>
				{children}
			</View>
		</View>
	);
};

export default LayoutStripe; 
