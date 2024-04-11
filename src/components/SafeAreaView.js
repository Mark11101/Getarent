import React, { useMemo } from 'react';
import { SafeAreaView as SAView } from 'react-native-safe-area-context';

const SafeAreaView = ({ top, bottom, left, right, ...rest }) => {

	const edges = useMemo(
		() =>
			[
				top && 'top',
				bottom && 'bottom',
				left && 'left',
				right && 'right',
			].filter(Boolean),
		[top, bottom, left, right]
	);

	return <SAView {...{ edges }} {...rest} />;
};

export default React.memo(SafeAreaView);
