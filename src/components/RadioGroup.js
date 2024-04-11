import React from 'react';
import { View } from 'react-native';

import Radio from './Radio';

const RadioGroup = ({ value, options, onChange, ...rest }) => {

	return (
		<View {...rest}>
			{options.map((option) => (
				<Radio
					key={option.value}
					{...option}
					checked={option.value === value}
					{...{ onChange }}
				/>
			))}
		</View>
	);
};

export default React.memo(RadioGroup);
