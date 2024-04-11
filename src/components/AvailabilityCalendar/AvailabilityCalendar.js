import { View, Dimensions, Text } from 'react-native';
import { Modalize } from 'react-native-modalize';
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import { Calendar, CalendarList } from 'react-native-calendars';

import api from 'api';
import actions from 'actions';
import StarIcon from 'img/rent-out/no-car/star.svg';
import CalendarDay from 'components/Calendar/CalendarDay';
import InfoIcon from 'img/availability-calendar/info.svg';
import Avatar from '../Avatar';
import TouchableScale from '../TouchableScale'
import CalendarHeader from 'components/Calendar/CalendarHeader';

import s from './styles';
import theme from 'theme';

const HEIGHT = Dimensions.get('window').height;

const AvailabilityCalendar = ({ 
    carId,
    style,
    vertical = false,
    unavailabilityDates, 
    initiallyBlockedDates,
    onUpdateBlockedDates = () => {},
}) => {

    const dispatch = useDispatch();

    const [blockedDates, setBlockedDates] = useState(initiallyBlockedDates);

    const { trips } = useSelector(st => st.trips, shallowEqual);
    const { car = {}, rent = {}, guest = {} } = useSelector(st => st.rentRoom, shallowEqual);
    const [guestData, setGuestData] = useState({});

    const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());

    const [pastDays, setPastDays] = useState();
    const [inRentDays, setInRentDays] = useState();
    const [bookedDays, setBookedDays] = useState();
    const [blockedDays, setBlockedDays] = useState();

	const modalizeRef = React.useRef(null);

	const onOpenModal = () => {
		modalizeRef.current?.open();
	};
  
	const onCloseModal = () => {
		modalizeRef.current?.close();
	};

    const getDatesInRange = (duration) => {

        if (Object.keys(duration) !== 0) {
            
            const dates = [];
    
            const startDate = new Date(duration.startDate);
            const endDate = new Date(duration.endDate);
            const currentDate = startDate;

            while (currentDate < endDate) {
                dates.push(currentDate.toISOString().slice(0, 10));
                currentDate.setDate(currentDate.getDate() + 1);
            };

            dates.push(endDate.toISOString().slice(0, 10))
            
            return dates;
        }
    };

    const setCalendarDatesFromDuration = (durations, options) => {
 
        if (!Array.isArray(durations) || durations.length === 0) {
            
            return []
            
        } else {

            const dates = {};

            durations.forEach((blockedDuration) => {
    
                let startDate = blockedDuration.startDate;
    
                // check if day is in the past
                if (new Date(startDate) < new Date() && !options.isPastDays) {
                    
                    const updatedDate = new Date();
                    const originalDate = new Date(startDate);
    
                    updatedDate.setUTCHours(originalDate.getUTCHours());
                    updatedDate.setUTCMinutes(originalDate.getUTCMinutes());
                    updatedDate.setUTCSeconds(originalDate.getUTCSeconds());
                    updatedDate.setUTCMilliseconds(originalDate.getUTCMilliseconds());
    
                    startDate = updatedDate.toISOString();
                };
    
                const datesInRange = getDatesInRange(
                    {
                        startDate: startDate,
                        endDate: blockedDuration.endDate,
                    }
                );
                
                return (
                    datesInRange.forEach((date) => {
                        
                        dates[date] = {
                            ...options,
                            startDate: datesInRange[0],
                            endDate: datesInRange[datesInRange.length - 1],
                        };
                    })
                )
            });
    
            return dates
        }
    };

    useEffect(() => {
    
        setBlockedDates(initiallyBlockedDates);
    
            setBlockedDays(
                setCalendarDatesFromDuration(
                    initiallyBlockedDates, 
                    { 
                        marked: true, 
                        selectedColor: theme.colors.red,
                        isBlockedDays: true,
                     },
                )
            );
    }, [initiallyBlockedDates]);

    useEffect(() => {

        const getFirstDayOfPreviousMonthInISO = () => {

            const currentDate = new Date();

            currentDate.setMonth(currentDate.getMonth() - 1);
            currentDate.setDate(1);
          
            const isoDate = currentDate.toISOString().split('T')[0];
          
            return isoDate;
        };

        const getLastDayOfPreviousMonthInISO = () => {

            const currentDate = new Date();
            currentDate.setDate(0);
          
            const isoDate = currentDate.toISOString().split('T')[0];
          
            return isoDate;
        };

        const getFirstDayOfCurrentMonthInISO = () => {

            const currentDate = new Date();

            currentDate.setMonth(currentDate.getMonth());
            currentDate.setDate(1);
          
            const isoDate = currentDate.toISOString().split('T')[0];
          
            return isoDate;
        };

        const getPreviousDayInISO = () => {

            const currentDate = new Date();
            currentDate.setDate(currentDate.getDate() - 1);
          
            const isoDate = currentDate.toISOString().split('T')[0];
          
            return isoDate;
        };
        
        setPastDays({
            ...setCalendarDatesFromDuration(
                [{
                    startDate: getFirstDayOfCurrentMonthInISO(),
                    endDate: getPreviousDayInISO(),
                }],
                {
                    marked: false, 
                    disableTouchEvent: true, 
                    selectedColor: '#2222221A',
                    isPastDays: true,
                }
            ),
            ...setCalendarDatesFromDuration(
                [{
                    startDate: getFirstDayOfPreviousMonthInISO(),
                    endDate: getLastDayOfPreviousMonthInISO(),
                }],
                {
                    marked: false, 
                    disableTouchEvent: true, 
                    selectedColor: '#2222224A',
                    isPastDays: true,
                }
            ),
        });

    }, []);

    useEffect(() => {
        
        if (Object.keys(unavailabilityDates).length !== 0) {

            setInRentDays(
                setCalendarDatesFromDuration(
                    unavailabilityDates.rent,
                    { 
                        marked: true, 
                        disableTouchEvent: !vertical, 
                        selectedColor: theme.colors.green,
                        isInRentDays: true,
                    },
                )
            );
    
            setBookedDays(
                setCalendarDatesFromDuration(
                    unavailabilityDates.booked, 
                    { 
                        marked: true, 
                        disableTouchEvent: !vertical, 
                        selectedColor: theme.colors.darkYellow,
                        isBookedDays: true,
                    },
                )
            );
        };

    }, [unavailabilityDates, carId]);

    useEffect(() => {

        setBlockedDays(
            setCalendarDatesFromDuration(
                blockedDates, 
                { 
                    marked: true, 
                    selectedColor: theme.colors.red,
                    isBlockedDays: true,
                 },
            )
        );

        onUpdateBlockedDates(blockedDates);
        
    }, [blockedDates]);

    useEffect(() => {
        !!car && !!rent && !!guest && setGuestData({ car, rent, guest })
    }, [car, rent, guest]);

    const getRentDateRangeForModal = (date1Str, date2Str) => {

        const date1 = new Date(date1Str);
        const date2 = new Date(date2Str);

        const options = {
            day: "numeric",
            month: "long",
            hour: "numeric",
            minute: "numeric",
        };

        const formatter = new Intl.DateTimeFormat("ru-RU", options);

        const formattedOutput = `${formatter.format(date1)} — ${formatter.format(date2)}`;

        return formattedOutput
    };
    
    const isDayInDuration = (day, duration) => {
        
        const inputDate = newDateWithoutGMT(day);
        const startDate = newDateWithoutGMT(duration.startDate);
        const endDate = newDateWithoutGMT(duration.endDate);
        
        return inputDate.getTime() >= startDate.getTime() && inputDate.getTime() <= endDate.getTime();
    };

    const isSameDay = (date1, date2) => {

        return (
          date1.getFullYear() === date2.getFullYear() &&
          date1.getMonth() === date2.getMonth() &&
          date1.getDate() === date2.getDate()
        );
    };

    const newDateWithoutGMT = (isoDate) => new Date(isoDate.slice(0, -5));
    const isoDateWithoutGMT = (date) => new Date(date.getTime() - (date.getTimezoneOffset() * 60000)).toISOString();
    
    const resetDuration = (date, blockedDuration) => {

        const selectedDate = newDateWithoutGMT(date);
        const startDateBlocked = newDateWithoutGMT(blockedDuration.startDate);
        const endDateBlocked = newDateWithoutGMT(blockedDuration.endDate);
        
        // if duration is only one day
        if (isSameDay(startDateBlocked, endDateBlocked)) {

            const changedBlockedDurations = blockedDates.filter((duration) => 
                duration.startDate !== blockedDuration.startDate &&
                duration.endDate !== blockedDuration.endDate
            );

            setBlockedDates(changedBlockedDurations);

        } else if (isSameDay(selectedDate, startDateBlocked)) {

            const changedBlockedDurations = blockedDates.map((duration) => {

                if (isSameDay(startDateBlocked, newDateWithoutGMT(duration.startDate))) {

                    const nextStartDay = newDateWithoutGMT(duration.startDate);
                    nextStartDay.setDate(nextStartDay.getDate() + 1);

                    return {
                        startDate: isoDateWithoutGMT(nextStartDay),
                        endDate: duration.endDate,
                    };

                } else {
                    return duration;
                };
            });

            setBlockedDates(changedBlockedDurations);

        } else if (isSameDay(selectedDate, endDateBlocked)) {

            const changedBlockedDurations = blockedDates.map((duration) => {

                if (isSameDay(endDateBlocked, newDateWithoutGMT(duration.endDate))) {

                    const prevEndDay = newDateWithoutGMT(duration.endDate);
                    prevEndDay.setDate(prevEndDay.getDate() - 1);
                    
                    return {
                        startDate: duration.startDate,
                        endDate: isoDateWithoutGMT(prevEndDay),
                    };

                } else {
                    return duration;
                };
            });

            setBlockedDates(changedBlockedDurations);

        } else {
            
            let newDuration = {
                startDate: '',
                endDate: '',
            };
            
            const changedBlockedDurations = blockedDates.map((duration) => {

                if (isDayInDuration(date, duration)) {

                    let nextStartDay = newDateWithoutGMT(date);

                    nextStartDay.setDate(nextStartDay.getDate() + 1);
                    nextStartDay = isoDateWithoutGMT(new Date(nextStartDay));

                    let prevEndDay = newDateWithoutGMT(date);

                    prevEndDay.setSeconds(prevEndDay.getSeconds() - 1);
                    prevEndDay = isoDateWithoutGMT(new Date(prevEndDay));

                    newDuration.startDate = nextStartDay;
                    newDuration.endDate = duration.endDate;

                    return {
                        startDate: duration.startDate,
                        endDate: prevEndDay,
                    };
                    
                } else {
                    return duration;
                }
            });

            if (newDuration.startDate && newDuration.endDate) {
                changedBlockedDurations.push(newDuration);
            };

            setBlockedDates(changedBlockedDurations);
        }
    };

    const addDuration = (selectedDate) => {

        const findedStartNextToSelectedDate = blockedDates.find((duration) => {

            const startDate = newDateWithoutGMT(duration.startDate);
            const selected = newDateWithoutGMT(selectedDate);
        
            return (
                startDate.getFullYear() === selected.getFullYear() &&
                startDate.getMonth() === selected.getMonth() &&
                startDate.getDate() === selected.getDate() + 1
            )
        });

        const findedEndNextToSelectedDate = blockedDates.find((duration) => {

            const endDate = newDateWithoutGMT(duration.endDate);
            const selected = newDateWithoutGMT(selectedDate);

            return (
                endDate.getFullYear() === selected.getFullYear() &&
                endDate.getMonth() === selected.getMonth() &&
                endDate.getDate() === selected.getDate() - 1
            )
        });
        
        const isNextToExistingStart = !!findedStartNextToSelectedDate;
        const isNextToExistingEnd = !!findedEndNextToSelectedDate;

        if (isNextToExistingEnd && isNextToExistingStart) {
            
            const startDateBlocked = newDateWithoutGMT(findedEndNextToSelectedDate.startDate);
            const endDateBlocked = newDateWithoutGMT(findedStartNextToSelectedDate.endDate);

            let changedBlockedDurations = blockedDates.filter((duration) => {
                return !isSameDay(startDateBlocked, newDateWithoutGMT(duration.startDate));
            });

            changedBlockedDurations = changedBlockedDurations.map((duration) => {

                if (isSameDay(endDateBlocked, newDateWithoutGMT(duration.endDate))) {

                    return {
                        startDate: findedEndNextToSelectedDate.startDate,
                        endDate: duration.endDate,
                    };

                } else {
                    return duration;
                };
            });

            setBlockedDates(changedBlockedDurations);

        } else if (isNextToExistingStart) {

            const startDateBlocked = newDateWithoutGMT(findedStartNextToSelectedDate.startDate);

            const changedBlockedDurations = blockedDates.map((duration) => {

                if (isSameDay(startDateBlocked, newDateWithoutGMT(duration.startDate))) {

                    const prevStartDay = newDateWithoutGMT(duration.startDate);
                    prevStartDay.setDate(prevStartDay.getDate() - 1);

                    return {
                        startDate: isoDateWithoutGMT(prevStartDay),
                        endDate: duration.endDate,
                    };

                } else {
                    return duration;
                };
            });

            setBlockedDates(changedBlockedDurations);

        } else if (isNextToExistingEnd) {

            const endDateBlocked = newDateWithoutGMT(findedEndNextToSelectedDate.endDate);

            const changedBlockedDurations = blockedDates.map((duration) => {

                if (isSameDay(endDateBlocked, newDateWithoutGMT(duration.endDate))) {

                    const nextEndDay = newDateWithoutGMT(duration.endDate);
                    nextEndDay.setDate(nextEndDay.getDate() + 1);

                    return {
                        startDate: duration.startDate,
                        endDate: isoDateWithoutGMT(nextEndDay),
                    };

                } else {
                    return duration;
                };
            });

            setBlockedDates(changedBlockedDurations);

        } else {

            let changedBlockedDurations = [ ...blockedDates ];

            const isoDate = newDateWithoutGMT(selectedDate);

            isoDate.setDate(isoDate.getDate() + 1);
            isoDate.setSeconds(isoDate.getSeconds() - 1);

            const endIsoDate = isoDateWithoutGMT(isoDate);

            const newRange = {
                startDate: selectedDate,
                endDate: endIsoDate,
            };

            changedBlockedDurations.push(newRange);

            setBlockedDates(changedBlockedDurations);
        };
    };
    
    const handlePressDay = (date, startDate, endDate, isInRentDays, isBookedDays) => {

        if (isInRentDays) {

            if (vertical) {

                const trip = trips.find((trip) => (
                    checkIfSameDates(trip.rent.startDate, trip.rent.endDate, startDate, endDate)
                ));
    
                if (trip?.rent.id) {
                    dispatch(actions.rentRoomRequest(trip.rent.id, 'HOST'));
                };

                onOpenModal();
            };
            
        } else if (isBookedDays) {

            if (vertical) {

                const trip = trips.find((trip) => (
                    checkIfSameDates(trip.rent.startDate, trip.rent.endDate, startDate, endDate)
                ));
    
                if (trip?.rent.id) {
                    dispatch(actions.rentRoomRequest(trip.rent.id, 'HOST'));
                }; 

                onOpenModal();
            };

        } else {

            const dateString = newDateWithoutGMT(new Date(date.dateString).toISOString());
            const isoDateString = isoDateWithoutGMT(dateString);
    
            setSelectedMonth(dateString.getMonth());
    
            const blockedDuration = blockedDates.find((duration) => isDayInDuration(isoDateString, duration));
            const isDayInBlockedDuration = blockedDuration && Object.keys(blockedDuration) !== 0;
    
            if (isDayInBlockedDuration) {
                resetDuration(isoDateString, blockedDuration);
            } else {
                addDuration(isoDateString)
            };
        };
    };

    const Wrapper = React.useCallback((props) => (

        props.vertical 
        ? 
            <CalendarList 
                hideArrows
                hideDayNames
                pastScrollRange={0}
                {...props} 
            /> 
        : 
            <Calendar {...props} />
            
    ), []);

    const checkIfSameDates = (start, end, start2, end2) => {

        const startDate = new Date(start);
        const endDate = new Date(end);
        const start2Date = new Date(start2);
        const end2Date = new Date(end2);
        
        return (

            startDate.getFullYear() === start2Date.getFullYear() &&
            startDate.getMonth() === start2Date.getMonth() &&
            startDate.getDate() <= start2Date.getDate() &&

            endDate.getFullYear() === end2Date.getFullYear() &&
            endDate.getMonth() === end2Date.getMonth() &&
            endDate.getDate() <= end2Date.getDate()
        );
    };
    
    return (
        <>
            <View style={style}>
                <Wrapper
                    firstDay={1}
                    vertical={vertical}
                    dayComponent={(props) => (
                        <CalendarDay 
                            vertical={vertical} 
                            onPressDay={(date, startDate, endDate, isInRentDays, isBookedDays) => handlePressDay(date, startDate, endDate, isInRentDays, isBookedDays)}
                            {...props} 
                        />
                    )}
                    customHeader={CalendarHeader}
                    markedDates={{
                        ...inRentDays,
                        ...bookedDays,
                        ...blockedDays,
                        ...pastDays,
                    }}
                    onPressArrowLeft={() => setSelectedMonth(selectedMonth - 1)}
                    onPressArrowRight={() => setSelectedMonth(selectedMonth + 1)}
                    disableArrowLeft={selectedMonth === new Date().getMonth()}
                />
            </View>
            <Modalize
				ref={modalizeRef}
				snapPoint={HEIGHT / 6}
				modalHeight={HEIGHT / 6}
                // overlayStyle={{ backgroundColor: 'transparent' }}
			>
				<View style={s.modal}>
                    {
                        !!guestData?.rent?.id
                        &&
                            <TouchableScale 
                                style={s.guest}
                                onPress={() => {

                                    onCloseModal();

                                    api.navigation.navigate('RentRoom', { 
                                        uuid: guestData.rent.id,
                                        onPressBack: () => api.navigation.goBack() 
                                    });
                                }}
                            >
                                <View style={[s.row, { alignItems: 'flex-start' }]}>
                                    <Avatar
                                        style={s.guest.avatar}
                                        avatar={guestData.guest.avatar}
                                        diameter={40}
                                        name={`${guestData.guest.firstName} ${guestData.guest.lastName}`} 
                                    />
                                    <View>
                                        <View style={s.row}>
                                            <Text style={s.guest.name}>
                                                {`${guestData.guest.firstName} ${guestData.guest.lastName && /\S/.test(guestData.guest.lastName) ? (guestData.guest.lastName[0] + '.') : ''}`}
                                            </Text>
                                            <View style={[
                                                s.guest.rating,
                                            ]}>
                                                <Text style={s.guest.rating.number}>
                                                    {guestData.guest.rating}
                                                </Text>
                                                <StarIcon width={9} height={8} />
                                            </View>
                                        </View>
                                        <Text style={s.guest.info}>
                                            В аренде {guestData.car.brand} {guestData.car.model} {guestData.car.registrationNumber}
                                        </Text>
                                        <Text style={s.guest.date}>
                                            {getRentDateRangeForModal(guestData.rent.startDate, guestData.rent.endDate)}
                                        </Text>
                                    </View>
                                </View>
                            </TouchableScale>
                    }
				</View>
			</Modalize>
        </>
    )
};

export default AvailabilityCalendar;
