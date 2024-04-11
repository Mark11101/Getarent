import React from 'react';

import { Input } from 'components';

import s from './styles';

const InputComponent = ({
    key,
    value,
    label,
    style,
    error,
    maxLength,
    labelStyle,
    inputStyle,
    placeholder,
    borderRadius,
    keyboardType,
    onChange,
    onEndEditing,
}) => {

    return (
        <Input 
            white
            key={key}
            value={value}
            label={label}
            error={error}
            maxLength={maxLength}
            style={[s.input, style]}
            placeholder={placeholder}
            keyboardType={keyboardType}
            borderRadius={borderRadius}
            inputStyle={[s.inputStyle, inputStyle]}
            labelStyle={[s.labelStyle, labelStyle]}
            onChange={onChange}
            onEndEditing={onEndEditing}
        />
    );
};

export default InputComponent;
