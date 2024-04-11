import React from 'react';
import { Text } from 'react-native';

import { Select } from 'components';

import s from './styles';

const SelectComponent = ({
    label,
    value,
    style,
    search,
    options,
    disabled,
    onChange,
}) => {

    return (
        <>
            <Text style={[
                s.label,
                disabled && { opacity: 0.5 }
            ]}>
                {label}
            </Text>
            <Select 
                white
                label={label}
                value={value}
                search={search}
                options={options}
                disabled={disabled}
                onChange={onChange}
                style={[s.select, style]}
            />
        </>
    );
};

export default SelectComponent;
