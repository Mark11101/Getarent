import React from 'react';
import { useSelector } from 'react-redux';
import { Text, StyleSheet } from 'react-native';

import { useSafeSpacing } from 'hooks';

import theme from 'theme';

const DevMode = () => {
	
	const status = useSelector(st => st.devMode);
	const style = useSafeSpacing('top', 'top', 1, styles.text);

	return (
		!!status && (
			<Text pointerEvents="none" {...{ style }}>
				DEV
			</Text>
		)
	);
};

export default React.memo(DevMode);

const styles = StyleSheet.create({
	text: {
		...theme.styles.P1,
		position: 'absolute',
		right: theme.spacing(2),
		top: theme.spacing(2),
		opacity: 0.3,
	},
});
