import React from 'react';
import { SafeAreaView, View, Text, TouchableOpacity } from 'react-native';

import api from 'api';
import { PrimaryButton } from 'components';
import SuccessIcon from 'img/damage-compensation/success.svg';

import s from './styles';
import {useSelector} from "react-redux";

const CompleteCompensation = () => {
    const {rent} = useSelector(state => state.rentRoom);

    return (
        <SafeAreaView style={s.container}>
            <View style={s.center}>
                <View style={s.icon}>
                    <SuccessIcon width={85} height={85} />
                </View>
                <Text style={s.text}>
                    Запрос на возмещение принят. 
                    В случае необходимости, мы свяжемся с вами.
                </Text>
            </View>
            <View style={s.bottom}>
                <PrimaryButton 
                    outlined
                    style={s.resumeBtn}
                    title='Перейти к аренде'
                    onPress={() => api.navigation.navigate('RentRoom', {
                        uuid: rent.id
                    })}
                />
            </View>
        </SafeAreaView>
    )
};

export default CompleteCompensation;
