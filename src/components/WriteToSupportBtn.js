import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

import api from 'api';
import WhiteChatIcon from 'img/white-chat-icon.svg';

import theme from 'theme';

const WriteToSupportBtn = ({ text = 'Задать вопрос в чате', style }) => {

    return (
        <TouchableOpacity
            style={[s.btn, style]}
            onPress={() => api.navigation.navigate('Chats', { screen: 'Support' })}
        >
            <Text style={s.text}>
                {text}
            </Text>
            <WhiteChatIcon />
        </TouchableOpacity>
    )
};

export default WriteToSupportBtn;

const s = StyleSheet.create({
    btn: {
        flexDirection: 'row',
        borderRadius: 30,
        paddingVertical: 8,
        paddingHorizontal: 20,
        backgroundColor: theme.colors.black,
        justifyContent: 'center',
    },
    text: {
        fontFamily: 'Inter-Regular',
        fontSize: 16,
        lineHeight: 22,
        color: theme.colors.white,
        marginRight: 10,
    }
});
