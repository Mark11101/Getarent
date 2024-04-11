import React from 'react';
import { ScrollView, View, Image, Text } from 'react-native';

import api from 'api';
import { Header, PrimaryButton } from 'components';

import s from './styles';

const GuarantorOfSecurity = () => {

    return (
        <ScrollView style={s.guarantorOfSecurity}>
            <Header big />
            <View style={s.container}>
                <View style={s.icon}>
                    <Image source={require('img/guarantorOfSecurity.png')} />
                </View>
                <Text style={s.title}>
                    Зачем Getarent берет комиссию?
                </Text>
                <Text style={s.text}>
                    Благодаря этому сбору мы развиваем наш сервис и, в том числе, 
                    обеспечиваем путешественников круглосуточной поддержкой.
                </Text>
                <Text style={s.text}>           
                    Мы являемся финансовым гарантом взаимоотношений с владельцем. 
                    Партнеры Getarent получают выплату за аренду только после ее начала. 
                </Text>
                <Text style={[s.text, { marginBottom: 43 }]}>           
                    Getarent заранее проверяет всех владельцев и техническое состояние 
                    машин, внимательно относится к любым конфликтным ситуациям и помогает 
                    решать проблемы, в том числе при ДТП. Сообщите нам, если что-то пойдет не так.
                </Text>
                <PrimaryButton 
                    style={s.resumeBtn}
                    title='Спасибо, все понятно'
                    onPress={() => api.navigation.goBack()}
                />
            </View>
        </ScrollView>
    )
}

export default GuarantorOfSecurity
