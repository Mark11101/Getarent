import React, { useCallback } from 'react';
import { TouchableOpacity } from 'react-native';

import api from 'api';
import Icon from './Icon';

import theme from 'theme';

export const QuestionTip = ({ header, text, iconStyles }) => {

	const onPress = useCallback(() => {
		api.navigation.navigate('QuestionTipPopup', { header, text });
	}, [header, text]);
	
	return (
		<TouchableOpacity
			hitSlop={theme.hitSlop}
			onPress={onPress}
		>
			<Icon
				name="question"
				color={theme.colors.black}
				size={theme.normalize(16)}
				style={iconStyles}
			/>
		</TouchableOpacity>
	);
};
