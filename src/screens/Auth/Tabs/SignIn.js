import { View, Text, TouchableOpacity } from 'react-native';
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import {
    Icon, 
    Input, 
    Waiter,
    TextButton, 
    PrimaryButton, 
} from 'components';

import api from 'api';
import actions from 'actions';
import { validateEmail } from 'functions';

import s from '../styles';
import theme from 'theme';

import { trackLoginEvent } from '../../../myTrackerService';

export const SignInTab = ({ navigation, onAuthAction, route: { params = {} } }) => {
    onAuthAction = params.onAuthAction ?? onAuthAction

    const dispatch = useDispatch();

	const [waiter, setWaiter] = useState(false);

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

	const [secureTextEntry, setSecureTextEntry] = useState(true);

    const [emailError, setEmailError] = useState(false);

    const onSubmit = (email, password) => {
		
        setWaiter(true);
    
        api.web
            .login(email.replace(/ /g, ''), password)
            .then(
                async ({ error, accessToken, refreshToken, user }) => {

                    if (error) {
                        console.log(error)
                        throw error;
                    }

                    await api.auth.setToken(accessToken, refreshToken);
                    await api.storage.set('profile', user);
                    trackLoginEvent(user)
                    
                    dispatch(actions.login(user))
                    if (onAuthAction) {
                        if (!Array.isArray(onAuthAction)) {
                            onAuthAction = [ onAuthAction ]
                        }
                        onAuthAction.forEach(action => {
                            let { type, payload } = action
                            
                            payload = Array.isArray(payload) ? payload : [ payload ]
    
                            if (api.navigation[type]?.call) {
                                api.navigation[type](...payload)
                            }
                        })
                        navigation.setParams({ onAuthAction: null })
                    }
                }
            )
            .catch((err) => {

                console.log(err)

                setWaiter(false);					
                
                err.statusCode === 401
                ?
                    dispatch(actions.error('Неверный email или пароль, попробуйте еще раз'))
                :
                    dispatch(actions.error('Не удалось войти в аккаунт, попробуйте еще раз'))
            });
    };

    return (
        <View style={s.signin}>
            <Text style={s.header}>
                Войти
            </Text>
            <Input 
                value={email}
                style={s.input}
                borderRadius={30}
                error={emailError}
                inputStyle={s.inputStyle}
                placeholder='Электронная почта'
                borderColor='#DBE3EF'
                onEndEditing={(e) => setEmailError(!validateEmail(e.nativeEvent.text))}
                onChange={(e) => {
                    const text = e.nativeEvent.text;
                    setEmail(text.toLowerCase());
                    validateEmail(text) && setEmailError(false);
                }}
            />
            <View>
                <Input 
                    value={password}
                    style={s.input}
                    borderRadius={30}
                    placeholder='Пароль'
                    borderColor='#DBE3EF'
                    selectTextOnFocus={false}
                    inputStyle={s.inputStyle}
                    secureTextEntry={secureTextEntry}
                    onChange={(e) => setPassword(e.nativeEvent.text)}
                />
                <View style={s.eye}>
                    <TouchableOpacity
                        hitSlop={theme.hitSlop}
                        onPress={() => setSecureTextEntry(v => !v)}
                        onLongPress={() => dispatch(actions.toggleDevMode())}
                        delayLongPress={8000}
                    >
                        <Icon
                            name={secureTextEntry ? 'eye' : 'eye-closed'}
                            size={theme.normalize(18)}
                            color={theme.colors.grey}
                        />
                    </TouchableOpacity>
                </View>
            </View>
            <TextButton
                title="Забыли пароль?"
                style={{ marginBottom: 24 }}
                onPress={() =>
                    api.navigation.navigate(
                        'RecoverPassword'
                    )
                }
            />
            <PrimaryButton 
                style={s.submitBtn}
                title={waiter ? <Waiter size='small' /> : 'Войти'}
                onPress={() => onSubmit(email, password)}
                disabled={
                    !password ||
                    !validateEmail(email)
                }
            />
        </View>
    )
}
