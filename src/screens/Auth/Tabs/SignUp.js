import { 
    View,
    Text,
    Image,
    ScrollView,
    TouchableOpacity,
} from 'react-native';
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { MaskedTextInput } from "react-native-mask-text";
import BouncyCheckbox from 'react-native-bouncy-checkbox';
import { showMessage } from "react-native-flash-message";
import {
    Icon,
    Input,
    Waiter,
    TextButton,
    PrimaryButton,
} from 'components';
import api from 'api';
import actions from 'actions';
import FlagIcon from 'img/auth/flag.png';
import ClearIcon from 'img/auth/cross.svg';
import WarningIcon from 'img/auth/warning-icon.svg';
import { validateEmail, validatePassword } from 'functions';

import s from '../styles';
import theme from 'theme';

import { trackRegistrationEvent } from '../../../myTrackerService';

export const SignUpTab = () => {

    const dispatch = useDispatch();

	const [waiter, setWaiter] = useState(false);
    
    const [phone, setPhone] = useState('+7');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

	const [secureTextEntry, setSecureTextEntry] = useState(true);
	const [isPolicyAgreed, setIsPolicyAgreed] = useState(false);

    const [phoneError, setPhoneError] = useState(false);
    const [emailError, setEmailError] = useState(false);
    const [gmailError, setGmailError] = useState(false);
    const [passwordError, setPasswordError] = useState(false);


    const normalizePhone = (phone) => phone.replace(/[\(\)\-\s]/g, '').replace(/^\+\d+(\+\d+)/, '');

    const onSubmit = async (email, phone, password) => {

        setWaiter(true);

        const lowerCasedEmail = email.toLowerCase().replace(/ /g, '');
        const normalizedPhone = normalizePhone(phone);

        try {
            const {
                error,
                accessToken,
                refreshToken,
                user,
            } = await api.web.signup(
                lowerCasedEmail,
                normalizedPhone,
                password
            );

            if (error) {
                throw error;
            };

            await api.auth.setToken(accessToken, refreshToken);
            await api.storage.set('profile', user);
            
            await api.web.setEmail(email);

            trackRegistrationEvent(user);

            dispatch(actions.setPotentialRole(null));
            dispatch(actions.login(user, true));

        } catch (err) {
            
            console.log(err);

            err.statusCode === 409
            ?
                dispatch(actions.error('Пользователь с такой почтой или телефоном уже зарегистрирован'))
            :
                dispatch(actions.error('Не удалось зарегистрироваться, попробуйте еще раз'))

        } finally {
            setWaiter(false);
        }
    };

    const validatePhone = (phone) => phone === '+7' || /^\+7 \(\d{3}\) \d{3} - \d{2} - \d{2}$/.test(phone);

    const handleChangePhone = async (text, rawText) => {
        const cutByIndex = (str, i) => str.split('').filter((_, idx) => idx !== i).join('')

        if (rawText?.[0] === '8') return setPhone(cutByIndex(rawText, 0))
        if ([ '7', '8' ].includes(rawText?.[1])) return setPhone(cutByIndex(rawText, 1))
        setPhone(text)
    }

    React.useEffect(() => {
        validatePhone(phone) && setPhoneError(false);
    }, [phone]);
    
    return (
        <>
            <ScrollView style={s.signup}>
                <View style={s.warning}>
                    <WarningIcon
                        width={11}
                        height={11}
                        style={s.warningIcon}
                    />
                    <Text style={s.warningText}>
                        Вам потребуются паспорт и права РФ 
                    </Text>
                </View>
                <Text style={[s.header, { marginBottom: 24 }]}>
                    Регистрация
                </Text>
                <View>
                    <MaskedTextInput
                        value={phone}
                        type={'custom'}
                        borderRadius={30}
                        error={phoneError}
                        placeholder='Телефон'
                        borderColor='#DBE3EF'
                        keyboardType='phone-pad'
                        mask='+7 (999) 999 - 99 - 99'
                        style={[
                            s.inputStyle,
                            s.phoneInput,
                            phoneError && { borderColor: theme.colors.red },
                        ]}
                        onEndEditing={(e) => setPhoneError(!validatePhone(e.nativeEvent.text))}
                        onChangeText={handleChangePhone}
                    />
                    <View style={s.phoneInfo}>
                        <Image source={FlagIcon} style={s.phoneFlag} />
                        <Text style={s.phoneDivider}>|</Text>
                    </View>
                    <TouchableOpacity style={s.clearPhone} onPress={() => setPhone('+7')}>
                        <ClearIcon width={12} height={12} />
                    </TouchableOpacity>
                </View>            
                <Input 
                    type='email'
                    value={email}
                    style={[s.input, { marginBottom: 0 }]}
                    borderRadius={30}
                    error={emailError}
                    inputStyle={s.inputStyle}
                    keyboardType='email-address'
                    placeholder='Электронная почта'
                    borderColor='#DBE3EF'
                    onEndEditing={(e) => setEmailError(!validateEmail(e.nativeEvent.text))}
                    onChange={(e) => {
                        const text = e.nativeEvent.text;
                        setEmail(text.toLowerCase());
                        setGmailError(text.includes("@gmail"));
                        validateEmail(text) && setEmailError(false);
                    }}
                />
                {
                    gmailError
                    &&
                        <View style={[s.warning, { marginTop: 5 }]}>
                            <WarningIcon
                                width={11}
                                height={11}
                                style={s.warningIcon}
                            />
                            <Text style={s.warningText}>
                                Почта с доменом Gmail временно не принимается
                            </Text>
                        </View>
                }
                <View style={{ marginTop: 28 }}>
                    <Input 
                        value={password}
                        style={s.input}
                        borderRadius={30}
                        placeholder='Пароль'
                        borderColor='#DBE3EF'
                        error={passwordError}
                        inputStyle={s.inputStyle}
                        secureTextEntry={secureTextEntry}
                        onEndEditing={(e) => {
                            setPasswordError(!validatePassword(e.nativeEvent.text));
                            !validatePassword(e.nativeEvent.text) && showMessage({
                                message: "Минимальная длина пароля: 5 символов",
                                type: "danger",
                            });
                        }}
                        onChange={(e) => {
                            const text = e.nativeEvent.text;
                            setPassword(text);
                            validatePassword(text) && setPasswordError(false);
                        }}
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
                <BouncyCheckbox 
                    style={s.checkbox}
                    isChecked={isPolicyAgreed}
                    text={
                        <Text style={s.licenseText}>
                            <Text>Я принимаю </Text>
                            <TextButton
                                style={s.textButton}
                                title="Условия пользовательского соглашения"
                                onPress={() =>
                                    api.navigation.navigate(
                                        'DocumentPopup',
                                        {
                                            uri:
                                                'https://storage.yandexcloud.net/getarent-documents-bucket/3208ff5d2ed1a6a3.pdf',
                                        }
                                    )
                                }
                            />
                            <Text> и даю </Text>
                            <TextButton
                                style={s.textButton}
                                title="согласие на обработку персональных данных"
                                onPress={() =>
                                    api.navigation.navigate(
                                        'DocumentPopup',
                                        {
                                            uri:
                                                'https://storage.yandexcloud.net/getarent-documents-bucket/C_.pdf',
                                        }
                                    )
                                }
                            />
                        </Text>
                    }
                    size={22}
                    fillColor={theme.colors.blue}
                    textStyle={s.policyText}
                    onPress={() => {
                        
                        setIsPolicyAgreed(!isPolicyAgreed);

                        if (!validatePassword(password) && !isPolicyAgreed) {
                            setPasswordError(true);
                            showMessage({
                                message: "Минимальная длина пароля: 5 символов",
                                type: "danger",
                            });
                        }
                    }}
                />
                <PrimaryButton
                    style={s.submitBtn}
                    title={waiter ? <Waiter size='small' /> : 'Зарегистрироваться'}
                    onPress={() => onSubmit(email, phone, password)}
                    disabled={
                        phone === '+7' ||
                        !email ||
                        !password ||
                        gmailError ||
                        !validatePhone(phone) ||
                        !validateEmail(email) || 
                        !validatePassword(password) || 
                        !isPolicyAgreed
                    }
                />
            </ScrollView>
        </>
    )
}
