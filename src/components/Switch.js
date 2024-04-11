import {
	View,
	Text,
	Animated,
	StyleSheet,
	TouchableWithoutFeedback,
} from 'react-native';
import React, { useState, useCallback, useEffect } from 'react';

import theme from 'theme';

const width = theme.normalize(38);
const height = theme.normalize(24);
const switcherHeight = height - theme.normalize(8);

const offset = (height - switcherHeight) / 2;
const max = width - switcherHeight - offset * 2;

const getMax = (width, height) => {

	const switcherHeight = height - theme.normalize(8);
	const offset = (height - switcherHeight) / 2;
	const max = width - switcherHeight - offset * 2;

	return max;
};

const Switch = ({
	style,
	long,
	leftText,
	rightText,
	value: initialValue = false,
	disabled,
	onChange,
	...rest
}) => {

	const [value, setValue] = useState(initialValue);

	const [translateX] = useState(() => new Animated.Value(initialValue ? max : 0));
	const colorAnimation = React.useRef(new Animated.Value(0)).current;
	
	const [opacity] = useState(() =>

		translateX.interpolate({
			inputRange: [0, max],
			outputRange: [0, 1],
			extrapolate: 'clamp',
		})
	);

	const onPress = useCallback(
		() =>
			setValue(val => {
				if (onChange) {
					onChange(!val);
				}

				return !val;
			}),
		[onChange]
	);

	const bgcolorAnimation = colorAnimation.interpolate({
        inputRange: [0, 1],
        outputRange: [theme.colors.blue, theme.colors.lightCyan],
    });

	useEffect(() => {
		colorAnimation.setValue(value ? 1 : 0);
	}, [value]);
	
	useEffect(() => {

		Animated.spring(translateX, {
			toValue: value ? (long ? getMax(203, 38) : getMax(width, height)) : 0,
			duration: 300,
			useNativeDriver: true,
		}).start();
		
	}, [translateX, value]);

	useEffect(() => setValue(initialValue), [initialValue]);

	return (
		<TouchableWithoutFeedback
			hitSlop={theme.hitSlop}
			disabled={disabled}
			{...{ onPress }}
			{...rest}
		>
			<View style={[
				styles.container, 
				style,
				long && {
					height: 38,
					width: 327,
					borderRadius: 20,
				}
			]}>
				{
					long
					&&
						<>
							<Text style={styles.leftTextGrey}>
								{leftText}
							</Text>
							<Text style={styles.rightTextBlue}>
								{rightText}
							</Text>
						</>
				}
				{
					!long
					&&
						<Animated.View style={[styles.background, { opacity }]} />
				}
				<Animated.View
					style={[
						styles.switcher,
						disabled && { opacity: 0.5 }, 
						{ transform: [{ translateX }] },
						long && {
							width: 150,
							height: 28,
							borderRadius: 20,
							justifyContent: 'center',
							alignItems: 'center',
							left: 6,
							top: 5,
							backgroundColor: bgcolorAnimation,
							opacity: 1,
						}
					]}
				>
					{
						long
						?
							<Animated.Text style={[
								styles.longText
							]}>
								{value ? rightText : leftText}
							</Animated.Text>
						:
							<Animated.View
								style={[styles.switcherBackground, { opacity }]}
							/>
					}
				</Animated.View>
			</View>
		</TouchableWithoutFeedback>
	);
};

export default React.memo(Switch);

const styles = StyleSheet.create({
	container: {
		width,
		height,
		borderRadius: height / 2,
		backgroundColor: theme.colors.lightGrey,
		overflow: 'hidden',
	},
	background: {
		...StyleSheet.absoluteFill,
		backgroundColor: theme.colors.blue,
	},
	switcher: {
		position: 'absolute',
		top: offset,
		left: offset,
		height: switcherHeight,
		width: switcherHeight,
		borderRadius: switcherHeight / 2,
		backgroundColor: theme.colors.blue,
		overflow: 'hidden',
	},
	switcherBackground: {
		...StyleSheet.absoluteFill,
		backgroundColor: theme.colors.white,
	},
	longText: {
		fontFamily: 'Inter',
		fontSize: 14,
		lineHeight: 20,
		color: theme.colors.white
	},
	leftTextGrey: {
		fontFamily: 'Inter',
		fontSize: 14,
		lineHeight: 20,
		color: '#878F9B',
		position: 'absolute',
		left: 29,
		top: 9,
	},
	rightTextBlue: {
		fontFamily: 'Inter',
		fontSize: 14,
		lineHeight: 20,
		color: theme.colors.blue,
		position: 'absolute',
		right: 29,
		top: 9,
	}
});
