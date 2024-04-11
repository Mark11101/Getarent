import React from 'react';
import { View, Text } from 'react-native';

import theme from 'theme';

const OutlineCircle = ({ diameter, color, text }) => {

	return (
		<View
			style={{
				justifyContent: 'center',
				alignItems: 'center',
				borderColor: color,
				borderWidth: theme.normalize(2),
				borderRadius: theme.normalize(diameter / 2),
				height: theme.normalize(diameter),
				width: theme.normalize(diameter),
			}}
		>
			<Text style={{}}>
				{text}
			</Text>
		</View>
	);
};

export default React.memo(OutlineCircle);
