import React, { useRef, useState, useCallback, useEffect } from 'react';
import { Animated, View, StyleSheet, PanResponder } from 'react-native';
import DefaultLabel from './DefaultLabel';
import theme from 'theme';

const defaultDelta = theme.normalize(12);

export default React.memo(BaseSlider);

function BaseSlider({
	titleStyle,
	disabled,
	min = 0,
	max = 100,
	delta = defaultDelta,
	disabledMin = min,
	disabledMax = max,
	value: controlledStep = false,
	Label = DefaultLabel,
	invertSelection,
	tooltipTextRef,
	setAnimatedX,
	setTooltipOffset,
	setLabelY,
	onChange,
	onStart,
	onEnd,
	calcLabelValue,
}) {
	const initialized = useRef(false),
		controlledStepRef = useRef(controlledStep),
		inMove = useRef(false),
		labelTextRef = useRef(null),
		x = useRef(new Animated.Value(min)),
		dx = useRef(new Animated.Value(0)),
		getActualX = useRef((min, max) =>
			Animated.add(x.current, dx.current).interpolate(
				getInterpolationOptions(min, max)
			)
		).current,
		getCurrentStep = useRef(() => 0),
		getCurrentValueFromStep = useRef(false),
		[actualX, setActualX] = useState(() => getActualX()),
		_actualX = useRef(0),
		panResponder = useRef(
			PanResponder.create({
				onMoveShouldSetPanResponder: () => true,
				onPanResponderGrant: () => {
					inMove.current = true;

					onStart && onStart();
				},
				onPanResponderMove: Animated.event([null, { dx: dx.current }], {
					useNativeDriver: false,
				}),
				onPanResponderRelease: () => {
					inMove.current = false;

					x.current.setValue(_actualX.current);
					dx.current.setValue(0);

					if (onEnd) {
						onEnd();
					}
				},
				onPanResponderTerminate: () => {
					if (onEnd) {
						onEnd();
					}
				},
			})
		).current,
		[width, setWidth] = useState(0),
		[labelWidth, setLabelWidth] = useState(0),
		onLayout = useCallback(e => setWidth(e.nativeEvent.layout.width), []),
		onLabelLayout = useCallback(
			({
				nativeEvent: {
					layout: { width, x, y },
				},
			}) => {
				setLabelWidth(width);
				setTooltipOffset(x + width / 2);
				setLabelY(y);
			},
			[setTooltipOffset, setLabelY]
		),
		moveTo = useRef(value => x.current.setValue(value)),
		moveToStep = useRef(false),
		setLabel = useCallback(
			step => {
				tooltipTextRef.current?.setNativeProps({
					text: calcLabelValue ? calcLabelValue(step) : String(step),
				});

				if (calcLabelValue) {
					labelTextRef.current?.setNativeProps({
						text: calcLabelValue(step),
					});
				}
			},
			[calcLabelValue, tooltipTextRef]
		);

	useEffect(() => {
		const id = actualX.addListener(({ value }) => {
			_actualX.current = value;

			const currentStep = getCurrentStep.current(value);

			if (
				initialized.current &&
				inMove.current /* prevent 0 bug */ &&
				onChange
			) {
				onChange(currentStep, 'listener');
			}

			// prevent empty label
			if (inMove.current /* prevent 0 bug */) {
				setLabel(controlledStepRef.current);
			}
		});

		return () => actualX.removeListener(id);
	}, [actualX, tooltipTextRef, setLabel, onChange]);

	useEffect(() => {
		const avalibleWidth = width - labelWidth - delta * 2,
			range = max - min,
			stepWidth = avalibleWidth / range,
			minPosition = delta + stepWidth * disabledMin,
			maxPosition = stepWidth * disabledMax + delta;

		getCurrentStep.current = value =>
			Math.round((value - delta) / stepWidth);
		getCurrentValueFromStep.current = step => delta + stepWidth * step;
		moveToStep.current = step =>
			moveTo.current(getCurrentValueFromStep.current(step));

		// if ( minPosition > _actualX.current || _actualX.current > maxPosition )
		// {
		// 	const position = ( _actualX.current < minPosition ? minPosition : maxPosition ) - dx.current._value;

		// 	moveTo.current ( position );

		// 	if ( initialized.current && onChange ) onChange ( getCurrentStep.current ( position ), 'less or more by position' );
		// }

		const actualX = getActualX(minPosition, maxPosition);

		setActualX(actualX);
		setAnimatedX(actualX);

		// TODO: handle width and labelWidth changing.
		if (
			typeof controlledStepRef.current === 'number' &&
			width &&
			labelWidth
		) {
			initialized.current = true;

			moveToStep.current(controlledStepRef.current);
		}
	}, [
		width,
		labelWidth,
		delta,
		min,
		max,
		disabledMin,
		disabledMax,
		setAnimatedX,
		getActualX /* onChange */,
	]);

	useEffect(() => {
		let step;

		if (controlledStep < disabledMin) {
			step = disabledMin;

			if (onChange) {
				onChange(step, 'less by step');
			}

			return;
		} else if (disabledMax < controlledStep) {
			step = disabledMax;

			if (onChange) {
				onChange(step, 'more by step');
			}

			return;
		} else {
			step = controlledStep;
		}

		controlledStepRef.current = step;

		setLabel(step);

		if (
			initialized.current &&
			!inMove.current &&
			typeof step === 'number'
		) {
			moveToStep.current(step);
		}
	}, [controlledStep, disabledMin, disabledMax, setLabel, onChange]);

	return (
		<View style={styles.container} {...{ onLayout }}>
			<View style={[styles.track, invertSelection && styles.invertTrack]}>
				<Animated.View
					style={[
						styles.selectedTrack,
						invertSelection && styles.invertSelectedTrack,
						disabled && styles.disabled,
						{
							transform: [
								{ translateX: labelWidth / 2 - width },
								{ translateX: actualX },
							],
						},
					]}
				/>
			</View>
			<Animated.View
				style={{ transform: [{ translateX: actualX }] }}
				{...panResponder.panHandlers}
			>
				<Label
					textRef={calcLabelValue ? labelTextRef : undefined}
					onLayout={onLabelLayout}
					{...{ disabled }}
				/>
			</Animated.View>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		justifyContent: 'center',
		alignItems: 'flex-start',
	},
	track: {
		position: 'absolute',
		left: 0,
		right: 0,
		height: theme.normalize(4),
		borderRadius: theme.normalize(4) / 2,
		backgroundColor: theme.colors.grey,
		alignItems: 'stretch',
		overflow: 'hidden',
	},
	invertTrack: {
		backgroundColor: theme.colors.blue,
	},
	selectedTrack: {
		flex: 1,
		backgroundColor: theme.colors.blue,
	},
	disabled: {
		backgroundColor: theme.colors.grey,
	},
	invertSelectedTrack: {
		backgroundColor: theme.colors.grey,
	},
});

function getInterpolationOptions(min = 0, max = 0) {
	if (min > max) {
		max = min;
	}

	return {
		inputRange: [min, max],
		outputRange: [min, max],
		extrapolate: 'clamp',
	};
}
