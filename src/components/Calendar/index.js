import CalendarDay from './CalendarDay';
import CalendarHeader from './CalendarHeader';
import { forEachDayOfPeriod } from 'functions';
import { isSameDay, isAfter, addDays } from 'date-fns';
import { formatInTimeZone } from 'date-fns-tz';
import { Calendar as WixCalendar } from 'react-native-calendars';
import React, { useRef, useState, useCallback, useEffect } from 'react';

import theme from 'theme';

const defaultArr = [];
const formatMark = (date, timeZone) => formatInTimeZone(date, timeZone, 'yyyy-MM-dd');

export const calendarTheme = {
	'stylesheet.calendar.main': {
		container: null,
		week: {
			flexDirection: 'row',
			justifyContent: 'space-around',
			marginVertical: theme.spacing(0.5),
		},
	},
};

const generateMarkedDates = (
	unavailableMarks,
	isAvailible,
	start,
	end,
	initial,
	timeZone
) => {

	start = isAvailible(start) && start;
	end = isAvailible(end) && end;

	if (initial) {

		if (!(start && end)) {
			return unavailableMarks;
		}

		if (isAfter(start, end)) {

			const tmp = start;

			start = end;
			end = tmp;
		}
	}

	if (start && end) {

		if (isSameDay(start, end)) {

			return {
				...unavailableMarks,
				[formatMark(start, timeZone)]: {
					selected: true,
					startingDay: true,
					endingDay: true,
					both: true,
				},
			};

		} else {

			const markedDates = {
				...unavailableMarks,
				[formatMark(start, timeZone)]: { selected: true, startingDay: true },
				[formatMark(end, timeZone)]: { selected: true, endingDay: true },
			};

			let middle = addDays(start, 1);

			while (!isSameDay(end, middle)) {
				markedDates[formatMark(middle, timeZone)] = { selected: true };
				middle = addDays(middle, 1);
			}

			return markedDates;
		}

	} else if (start) {

		return {
			...unavailableMarks,
			[formatMark(start, timeZone)]: {
				selected: true,
				startingDay: true,
				endingDay: true,
			},
		};
	}

	console.error('generateMarkedDates mismatch');
};

const getUnavalibleMarksFromPeriods = (periods, timeZone) => {

	return periods.reduce((res, { startDate, endDate }) => {

		forEachDayOfPeriod(startDate, endDate, day => {
			res[formatMark(day, timeZone)] = { unavailable: true };
		});

		return res;
	}, {});
};

const Calendar = ({
	date: initialDate = new Date(),
	start: initialStart = null,
	end: initialEnd = null,
	timeZone,
	unavailablePeriods = defaultArr,
	onChange,
	...rest
}) => {

	const calendarRef = useRef();

	const [date, setDate] = useState(initialDate);
	const [start, setStart] = useState(initialStart);
	const [end, setEnd] = useState(initialEnd);

	const [unavailableMarks] = useState(() =>
		getUnavalibleMarksFromPeriods(unavailablePeriods, timeZone)
	);

	const [isAvailible] = useState(
		() => date => !!date && !unavailableMarks[formatMark(date, timeZone)]
	);

	const [markedDates, setMarkedDates] = useState(() =>
		generateMarkedDates(unavailableMarks, isAvailible, start, end, true, timeZone)
	);

	const onDayPress = useCallback(

		({ timestamp }) => {

			const date = new Date(timestamp);

			if (!isAvailible(date)) {
				return;
			}

			if (!start) {

				setStart(date);
				
				setMarkedDates(
					generateMarkedDates(unavailableMarks, isAvailible, date)
				);

			} else {

				if (end) {

					setStart(date);
					setEnd(null);

					setMarkedDates(
						generateMarkedDates(
							unavailableMarks,
							isAvailible,
							date
						)
					);

				} else {

					const invert = isAfter(start, date);
					const first = invert ? date : start;
					const second = invert ? start : date;

					const containsUnavalibleDates = !!forEachDayOfPeriod(
						first,
						second,
						date => !isAvailible(date) || undefined
					);

					if (containsUnavalibleDates) {

						setStart(date);
						
						setMarkedDates(
							generateMarkedDates(
								unavailableMarks,
								isAvailible,
								date
							)
						);

						return;
					}

					if (invert) {
						setStart(first);
					}

					setEnd(second);

					setMarkedDates(
						generateMarkedDates(
							unavailableMarks,
							isAvailible,
							first,
							second
						)
					);
				}
			}
		},
		[start, end, unavailableMarks, isAvailible]
	);

	useEffect(() => {
		onChange && onChange(start, end);
	}, [start, end, onChange]);

	useEffect(
		// Only init.
		() => {
			if (!(isAvailible(initialStart) && isAvailible(initialEnd))) {

				setStart(null);
				setEnd(null);

				return;
			}

			const invert = isAfter(initialStart, initialEnd);

			setStart(invert ? initialEnd : initialStart);
			setEnd(invert ? initialStart : initialEnd);
		},
		[]
	);

	return (
		<WixCalendar
			ref={calendarRef}
			enableSwipeMonths
			current={date}
			firstDay={1}
			onDayPress={setDate}
			markingType="period"
			customHeader={CalendarHeader}
			dayComponent={(props) => <CalendarDay onPressDay={(date) => onDayPress(date)} {...props}  />}
			theme={calendarTheme}
			{...{ markedDates, onDayPress }}
			{...rest}
		/>
	);
};

export default React.memo(Calendar);
