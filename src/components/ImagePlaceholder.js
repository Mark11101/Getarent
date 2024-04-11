import React from 'react';
import { Text, StyleSheet, View, Image } from 'react-native';

import theme from 'theme';

const ImagePlaceholder = ({
	style = {},
	imageStyle = {},
	placeholderStyle = {},
	placeholderTextStyle = {},
	placeholderPosition = {
		bottom: 5,
		left: 5,
	},
	placeholder,
	onPress,
	...rest
}) => {

	return (
		<View
			onStartShouldSetResponder={onPress}
			style={[style, styles.imageContainer]}
		>
			<Image 
				style={[styles.image, imageStyle]} 
				{...rest} 
			/>
			<View
				style={[
					styles.placeholderContainer,
					placeholderStyle,
					placeholderPosition,
				]}
			>
				<Text style={[styles.placeholder, placeholderTextStyle]}>
					{placeholder}
				</Text>
			</View>
		</View>
	);
};

export default ImagePlaceholder;

const styles = StyleSheet.create({
	imageContainer: {
		position: 'relative',
	},
	image: {
		width: '100%',
		borderRadius: 4,
	},
	placeholderContainer: {
		position: 'absolute',
		borderRadius: 50,
		width: 20,
		height: 20,
		backgroundColor: theme.colors.blue,
		textAlign: 'center',
		alignItems: 'center',
		justifyContent: 'center',
	},
	placeholder: {
		color: theme.colors.white,
	},
});
