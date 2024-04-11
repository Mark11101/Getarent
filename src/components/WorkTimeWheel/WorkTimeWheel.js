import { 
    View, 
    Text,
    Platform,
    TouchableOpacity,
} from 'react-native';
import React, { useState } from 'react';
import { Picker } from '@react-native-picker/picker';

import s from './styles';

const createHoursArray = () => {

    let hours = [];

    for (let i = 0; i < 24; i++) {

      let hourString = i.toString();
      
      if (hourString.length < 2) {
        hourString = '0' + hourString;
      };
      
      hours.push(hourString);
    };

    return hours;
};

const createMinutesArray = () => {

    let minutes = [];

    for (let i = 0; i < 60; i++) {

      let minuteString = i.toString();
      
      if (minuteString.length < 2) {
        minuteString = '0' + minuteString;
      };
      
      minutes.push(minuteString);
    };

    return minutes;
};

const WorkTimeWheel = () => {

    const [selectedWeekdayId, setSelectedWeekdayId] = useState(1);

    const [weekDays, setWeekDays] = useState(
        ['пн', 'вт', 'ср', 'чт', 'пт', 'сб', 'вс'].map((weekday, i) => (
            {
                id: Number(i) + 1,
                title: weekday,
                fromHour: '12',
                fromMinute: '00',
                toHour: '18',
                toMinute: '00',
                isUnavailable: false,
            }
        ))
    );

    const selectedWeekdayData = weekDays.find((weekday) => weekday.id === selectedWeekdayId);

    const handlePressWeekday = (weekDays, weekday, selectedWeekdayData) => {

        if (selectedWeekdayData.id === weekday.id) {

            if (!weekday.isUnavailable) {

                setWeekDays([
                    ...weekDays.filter((weekday) => weekday.id !== selectedWeekdayData.id),
                    {
                        ...selectedWeekdayData,
                        isUnavailable: true,
                    }
                ].sort((a, b) => a.id - b.id));

            } else {

                setWeekDays([
                    ...weekDays.filter((weekday) => weekday.id !== selectedWeekdayData.id),
                    {
                        ...selectedWeekdayData,
                        isUnavailable: false,
                    }
                ].sort((a, b) => a.id - b.id));
            };
        
        } else {

            if (weekday.isUnavailable) {

                setWeekDays([
                    ...weekDays.filter((day) => day.id !== weekday.id),
                    {
                        ...weekday,
                        isUnavailable: false,
                    }
                ].sort((a, b) => a.id - b.id));
            };

            setSelectedWeekdayId(weekday.id);
        };
    };
    
    return (
        <>
            {
                Platform.OS === 'ios'
                ?
                    <>
                        <View style={[s.weekdays, s.row]}>
                            {weekDays.map((weekday) => (
                                <TouchableOpacity
                                    key={weekday.id}
                                    onPress={() => handlePressWeekday(weekDays, weekday, selectedWeekdayData)}
                                >
                                    <View
                                        style={[
                                            s.weekday,
                                            selectedWeekdayId === weekday.id && s.selectedWeekday,
                                            weekday.isUnavailable && s.unavailableWeekday
                                        ]}
                                    >
                                        <Text style={[
                                            s.weekdayTitle,
                                            selectedWeekdayId === weekday.id && s.selectedWeekdayTitle,
                                            weekday.isUnavailable && s.unavailableWeekdayTitle
                                        ]}>
                                            {weekday.title}
                                        </Text>
                                    </View>
                                    {
                                        !weekday.isUnavailable
                                        &&
                                            <>
                                                <Text style={[
                                                    s.time,
                                                    selectedWeekdayId === weekday.id && s.selectedWeekdayTime
                                                ]}>
                                                    {weekday.fromHour}:{weekday.fromMinute}
                                                </Text>
                                                <Text style={[
                                                    s.time,
                                                    selectedWeekdayId === weekday.id && s.selectedWeekdayTime
                                                ]}>
                                                    {weekday.toHour}:{weekday.toMinute}
                                                </Text>
                                            </>
                                    }
                                </TouchableOpacity>
                            ))}
                        </View>
                        <View style={[s.pickers, s.row]}>
                            <Picker
                                style={s.picker}
                                itemStyle={s.itemStyle}
                                testID="from-hour-picker"
                                selectedValue={
                                    selectedWeekdayData.isUnavailable 
                                    ? 
                                        '00'
                                    :
                                        selectedWeekdayData.fromHour
                                }
                                onValueChange={(value) => {
                                    setWeekDays([
                                        ...weekDays.filter((weekday) => weekday.id !== selectedWeekdayId),
                                        {
                                            ...selectedWeekdayData,
                                            fromHour: value,
                                        }
                                    ].sort((a, b) => a.id - b.id))
                                }}
                            >
                                {createHoursArray().map((hour) => (
                                    <Picker.Item 
                                        color='black'
                                        key={hour}
                                        label={hour} 
                                        value={hour} 
                                    />
                                ))}
                            </Picker>
                            <Picker
                                style={s.picker}
                                itemStyle={s.itemStyle}
                                testID="from-minute-picker"
                                selectedValue={
                                    selectedWeekdayData.isUnavailable 
                                    ? 
                                        '00'
                                    :
                                        selectedWeekdayData.fromMinute
                                }
                                onValueChange={(value) => {
                                    setWeekDays([
                                        ...weekDays.filter((weekday) => weekday.id !== selectedWeekdayId),
                                        {
                                            ...selectedWeekdayData,
                                            fromMinute: value,
                                        }
                                    ].sort((a, b) => a.id - b.id))
                                }}
                            >
                                {createMinutesArray().map((minute) => (
                                    <Picker.Item 
                                        color='black'
                                        key={minute}
                                        label={minute} 
                                        value={minute} 
                                    />
                                ))}
                            </Picker>
                            <Text> - </Text>
                            <Picker
                                style={s.picker}
                                itemStyle={s.itemStyle}
                                testID="to-hour-picker"
                                selectedValue={
                                    selectedWeekdayData.isUnavailable 
                                    ? 
                                        '00'
                                    :
                                        selectedWeekdayData.toHour
                                }
                                onValueChange={(value) => {
                                    setWeekDays([
                                        ...weekDays.filter((weekday) => weekday.id !== selectedWeekdayId),
                                        {
                                            ...selectedWeekdayData,
                                            toHour: value,
                                        }
                                    ].sort((a, b) => a.id - b.id))
                                }}
                            >
                                {createHoursArray().map((hour) => (
                                    <Picker.Item 
                                        color='black'
                                        key={hour}
                                        label={hour} 
                                        value={hour} 
                                    />
                                ))}
                            </Picker>
                            <Picker
                                style={s.picker}
                                itemStyle={s.itemStyle}
                                testID="to-minute-picker"
                                selectedValue={
                                    selectedWeekdayData.isUnavailable 
                                    ? 
                                        '00'
                                    :
                                        selectedWeekdayData.toMinute
                                }
                                onValueChange={(value) => {
                                    setWeekDays([
                                        ...weekDays.filter((weekday) => weekday.id !== selectedWeekdayId),
                                        {
                                            ...selectedWeekdayData,
                                            toMinute: value,
                                        }
                                    ].sort((a, b) => a.id - b.id))
                                }}
                            >
                                {createMinutesArray().map((minute) => (
                                    <Picker.Item 
                                        color='black'
                                        key={minute}
                                        label={minute} 
                                        value={minute} 
                                    />
                                ))}
                            </Picker>
                        </View>
                    </>
                :
                    <>
                    </>
            }
        </>
    );
};

export default WorkTimeWheel;
