import { Animated, Easing, Pressable, StyleSheet } from 'react-native';
import React, { useRef, useState, useCallback, useEffect } from 'react';

import AndroidBackHandler from './AndroidBackHandler';

import theme from 'theme';

const SlideDownPanel = ({ style, open, onClose, onBackPress, ...rest }) => {

	const height = useRef(0);
	const value = useRef(new Animated.Value(-9999999));

	const [opacity, setOpacity] = useState(0);
	const [overlay, setOverlay] = useState(false);

	const onLayout = useCallback((e) => {

			const val = e.nativeEvent.layout.height;

			height.current = val;
			value.current.setValue(-val);

			setOpacity(
				value.current.interpolate({
					inputRange: [-val, 0],
					outputRange: [0, 0.5],
					extrapolate: 'clamp',
				})
			);
		}, []);

	useEffect(() => {

		if (!height.current) {
			return;
		};

		if (open) {
			setOverlay(true);
		};

		Animated.timing(value.current, {
			toValue: open ? 0 : -height.current,
			easing: Easing.out(Easing.ease),
			duration: 300,
			useNativeDriver: true,
		}).start(st => !open && setOverlay(!st.finished));

	}, [open]);

	return (
		<React.Fragment>
			{
				overlay 
				&&
					<>
						<Animated.View style={[styles.overlay, { opacity }]}>
							<Pressable
								style={theme.styles.flex}
								onPress={onClose}
							/>
						</Animated.View>
						<AndroidBackHandler {...{ onBackPress }} />
					</>
			}
			<Animated.View
				style={[
					styles.panel,
					{ transform: [{ translateY: value.current }] },
					style,
				]}
				{...{ onLayout }}
				{...rest}
			/>
		</React.Fragment>
	);
};

export default React.memo(SlideDownPanel);

const styles = StyleSheet.create({
	panel: {
		...theme.shadow(10), // fix android zIndex conflict with SearchControls
		position: 'absolute',
		top: 0,
		left: 0,
		right: 0,
		backgroundColor: theme.colors.transparent,
	},
	overlay: {
		...theme.shadow(10), // fix android zIndex conflict with SearchControls
		...StyleSheet.absoluteFill,
		backgroundColor: theme.colors.black,
	},
});
