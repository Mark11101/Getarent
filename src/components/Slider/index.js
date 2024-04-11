import React, { useRef, useState, useCallback } from 'react';
import { View, Text, Animated, StyleSheet } from 'react-native';

import Tooltip from './Tooltip';
import TextLabel from './TextLabel';
import ValueLabel from './ValueLabel';
import BaseSlider from './BaseSlider';
import DefaultLabel from './DefaultLabel';

import theme from 'theme';

const tooltipOffsetY = theme.normalize(36);

const Slider = ({
	style,
	titleStyle,
	disabled,
	title,
	valueLabel,
	calcLabelValue = valueLabel ? String : undefined,
	onStart: _onStart,
	onEnd: _onEnd,
	...props
}) => {
	
	const tooltipTextRef = useRef(null),
		[y, setY] = useState(false),
		[x, setX] = useState(false),
		[labelY, setLabelY] = useState(false),
		[tooltipWidth, setTooltipWidth] = useState(0),
		[tooltipOffset, setTooltipOffset] = useState(false),
		[hideTooltip, setHideTooltip] = useState(true),
		[animatedX, setAnimatedX] = useState(false),
		onLayout = useCallback(({ nativeEvent: { layout: { y, x } } }) => {
			setY(y);
			setX(x);
		}, []),
		onTooltipLayout = useCallback(
			e => setTooltipWidth(e.nativeEvent.layout.width),
			[]
		),
		onStart = useCallback(() => {
			setHideTooltip(false);

			if (_onStart) {
				_onStart();
			}
		}, [_onStart]),
		onEnd = useCallback(() => {
			setHideTooltip(true);

			if (_onEnd) {
				_onEnd();
			}
		}, [_onEnd]);

	return (
		<React.Fragment>
			<View
				style={[styles.container, style]}
				pointerEvents={disabled ? 'none' : undefined}
				{...{ onLayout }}
			>
				<Text style={[styles.title, titleStyle]}>{title}</Text>
				<BaseSlider
					Label={
						valueLabel
							? ValueLabel
							: calcLabelValue
							? TextLabel
							: DefaultLabel
					}
					{...{
						disabled,
						tooltipTextRef,
						setAnimatedX,
						setTooltipOffset,
						setLabelY,
						calcLabelValue,
						onStart,
						onEnd,
					}}
					{...props}
				/>
			</View>
			{!hideTooltip &&
				!disabled &&
				labelY !== false &&
				y !== false &&
				x !== false &&
				animatedX !== false && (
					<Animated.View
						style={[
							styles.tooltip,
							{ top: y + labelY - tooltipOffsetY, left: x },
							{
								transform: [
									{ translateX: -tooltipWidth / 2 },
									{ translateX: tooltipOffset },
									{ translateX: animatedX },
								],
							},
						]}
						onLayout={onTooltipLayout}
					>
						<Tooltip textRef={tooltipTextRef} />
					</Animated.View>
				)}
		</React.Fragment>
	);
};

export default React.memo(Slider);

const styles = StyleSheet.create({
	container: {
		paddingTop: theme.spacing(6),
	},
	title: {
		...theme.styles.src.P2R,
		color: theme.colors.lightCyan,
		marginBottom: theme.spacing(3),
	},
	tooltip: {
		position: 'absolute',
	},
});
