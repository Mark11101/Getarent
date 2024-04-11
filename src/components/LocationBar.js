import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';

import Place from './Place';

import theme from 'theme';

const defaultEmpty = { type: 'empty' };
const invalidProps = { iconColor: theme.colors.red };

const LocationBar = ({
	style,
	place,
	invalid,
	disabled,
	placeholder,
	placeholderOnlyAddress = false,
	...rest
}) => {

	if (!place) {
		place = defaultEmpty;
	};

	return (
		<TouchableOpacity
			style={[
				theme.styles.border,
				invalid && styles.invalid,
				style,
				disabled && theme.styles.disabled,
				{
					backgroundColor: '#fff'
				}
			]}
			{...{ disabled }}
			{...rest}
		>
			<Place
				{...place}
				invalid={invalid}
				placeholderOnlyAddress={placeholderOnlyAddress}
				{...(invalid ? invalidProps : {})}
				{...{ placeholder }}
			/>
		</TouchableOpacity>
	);
};

export default React.memo(LocationBar);

const styles = StyleSheet.create({
	invalid: {
		borderColor: theme.colors.red,
	},
});
