import React from 'react';

import { PrimaryButton } from 'components';

export const NextStepBtn = ({
	style = {},
	titleStyle = {},
	disabled = false,
	title = 'Следующий шаг',
	onPress,
}) => {
	return (
		<PrimaryButton
			disabled={disabled}
			title={title}
			onPress={onPress}
			style={style}
			titleStyle={titleStyle}
		/>
	);
};
