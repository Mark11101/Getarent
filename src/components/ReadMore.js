import React, { useState, useCallback } from 'react';
import { View, Text, Dimensions, StyleSheet } from 'react-native';

import ButtonText from './ButtonText';

const { width: left } = Dimensions.get('window');

const ReadMore = ({
	style,
	containerStyle,
	numberOfLines = 4,
	children,
	...rest
}) => {

	const [width, setWidth] = useState(0);
	const [height, setHeight] = useState(0);
	const [max, setMax] = useState(numberOfLines);
	const [collapsed, setCollapsed] = useState(true);

	const onLayout = useCallback(e => {
		
		const { height, width } = e.nativeEvent.layout;

		setHeight(height);
		setWidth(width);
	}, []);

	const onTextLayout = useCallback(e => setMax(e.nativeEvent.lines.length), []);
	const onPress = useCallback(() => setCollapsed(collapsed => !collapsed), []);

	return (
		<View style={[styles.container, containerStyle]} {...rest}>
			<Text
				numberOfLines={collapsed ? numberOfLines : undefined}
				{...{ style, onLayout }}
			>
				{children}
			</Text>
			<View style={[containerStyle, styles.second, { left, height }]}>
				<Text
					style={[style, styles.hiddenText, { width }]}
					{...{ onTextLayout }}
				>
					{children}
				</Text>
			</View>
			{
				max > numberOfLines 
				&&
					<ButtonText
						style={styles.button}
						title={collapsed ? 'Развернуть' : 'Свернуть'}
						{...{ onPress }}
					/>
			}
		</View>
	);
};

export default React.memo(ReadMore);

const styles = StyleSheet.create({
	container: {
		alignItems: 'flex-start',
		overflow: 'hidden',
	},
	second: {
		position: 'absolute',
		opacity: 0,
		top: 0,
		overflow: 'hidden',
	},
	hiddenText: {
		position: 'absolute',
		left: 0,
		right: 0,
		top: 0,
	},
	button: {
		paddingHorizontal: 0,
	},
});
