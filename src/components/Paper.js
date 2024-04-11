import React from 'react';
import { View } from 'react-native';

import theme from 'theme';

const Paper = ({ elevation, style, ...rest }) => {

	return (
		<View
			style={[
				theme.styles.paper, 
				{
					shadowColor: 'rgb(36, 93, 150)',
					shadowOffset: {
						width: 0,
						height: 4,
					},
					shadowOpacity: 0.15,
					shadowRadius: 16,
					elevation: 6,		
				},
				style,
			]}
			{...rest}
		/>
	);
};

export default React.memo(Paper);
