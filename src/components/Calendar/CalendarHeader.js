import Icon from '../Icon';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';
import React, { useCallback, useEffect } from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';

import theme from 'theme';

const size = theme.normalize(17);

const WeekDays = React.memo(function WeekDays() {
	
	return (
		<View style={styles.weekDays}>
			{['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'].map(day => (
				<Text key={day} style={styles.weekDay}>
					{day}
				</Text>
			))}
		</View>
	);
});

const CalendarHeader = (
	{
		month,
		hideArrows,
		hideDayNames,
		disableArrowLeft,
		disableArrowRight,
		addMonth,
		onPressArrowLeft,
		onPressArrowRight,
	},
	ref
) => {
	
	const onPressLeft = useCallback(() => {

		if (typeof onPressArrowLeft === 'function') {
			return onPressArrowLeft(addMonth(-1), month);
		}

		return addMonth(-1);

	}, [month, onPressArrowLeft, addMonth]);

	const onPressRight = useCallback(() => {

		if (typeof onPressArrowRight === 'function') {
			return onPressArrowRight(addMonth(1), month);
		}

		return addMonth(1);
		
	}, [month, onPressArrowRight, addMonth]);

	useEffect(() => {
		ref({
			onPressLeft,
			onPressRight,
		});
	}, [ref, onPressLeft, onPressRight]);

	return (
		<View>
			<View style={[
				styles.header,
				hideArrows && { 
					justifyContent: 'center',
					height: theme.normalize(36),
					paddingTop: 15,
				}
			]}>
				{
					!hideArrows
					&&
						<TouchableOpacity
							style={disableArrowLeft && styles.disabled}
							hitSlop={theme.hitSlop}
							disabled={disableArrowLeft}
							onPress={onPressLeft}
						>
							<Icon
								name="chevron-left"
								color={theme.colors.blue}
								{...{ size }}
							/>
						</TouchableOpacity>
				}
				<Text style={[styles.title, hideArrows && styles.lightTitle]}>
					{format(new Date(month), 'LLLL yyyy', { locale: ru })}
				</Text>
				{
					!hideArrows
					&&
						<TouchableOpacity
							style={disableArrowRight && styles.disabled}
							hitSlop={theme.hitSlop}
							disabled={disableArrowRight}
							onPress={onPressRight}
						>
							<Icon
								name="chevron-right"
								color={theme.colors.blue}
								{...{ size }}
							/>
						</TouchableOpacity>
				}
			</View>
			{
				!hideDayNames
				&&
					<WeekDays />
			}
		</View>
	);
};

export default React.forwardRef(CalendarHeader);

const styles = StyleSheet.create({
	header: {
		height: theme.normalize(56),
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		paddingHorizontal: theme.spacing(1),
	},
	title: {
		...theme.styles.src.P1,
		textTransform: 'capitalize',
	},
	lightTitle: {
		fontFamily: 'Inter',
		fontSize: 14,
		lineHeight: 20,
		color: '#878F9B',
		textTransform: 'uppercase',
	},
	weekDays: {
		flexDirection: 'row',
	},
	weekDay: {
		...theme.styles.src.XS,
		textAlign: 'center',
		flex: 1,
		color: theme.colors.lightCyan,
		paddingVertical: theme.spacing(1),
	},
	disabled: {
		opacity: 0,
	}
});
