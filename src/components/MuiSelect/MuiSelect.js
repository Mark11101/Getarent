import React, { useState, useRef, useEffect } from 'react';
import { View, Text, Animated as NativeAnimated } from 'react-native';
import Select from '../Select';
import { WarningSvg } from '../Svg';
import s from './styles';

const MuiSelect = ({
    label,
    value,
    search,
    options,
    isError,
    errorMessage,
    disabled,
    style,
    onChange,
}) => {

    const moveYAnimation = useRef(new NativeAnimated.Value(0)).current;
    const moveXAnimation = useRef(new NativeAnimated.Value(0)).current;

    const speed = 180;
 
    const moveUp = () => {

        NativeAnimated.timing(moveYAnimation, {
            toValue: -20,
            duration: speed,
            useNativeDriver: true,
        }).start();

        NativeAnimated.timing(moveXAnimation, {
            toValue: 1,
            duration: speed,
            useNativeDriver: true,
        }).start();
    };

    const moveDown = () => {

        NativeAnimated.timing(moveYAnimation, {
            toValue: 0,
            duration: speed,
            useNativeDriver: true,
        }).start();

        NativeAnimated.timing(moveXAnimation, {
            toValue: 0,
            duration: speed,
            useNativeDriver: true,
        }).start();
    };

    const [isMovedUp, setIsMovedUp] = useState(false);

    useEffect(() => {
        isMovedUp ? moveUp() : moveDown();
    }, [isMovedUp]);

    useEffect(() => {
        value && setIsMovedUp(true);
    }, [value]);

    return (
        <View>
            <Select 
                value={value}
                search={search}
                error={isError}
                options={options}
                disabled={disabled}
                onChange={onChange}
                style={[s.select, style]}
                textStyle={s.textStyle}
            />
            <NativeAnimated.View style={[
                s.placeholder,
                { transform: [
                    { translateY: moveYAnimation },
                    { translateX: moveXAnimation },
                ]},
                { zIndex: isMovedUp ? 1 : -1 },
            ]}>
                <Text style={[
                    s.placeholder.text,
                ]}>
                    {label}
                </Text>
            </NativeAnimated.View>
            {
                (isError && errorMessage) && <View style={s.errorMessageContainer}>
                    <WarningSvg style={s.errorMessageIcon} />
                    <Text style={s.errorMessage}>
                        { errorMessage }
                    </Text>
                </View>
            }
        </View>
    )
};

export default MuiSelect;
