import {
	set,
	isToday,
	isSameDay,
	getMinutes,
	getHours,
	isAfter,
} from 'date-fns';
import { utcToZonedTime, zonedTimeToUtc } from 'date-fns-tz';
import { View, StyleSheet, Alert } from 'react-native';
import React, { useRef, useState, useCallback, useEffect } from 'react';

import {
	Slider,
	Header,
	Calendar,
	PrimaryButton,
	SafeAreaSpacingView,
	ScrollViewChangeContent,
} from 'components';
import api from 'api';
import { useScrollPreventor } from 'hooks';
import { getDaysDeclention, getDaysBetweenDates } from 'functions';

import theme from 'theme';

const getMinDate = () => {

	const now = new Date();
	const date = new Date(+now);

	date.setHours(22, 30);

	if (isAfter(now, date)) {

		date.setHours(0, 0, 0, 0, 0);
		date.setDate(now.getDate() + 1);

		return date;
	};

	return now;
};


const DatePicker = ({
	route: {
		params: {
			callback,
			start: initialStart = null,
			end: initialEnd = null,
			timeZone,
			unavailablePeriods,
			minRentDays,
			maxRentDays,
		} = {},
	},
}) => {
	const dateToSliderValue = (date) => {
		const zonedDate = utcToZonedTime(date, timeZone);
		const hours = getHours(zonedDate)
		const minutes = getMinutes(zonedDate)
		return (hours * 60 + minutes) / 30
	};


	const getResDate = (date, slider) =>
		zonedTimeToUtc(set(date, {
			hours: Math.floor(slider / 2),
			minutes: slider % 2 ? 30 : 0,
		}), timeZone);

	const scrollViewRef = useRef();

	const [isValid, setIsValid] = useState(true);
	const [dateTo, setDateTo] = useState(initialEnd);
	const [dateFrom, setDateFrom] = useState(initialStart);
	const [disabledEndMin, setDisabledEndMin] = useState();

	const [start, setStart] = useState(() => dateToSliderValue(initialStart));
	const [end, setEnd] = useState(() => dateToSliderValue(initialEnd));

	const [disabledStartMin, setDisabledStartMin] = useState();
	const [disabledStartMax, setDisabledStartMax] = useState();
	
	const { onStart, onEnd } = useScrollPreventor(scrollViewRef);

	const onChange = useCallback((start, end) => {

		setDateFrom(start);
		setDateTo(end);

		if (start && end && minRentDays && maxRentDays) {

			const numberOfMinRentDays = Number(minRentDays.match(/\d+/)[0]);
			const numberOfMaxRentDays = maxRentDays === 'infinity' ? maxRentDays : Number(maxRentDays.match(/\d+/)[0]);

			const daysInterval = getDaysBetweenDates(start, end);

			if (numberOfMinRentDays > daysInterval) {

				setIsValid(false);

				Alert.alert(
					'', 
					`Минимальное количество дней аренды для этой машины: ${numberOfMinRentDays} ${getDaysDeclention(numberOfMinRentDays)}`
				)

			} else if (daysInterval > numberOfMaxRentDays) {

				setIsValid(false);

				Alert.alert(
					'', 
					`Максимальное количество дней аренды для этой машины: ${numberOfMaxRentDays} ${getDaysDeclention(numberOfMaxRentDays)}`
				)

			} else {
				setIsValid(true)
			};
		}
	}, []);

	useEffect(() => {

		if (dateFrom && dateTo && !isAfter(new Date(), getResDate(dateFrom, start))) {
			setIsValid(true)
		};

	}, [dateFrom, dateTo, start])
	
	const onAccept = useCallback(() => {

		if (!(dateFrom && dateTo)) {
			
			Alert.alert(
				'', 
				`Выберите дату завершения аренды`
			);

		} else if (isAfter(new Date(), getResDate(dateFrom, start))) {

			setIsValid(false);

			Alert.alert(
				'', 
				`Время истекло, пожалуйста, выберите более позднее время начала аренды`
			);
			
		} else {

			setIsValid(true);

			api.navigation.goBack();

			if (callback) {
				callback(getResDate(dateFrom, start), getResDate(dateTo, end));
			};
		}

	}, [dateFrom, dateTo, start, end, callback]);

	useEffect(() => {

		const sameDay = isSameDay(dateFrom, dateTo);

		setDisabledEndMin(!sameDay ? undefined : start + 2 || undefined);

	}, [dateFrom, dateTo, start]);

	useEffect(() => {
		const today = isToday(dateFrom);
		const sameDay = isSameDay(dateFrom, dateTo);

		function getStartDate() {
			const now = new Date();
			const isNowMoreThanThirtyMins = getMinutes(now) > 30;

			return set(now, { minutes: isNowMoreThanThirtyMins ? 0 : 30 });
		}

		setDisabledStartMin(!today ? 0 : dateToSliderValue(getStartDate()));
		setDisabledStartMax(sameDay ? 45 : undefined);

	}, [dateFrom, dateTo]);

	const calcLabelValue = (value) => {
		switch (value) {
			case 0:
				return '0:00';
			case 1:
				return '0:30';
			case 2:
				return '1:00';
			case 3:
				return '1:30';
			case 4:
				return '2:00';
			case 5:
				return '2:30';
			case 6:
				return '3:00';
			case 7:
				return '3:30';
			case 8:
				return '4:00';
			case 9:
				return '4:30';
			case 10:
				return '5:00';
			case 11:
				return '5:30';
			case 12:
				return '6:00';
			case 13:
				return '6:30';
			case 14:
				return '7:00';
			case 15:
				return '7:30';
			case 16:
				return '8:00';
			case 17:
				return '8:30';
			case 18:
				return '9:00';
			case 19:
				return '9:30';
			case 20:
				return '10:00';
			case 21:
				return '10:30';
			case 22:
				return '11:00';
			case 23:
				return '11:30';
			case 24:
				return '12:00';
			case 25:
				return '12:30';
			case 26:
				return '13:00';
			case 27:
				return '13:30';
			case 28:
				return '14:00';
			case 29:
				return '14:30';
			case 30:
				return '15:00';
			case 31:
				return '15:30';
			case 32:
				return '16:00';
			case 33:
				return '16:30';
			case 34:
				return '17:00';
			case 35:
				return '17:30';
			case 36:
				return '18:00';
			case 37:
				return '18:30';
			case 38:
				return '19:00';
			case 39:
				return '19:30';
			case 40:
				return '20:00';
			case 41:
				return '20:30';
			case 42:
				return '21:00';
			case 43:
				return '21:30';
			case 44:
				return '22:00';
			case 45:
				return '22:30';
			case 46:
				return '23:00';
			case 47:
				return '23:30';
			default:
				return ''
		}
	}
	
	return (
		<ScrollViewChangeContent
			style={theme.styles.container}
			contentContainerStyle={theme.styles.grow}
			{...{ scrollViewRef }}
		>
			<SafeAreaSpacingView style={styles.container}>
				<View style={theme.styles.container}>
					<Header
						title={
							'Выберите дату, время начала и\nзавершения аренды'
						}
						onPressBack={onAccept}
						backBtnDisabled={!(dateFrom && dateTo) || !isValid}
					/>
					<View style={styles.content}>
						<Calendar
							start={initialStart}
							end={initialEnd}
							timeZone={timeZone}
							minDate={getMinDate()}
							{...{ unavailablePeriods, onChange }}
						/>
						<Slider
							invertSelection
							title="Время начала аренды"
							min={0}
							max={47}
							value={start}
							disabledMin={disabledStartMin}
							disabledMax={disabledStartMax}
							onChange={setStart}
							{...{ calcLabelValue, onStart, onEnd }}
						/>
						<Slider
							title="Время завершения аренды"
							min={0}
							max={47}
							value={end}
							disabledMin={disabledEndMin}
							onChange={setEnd}
							{...{ calcLabelValue, onStart, onEnd }}
						/>
						<View style={theme.styles.container} />
						<PrimaryButton
							style={styles.button}
							title="Выбрать"
							disabled={!(dateFrom && dateTo) || !isValid}
							onPress={onAccept}
						/>
					</View>
				</View>
			</SafeAreaSpacingView>
		</ScrollViewChangeContent>
	);
};

export default DatePicker

const styles = StyleSheet.create({
	container: {
		...theme.styles.container,
		marginTop: 0,
		marginBottom: theme.spacing(6),
	},
	content: {
		...theme.styles.container,
		paddingHorizontal: theme.spacing(6),
	},
	button: {
		marginTop: theme.spacing(6),
	},
});
