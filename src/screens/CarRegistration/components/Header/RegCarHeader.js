import React from 'react';
import { useDispatch } from 'react-redux';
import { View, TouchableOpacity, Text } from 'react-native';

import api from 'api';
import actions from 'actions';
import CloseIcon from 'img/thin-cross.svg';

import s from './styles';

const RegCarHeader = ({ title, screenNumber }) => {

    const dispatch = useDispatch();

    const handleCloseForm = () => {

        dispatch(actions.resetCarRegistrationData());

        while (screenNumber > 0) {
            api.navigation.goBack();
            screenNumber--;
        };
    };

    return (
        <View style={s.header}>
            <Text style={s.title}>
                {title}
            </Text>
            <TouchableOpacity onPress={handleCloseForm}>
                <CloseIcon width={30} height={30} />
            </TouchableOpacity>
        </View>
    );
};

export default RegCarHeader;
