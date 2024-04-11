import React from 'react';
import { View } from 'react-native';

import api from 'api';
import { PrimaryButton, Icon } from 'components';

import s from './styles';

const NavigationButtons = ({ 
    resumeTitle = 'Далее',
    disabledResume = false, 
    onPressResume,
    onPressBack,
}) => {

    return (
        <View style={s.navigationBtns}>
            <PrimaryButton 
                style={s.backBtn}
                titleStyle={s.backBtnTitle}
                title={
                    <Icon
                        name="arrow-open"
                        color='#282c34'
                        size={20}
                    />
                }
                onPress={() => {
                    api.navigation.goBack();
                    onPressBack && onPressBack();
                }}
            />
            <PrimaryButton 
                title={resumeTitle}
                style={s.resumeBtn}
                titleStyle={s.resumeBtnTitle}
                onPress={onPressResume}
                disabled={disabledResume}
            />
        </View>
    );
};

export default NavigationButtons;
