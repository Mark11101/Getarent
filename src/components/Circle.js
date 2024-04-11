import React from 'react';
import { View } from 'react-native';

import theme from 'theme';

const Circle = ({ style, diameter, color, ...rest }) => {

	return (
		<View
			style={[
				{
					backgroundColor: color,
					borderRadius: theme.normalize(diameter / 2),
					height: theme.normalize(diameter),
					width: theme.normalize(diameter),
				},
				style,
			]}
			{...rest}
		/>
	);
};

export default React.memo(Circle);
