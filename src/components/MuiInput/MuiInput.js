import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TouchableOpacity, Animated as NativeAnimated } from 'react-native';

import Input from '../Input';
import { CrossSvg } from '../Svg'
import authStyles from '../../screens/Auth/styles'

import s from './styles';
import theme from 'theme';

const MuiInput = ({
    value,
    placeholder,
    isError,
    errorMessage,
    infoMessage,
    postfix,
    style,
    inputStyle,
    keyboardType,
    withoutUpLabel,
    onChange,
    onBlur,
    onClear,
    ...rest
}) => {

    const moveYAnimation = useRef(new NativeAnimated.Value(0)).current;

    const speed = 180;
 
    const moveUp = () => {

        NativeAnimated.timing(moveYAnimation, {
            toValue: -20,
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
    };

    const [isMovedUp, setIsMovedUp] = useState(false);
    const [isFocused, setIsFocused] = useState(false);
    const [zIndex, setZIndex] = useState(-1);

    useEffect(() => {
        setTimeout(() => setZIndex(isMovedUp ? 1 : -1), 100);
    }, [isMovedUp]);

    useEffect(() => {
        isMovedUp ? moveUp() : moveDown();
    }, [isMovedUp]);

    useEffect(() => {
        setIsMovedUp(!!value || isFocused);
    }, [value]);

    return (
        <View>
            <Input
                value={value}

                keyboardType={keyboardType}
                placeholder={withoutUpLabel && placeholder}
                infoMessage={infoMessage}

                error={isError}
                errorMessage={errorMessage}
        
                borderRadius={30}
                borderColor='#DBE3EF'
                inputStyle={[authStyles.inputStyle, inputStyle]}
                style={[authStyles.input, s.internalInput, style]}

                onChange={onChange}
                onEndEditing={(e) => {

                    setIsFocused(false);
        
                    onBlur && onBlur(e);

                    if (!e.nativeEvent.text) {
                        setIsMovedUp(false);
                    };
                }}
                onFocus={(e) => {

                    setIsFocused(true);
                    
                    if (!e.nativeEvent.text) {
                        setIsMovedUp(true);
                    }
                }}
    
                { ...rest }
            />
            {
                !!value && !!onClear && <TouchableOpacity
                    style={s.clearBtn}
                    activeOpacity={0.6}
                    onPress={() => {
                        onClear();
                    }}
                >
                    <CrossSvg />
                </TouchableOpacity>
            }
            {
                !withoutUpLabel
                &&
                    <NativeAnimated.View style={[
                        s.placeholder,
                        { transform: [
                            { translateY: moveYAnimation },
                        ]},
                        { zIndex },
                    ]}>
                        <Text style={[
                            s.placeholder.text,
                            { fontSize: 14 },
                        ]}>
                            {placeholder}
                        </Text>
                    </NativeAnimated.View>
            }
            {
                postfix && value
                &&
                    <View style={s.postfix}>
                        <Text style={[authStyles.inputStyle, inputStyle, { opacity: 0 }]}>
                            {value}
                        </Text>
                        <Text style={[authStyles.inputStyle, inputStyle, isError && { color: theme.colors.red }]}>
                            {' ' + postfix}
                        </Text>
                    </View>
            }
        </View>
    )
};

export default MuiInput;
