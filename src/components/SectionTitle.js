import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

import ButtonText from './ButtonText';

import theme from 'theme';

const SectionTitle = ({
	style,
	title,
	titleStyle,
	buttonTitle = 'Ещё',
	onPress,
}) => {

	return (
		<View style={[styles.container, style]}>
			<Text style={[
				theme.styles.P1, 
				theme.styles.flex, 
				titleStyle
			]}>
				{title}
			</Text>
			{
				!!onPress 
				&& 
					<ButtonText 
						title={buttonTitle} 
						{...{ onPress }} 
					/>
			}
		</View>
	);
};

export default React.memo(SectionTitle);

const styles = StyleSheet.create({
	container: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
	},
});
