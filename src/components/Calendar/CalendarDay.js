import React from 'react';
import { View, Text, StyleSheet, TouchableWithoutFeedback, Dimensions } from 'react-native';

import theme from 'theme';

const display_width = Dimensions.get('window').width;

const width = theme.normalize(36);
const height = width;

const borderWidth = theme.normalize(2);
const innerSize = Math.min(theme.normalize(30), width - borderWidth * 2 - 2);
const borderColor = theme.colors.blue;

const selected = {
	position: 'absolute',
	height,
	width: '100%',
	borderColor,
	borderTopWidth: borderWidth,
	borderBottomWidth: borderWidth,
	backgroundColor: 'white',
};

const circle = {
	position: 'absolute',
	width,
	height,
	borderWidth,
	borderRadius: height,
	// prevent android bug
	borderRightColor: borderColor,
	borderTopColor: borderColor,
	borderLeftColor: borderColor,
	borderBottomColor: borderColor,
};

const CalendarDay = ({ children, state, date, marking, vertical, onPressDay }) => {

	const disabled = state === 'disabled';

	const {
		both,
		startingDay,
		endingDay,
		selected,
		unavailable,
		marked,
		disableTouchEvent,
		selectedColor,
		isPastDays,
		isInRentDays,
		isBookedDays,
		isBlockedDays,
		startDate,
		endDate
	} = marking;
	
	const current = both || (startingDay && endingDay);
	const left = !current && startingDay;
	const right = !current && endingDay;
	const middle = selected && !(startingDay || endingDay);
	
	const isStartDate = startDate === date.dateString;
	const isEndDate = endDate === date.dateString;
	
	return (
		<View style={[
			styles.container,
			vertical && {
				height: 61,
				marginBottom: -12,
			},
		]}>
			<View style={styles.wrapper}>
				{(current || left || right) && !marked && (
					<View
						style={
							current
								? styles.circle
								: left
								? styles.leftSemicircle
								: styles.rightSemicircle
						}
					/>
				)}
				{(middle || left || right) && !marked && (
					<View
						style={
							middle
								? styles.middle
								: left
								? styles.right
								: styles.left
						}
					/>
				)}
				{both && <View style={styles.innerCircle} />}
			</View>
			<TouchableWithoutFeedback
				hitSlop={theme.hitSlop}
				onPress={() => onPressDay(date, startDate, endDate, isInRentDays, isBookedDays)}
				disabled={disableTouchEvent}
			>
				<View style={[
					styles.touchable,
					vertical && {

						justifyContent: 'space-between',
						paddingTop: 12,
						paddingBottom: 3,

						...isInRentDays && {
							backgroundColor: '#DBE3EF',
						},

						...isBlockedDays && {
							backgroundColor: '#F5F5F7',
						},

						...isBookedDays && {
							backgroundColor: '#F5F5F7',
						},

						...isStartDate && {
							borderBottomLeftRadius: 8,
							borderTopLeftRadius: 8,
						},

						...isEndDate && {
							borderBottomRightRadius: 8,
							borderTopRightRadius: 8,
						},
					},
				]}>
					<Text
						style={[
							theme.styles.P2,
							(selected) && styles.active,
							unavailable && styles.unavailable,
							disabled && theme.styles.disabled,
							selectedColor && { color: selectedColor },
							vertical && {
								fontFamily: 'Inter',
								fontSize: 14,
								lineHeight: 18,
								color: theme.colors.black,

								...isBlockedDays && {
									color: '#878F9B',
								},
							},
							isPastDays && {
								color: theme.colors.grey
							}
						]}
					>
						{children}
					</Text>
					{
						vertical && (isStartDate || isEndDate)
						&&
							<Text numberOfLines={1} style={[
								{
									fontFamily: 'Inter',
									lineHeight: 18,
									color: theme.colors.black,
									fontSize: display_width * 0.025,
								},
								isStartDate && {
									alignSelf: 'flex-start',
									paddingLeft: 7,
								},
								isEndDate && {
									alignSelf: 'flex-end',
									paddingRight: 7,
								},
								isBlockedDays && {
									color: '#878F9B',
								},
							]}>
								{isInRentDays && 'аренда'}
								{isBookedDays && 'бронь'}
								{isBlockedDays && 'скрыто'}
							</Text>
					}
				</View>
			</TouchableWithoutFeedback>
		</View>
	);
};

export default React.memo(CalendarDay);

const styles = StyleSheet.create({
	container: {
		alignItems: 'stretch',
		justifyContent: 'center',
		width: '100%',
		height: theme.normalize(40),
	},
	touchable: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center',
	},
	wrapper: {
		...StyleSheet.absoluteFill,
		alignItems: 'center',
		justifyContent: 'center',
	},
	circle,
	leftSemicircle: {
		...circle,
		transform: [{ translateX: -circle.width * 0.1 }],
	},
	rightSemicircle: {
		...circle,
		transform: [{ translateX: circle.width * 0.1 }],
	},
	innerCircle: {
		position: 'absolute',
		width: innerSize,
		height: innerSize,
		borderWidth: theme.normalize(1),
		borderColor,
		borderRadius: theme.normalize(innerSize),
	},
	middle: {
		...selected,
		left: 0,
		right: 0,
	},
	left: {
		...selected,
		left: -1,
		width: '64%',
	},
	right: {
		...selected,
		right: -1,
		width: '64%',
	},
	active: {
		color: theme.colors.blue,
	},
	unavailable: {
		textDecorationLine: 'line-through',
		color: theme.colors.red,
	},
});
