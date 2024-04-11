import {
    View,
    Text,
    Platform,
    TouchableOpacity,
} from 'react-native';
import React, { useState } from 'react';
import { BlurPopup } from 'components';
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

const TimeIntervalPicker = ({ 
    visible, 
    initialFromHour,
    initialFromMinute,
    initialToHour,
    initialToMinute,
    onSubmit,
}) => {

    const [fromHour, setFromHour] = useState(initialFromHour ?? '');
    const [fromMinute, setFromMinute] = useState(initialFromMinute ?? '');
    const [toHour, setToHour] = useState(initialToHour ?? '');
    const [toMinute, setToMinute] = useState(initialToMinute ?? '');

    const isAndroid = Platform.OS === 'android';
    
    return (
        <BlurPopup
            transparent
            blurAmount={20}
            closable={false}
            visible={visible}
        >
            {
                Platform.OS === 'android'
                ?
                    <View>
                        <Text style={[s.selectorHeader.text, { textAlign: 'center' }]}>
                            Начало
                        </Text>
                        <View style={[s.row, { marginBottom: 70, left: 10 }]}>
                            <Picker
                                style={s.picker}
                                itemStyle={s.itemStyle}
                                testID="from-hour-picker"
                                selectedValue={fromHour}
                                onValueChange={(value) => setFromHour(value)}
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
                            <Text style={{ marginHorizontal: 20 }}> : </Text>
                            <Picker
                                style={s.picker}
                                itemStyle={s.itemStyle}
                                testID="from-minute-picker"
                                selectedValue={fromMinute}
                                onValueChange={(value) => setFromMinute(value)}
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
                        <Text style={[s.selectorHeader.text, { textAlign: 'center' }]}>
                            Конец
                        </Text>
                        <View style={[s.row, { marginBottom: 50, left: 10 }]}>
                            <Picker
                                style={s.picker}
                                itemStyle={s.itemStyle}
                                testID="to-hour-picker"
                                selectedValue={toHour}
                                onValueChange={(value) => setToHour(value)}
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
                            <Text style={{ marginHorizontal: 20 }}> : </Text>
                            <Picker
                                style={s.picker}
                                itemStyle={s.itemStyle}
                                testID="to-minute-picker"
                                selectedValue={toMinute}
                                onValueChange={(value) => setToMinute(value)}
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
                    </View>
                :
                    <>
                        <View style={[
                            s.row, 
                            s.selectorHeader,
                        ]}>
                            <Text style={s.selectorHeader.text}>
                                Начало
                            </Text>
                            <Text style={s.selectorHeader.text}>
                                Конец
                            </Text>
                        </View>
                        <View style={s.row}>
                            <Picker
                                style={s.picker}
                                itemStyle={s.itemStyle}
                                testID="from-hour-picker"
                                selectedValue={fromHour}
                                onValueChange={(value) => setFromHour(value)}
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
                            <Text>:</Text>
                            <Picker
                                style={s.picker}
                                itemStyle={s.itemStyle}
                                testID="from-minute-picker"
                                selectedValue={fromMinute}
                                onValueChange={(value) => setFromMinute(value)}
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
                            <Picker
                                style={s.picker}
                                itemStyle={s.itemStyle}
                                testID="to-hour-picker"
                                selectedValue={toHour}
                                onValueChange={(value) => setToHour(value)}
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
                            <Text>:</Text>
                            <Picker
                                style={s.picker}
                                itemStyle={s.itemStyle}
                                testID="to-minute-picker"
                                selectedValue={toMinute}
                                onValueChange={(value) => setToMinute(value)}
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
            }
            <TouchableOpacity 
                style={[
                    s.selectorCloseBtn,
                    { top: isAndroid ? 25 : -40 },
                ]}
                onPress={() => onSubmit(
                    fromHour,
                    fromMinute,
                    toHour,
                    toMinute,
                )}
            >
                <Text style={s.selectorCloseBtn.text}>
                    Подтвердить
                </Text>
            </TouchableOpacity>
        </BlurPopup>
    )
};

export default TimeIntervalPicker;
