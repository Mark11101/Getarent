import React, { memo, useEffect, useRef, useState } from "react";
import { Dimensions, StyleSheet, Text, View } from "react-native";
import { Modalize } from "react-native-modalize";
import { shallowEqual, useSelector } from "react-redux";
import { addDays, format, getHours, getMinutes, isWithinInterval, subDays } from "date-fns";
import theme from "theme";
import PrimaryButton from "../../../PrimaryButton";
import ScrollViewChangeContent from "../../../ScrollViewChangeContent";
import Slider from "../../../Slider";
import Waiter from "../../../Waiter";
import { useScrollPreventor } from "../../../../hooks";
import { Calendar as WixCalendar } from "react-native-calendars";
import CalendarHeader from "../../../Calendar/CalendarHeader";
import CalendarDay from "../../../Calendar/CalendarDay";
import { calendarTheme } from "../../../Calendar";
import { forEachDayOfPeriod } from "functions";

const dateToSliderValue = (date) =>
  getHours(date) * 2 + Math.floor(getMinutes(date) / 30);
const formatMark = date => format(date, "yyyy-MM-dd");

const getUnavailableMarksFromPeriods = (periods) => {
  return periods.reduce((res, { startDate, endDate }) => {
    forEachDayOfPeriod(startDate, endDate, day => {
      res[formatMark(day)] = { unavailable: true };
    });

    return res;
  }, {});
};

const calcLabelValue = (value) =>
  `${(value - (value % 2)) / 2}:${value % 2 ? "30" : "00"}`;

const parseTimeOfSliderValue = (slider) => ({
  hours: Math.floor(slider / 2),
  minutes: slider % 2 ? 30 : 0,
});

const HEIGHT = Dimensions.get("window").height;

export const getMaxAvailableProlongationDate = (payload) => {
  const { endDate: _endDate, unavailableProlongationDates } = payload
  if (!_endDate || !unavailableProlongationDates) {
    return null;
  }

  const endDate = new Date(_endDate);
  const unlimitedDate = addDays(endDate, 500);

  if (!unavailableProlongationDates.length) {
    return unlimitedDate;
  }

  let foundMaxAvailableDates =
      [...unavailableProlongationDates]
          .filter(interval => endDate < new Date(interval.startDate))
          .sort((intervalA, intervalB) => intervalA.startDate - intervalB.startDate ? -1 : 1)
          .shift();

  if (foundMaxAvailableDates) {
    return subDays(new Date(foundMaxAvailableDates.startDate), 1);
  }

  return unlimitedDate;
};

const ProlongDatePickerModal = ({
                                  prolongationDateCreate,
                                  onDateChange,
                                  modalizeRef,
                                  unavailableProlongationDates,
                                  onContinue,
                                }) => {
  const {
    rent: {
      startDate,
      endDate,
    } = {},
    car,
  } = useSelector(st => st.rentRoom, shallowEqual);

  const scrollViewRef = useRef();
  const { onStart, onEnd } = useScrollPreventor(scrollViewRef);
  const [time, setTime] = useState(null);
  const $time = useRef(null);
  const $currentDate = useRef(prolongationDateCreate);

  useEffect(() => {
    $currentDate.current = prolongationDateCreate;
  }, [prolongationDateCreate]);

  useEffect(() => {
    if (endDate && !time) {
      const value = dateToSliderValue(new Date(endDate)) + 2;

      setTime(value);
      $time.current = value;
    }
  }, [endDate]);

  const getMinDate = () => {
    if (!endDate) {
      return null;
    }

    let midDate = new Date(endDate);
    midDate = addDays(midDate, 1);

    return midDate
  };

  const onTimeSliderEnd = () => {
    onEnd();

    if (!$currentDate.current) {
      return;
    }

    const { hours, minutes } = parseTimeOfSliderValue($time.current);
    const date = new Date($currentDate.current);

    date.setHours(hours);
    date.setMinutes(minutes);

    onDateChange(date);
  }

  const onDaySelect = ({dateString}, isDisabled) => {
    if (isDisabled) {
      return;
    }

    const date = new Date(dateString);
    const {hours, minutes} = parseTimeOfSliderValue(time);

    date.setHours(hours, minutes);
    $currentDate.current = date;
    onDateChange(date);
  }

  return (
    <Modalize
      ref={modalizeRef}
      snapPoint={HEIGHT / 1.1}
      modalHeight={HEIGHT / 1.1}
    >
      <ScrollViewChangeContent
        {...{ scrollViewRef }}
      >
        {
          unavailableProlongationDates === null
            ? <Waiter
              style={{
                zIndex: 1,
                height: HEIGHT / 1.15,
              }}
              isBlock={true}
            />
            : (
              <View style={styles.container}>
                <Text style={styles.title}>
                  Выберите дату продления аренды
                </Text>
                <WixCalendar
                  firstDay={1}
                  current={prolongationDateCreate || new Date(endDate)}
                  markedDates={{
                    ...(prolongationDateCreate ? {
                      [format(prolongationDateCreate, "yyyy-MM-dd")]: { both: true },
                    } : {}),
                  }}
                  customHeader={CalendarHeader}
                  dayComponent={(props) => (
                      <CalendarDay
                        onPressDay={(date) => onDaySelect(date, props.state === 'disabled')}
                        marking={{
                          isBlockedDays: true
                        }}
                        {...props}
                    />
                  )}
                  theme={calendarTheme}
                  minDate={getMinDate()}
                  maxDate={startDate ? formatMark(getMaxAvailableProlongationDate({
                    startDate,
                    endDate,
                    unavailableProlongationDates,
                    maxRentDays: car?.maxRentDays
                  })) : null}
                />
                <Slider
                  title="Время завершения аренды"
                  min={0}
                  max={47}
                  value={time}
                  onChange={(value) => {
                    $time.current = value;
                    setTime(value);
                  }}
                  onEnd={onTimeSliderEnd}
                  {...{ calcLabelValue, onStart }}
                />
                <PrimaryButton
                  disabled={!prolongationDateCreate}
                  style={styles.button}
                  onPress={onContinue}
                  title="Рассчитать"
                />
              </View>
            )
        }
      </ScrollViewChangeContent>
    </Modalize>
  );
};

const styles = StyleSheet.create({
  container: {
    ...theme.styles.container,
    marginTop: 10,
    padding: theme.spacing(4),
  },
  title: {
    ...theme.styles.src.P1_22,
    fontSize: 16,
  },
  button: {
    marginTop: theme.spacing(6),
  },
});

export default memo(ProlongDatePickerModal);
