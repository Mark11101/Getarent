import React, { useState } from 'react';
import BouncyCheckbox from 'react-native-bouncy-checkbox';
import { ScrollView, View, Text, TouchableOpacity, Alert } from 'react-native';

import { 
    Waiter,
    MuiInput,
    TextButton,
    RadioButton,
    PrimaryButton,
    TimeIntervalPicker,
    PhotoLoaderSlim
} from 'components';
import api from 'api';
import addPhoto from '../functions/addPhoto';
import { checkIfWhitespaceString } from '../../../functions';
import assemblePhotoObject from '../functions/assemblePhotoObject';

import s from '../styles';
import theme from 'theme';
import authStyles from '../../../screens/Auth/styles';
import { requestSuccessRegistrationModal } from '../../../modals';
import { useDispatch } from 'react-redux';
import actions from '../../../actions';
import { ROLE } from '../../../constants/roles';

const ProfileDataHostReg = ({ name, carId }) => {
    const dispatch = useDispatch()

    const [profileData, setProfileData] = useState({});
    const [workingHours, setWorkingHours] = useState([0, 1, 2, 3, 4, 5, 6]);
    const [avatar, setAvatar] = useState();

    const [isTrademark, setIsTrademark] = useState(false);

    const [isLastNameError, setIsLastNameError] = useState(false);
    const [isNameError, setIsNameError] = useState(false);
    const [isPatronymicError, setIsPatronymicError] = useState(false);
    const [isTrademarkError, setIsTrademarkError] = useState(false);

    const [isLatinLastNameError, setIsLatinLastNameError] = useState(false);
    const [isLatinNameError, setIsLatinNameError] = useState(false);
    const [isLatinPatronymicError, setIsLatinPatronymicError] = useState(false);

    const [isSelectionVisible, setIsSelectionVisible] = useState(false);

    const [fromHour, setFromHour] = useState('');
    const [fromMinute, setFromMinute] = useState('');
    const [toHour, setToHour] = useState('');
    const [toMinute, setToMinute] = useState('');

	const [isPolicyAgreed, setIsPolicyAgreed] = useState(false);
        
    const [isUserDataLoading, setIsUserDataLoading] = useState(false);
    const [isAvatarLoading, setIsAvatarLoading] = useState(false);
    const [isWorkingHoursLoading, setIsWorkingHoursLoading] = useState(false);

    const [isUserDataLoaded, setIsUserDataLoaded] = useState(false);
    const [isAvatarLoaded, setIsAvatarLoaded] = useState(false);
    const [isWorkingHoursLoaded, setIsWorkingHoursLoaded] = useState(false);

    const [isCarCreateLoading, setIsCarCreateLoading] = useState(false);
    // const [isCarCreateCompleted, setIsCarCreateCompleted] = useState(false);

    const sendUserData = async (profileData) => {

        setIsUserDataLoading(true);

        const data = {
            firstName: profileData.name,
            lastName: profileData.lastName,
            midName: profileData.patronymic,
            trademark: isTrademark ? profileData.trademark : ' ',
            useTrademark: isTrademark,
        };
        console.log(data)
        try {

            const res = await api.web.host.sendUserProfile(data);

            if (res?.error) {
                throw res.error;
            } else {
                setIsUserDataLoaded(true);
            }

        } catch (error) {
            
            console.log(error);

            Alert.alert('Хм, что-то пошло не так', 'Не удалось отправить данные о вас, попробуйте еще раз', [
                {
                    text: 'Ок',
                    style: 'cancel',
                },
            ]);

        } finally {
            setIsUserDataLoading(false);
        };
    };

    const sendAvatar = async (avatar) => {

        setIsAvatarLoading(true);

        const data = new FormData();

        data.append(
            'file',
            assemblePhotoObject(avatar)
        );

        try {

            const res = await api.web.host.sendAvatar(data);

            if (res?.error) {
                throw res.error;
            } else {
                setIsAvatarLoaded(true);
            }

        } catch (error) {
            
            console.log(error);

            Alert.alert('Хм, что-то пошло не так', 'Не удалось отправить аватар, попробуйте еще раз', [
                {
                    text: 'Ок',
                    style: 'cancel',
                },
            ]);

        } finally {
            setIsAvatarLoading(false);
        };
    };

    const handleChangeWorkingHours = (isChecked, dayIndex) => {

        if (!isChecked) {

            setWorkingHours(workingHours.filter((item) => item !== dayIndex));
            
        } else {

            const newWorkingHoursArray = [
                ...workingHours,
                dayIndex,
            ];

            newWorkingHoursArray.sort();

            setWorkingHours(newWorkingHoursArray);
        }
    };

    const sendWorkingHours = async (data) => {

        setIsWorkingHoursLoading(true);

        try {

            const res = await api.web.host.sendWorkingHours(data);

            if (res?.error) {
                throw res.error;
            } else {
                setIsWorkingHoursLoaded(true);
            }

        } catch (error) {
            
            console.log(error);

            Alert.alert('Хм, что-то пошло не так', 'Не удалось отправить ваше рабочее время, попробуйте еще раз', [
                {
                    text: 'Ок',
                    style: 'cancel',
                },
            ]);

        } finally {
            setIsWorkingHoursLoading(false);
        }
    };

    const completeCarCreate = async () => {

        setIsCarCreateLoading(true);

        try {

            const res = await api.web.host.completeCarRegistration(carId);

            if (res?.error) {
                throw res.error
            } else {

                dispatch(actions.setRole(ROLE.HOST));
                dispatch(actions.profileRequest());

                api.navigation.deepNavigate('Cars', 'MyCars', { withGoHomeButton: true });

                await requestSuccessRegistrationModal({ isHost: true });
            }
            
        } catch (error) {

            console.log(error);

            Alert.alert('Хм, что-то пошло не так', 'Не удалось завершить регистрацию, попробуйте еще раз', [
                {
                    text: 'Ок',
                    style: 'cancel',
                },
            ]);

        } finally {
            setIsCarCreateLoading(false);
        }
    };

    const handleSubmit = () => {
        
        sendUserData(profileData);

        sendAvatar(avatar);

        sendWorkingHours({
            days: workingHours,
            startTime: `${fromHour}:${fromMinute}`,
            endTime: `${toHour}:${toMinute}`,
        });
    };

    React.useEffect(() => {

        if (isUserDataLoaded && isAvatarLoaded && isWorkingHoursLoaded) {
            completeCarCreate()
        };

    }, [isUserDataLoaded, isAvatarLoaded, isWorkingHoursLoaded]);
    
    return (
        <>
            <ScrollView name={name} style={s.scrollView}>
                <Text style={[ authStyles.header, { marginBottom: 24 } ]}>
                    Настройте ваш профиль
                </Text>
                <View style={s.mb24}>
                    <RadioButton
                        material
                        label="Использовать торговую марку"
                        style={s.mb8}
                        labelStyle={s.radio.text}
                        onPress={() => setIsTrademark(true)}
                        checked={isTrademark}
                    />
                    <RadioButton
                        material
                        label="Использовать имя физ. лица"
                        labelStyle={s.radio.text}
                        onPress={() => setIsTrademark(false)}
                        checked={!isTrademark}
                    />
                </View>
                {
                    isTrademark
                    ?
                        <View style={[s.panel, s.mb24]}>
                            <Text style={[s.panel.title, s.mb24]}>
                                Торговая марка
                            </Text>
                            <MuiInput 
                                value={profileData.trademark}
                                errorMessage='Заполните поле'
                                placeholder='Торговое название'
                                isError={isTrademarkError}
                                style={s.mb16}
                                onChange={(e) => {

                                    const value = e.nativeEvent.text;

                                    setProfileData({
                                        ...profileData,
                                        trademark: value
                                    });

                                    setIsTrademarkError(false);

                                }}
                                onBlur={(e) => {

                                    const value = e.nativeEvent.text;

                                    const isEmpty = checkIfWhitespaceString(value);
        
                                    if (!value || isEmpty) {
                                        setIsTrademarkError(true)
                                    };
        
                                    if (isEmpty) {
                                        setProfileData({
                                            ...profileData,
                                            trademark: ''
                                        });
                                    };
                                }}
                                onClear={() => {

                                    setProfileData({
                                        ...profileData,
                                        trademark: ''
                                    });
                                }}
                            />
                        </View>
                    :
                        <View style={[s.panel, s.mb24]}>
                            <Text style={[s.panel.title, s.mb24]}>
                                Ф.И.О
                            </Text>
                            <MuiInput 
                                value={profileData.lastName}
                                placeholder='Фамилия'
                                isError={isLastNameError || isLatinLastNameError}
                                errorMessage={isLatinLastNameError ? 'Используйте русские буквы' : 'Заполните поле'}
                                style={s.mb32}
                                onChange={(e) => {

                                    const value = e.nativeEvent.text;

                                    if (/[a-zA-Z]/.test(value)) {
                                        setIsLatinLastNameError(true);
                                    } else {
                                        setIsLatinLastNameError(false);
                                    };

                                    setProfileData({
                                        ...profileData,
                                        lastName: value
                                    });

                                    setIsLastNameError(false);

                                }}
                                onBlur={(e) => {

                                    const value = e.nativeEvent.text;

                                    const isEmpty = checkIfWhitespaceString(value);
        
                                    if (!value || isEmpty) {
                                        setIsLastNameError(true)
                                    };
        
                                    if (isEmpty) {
                                        setProfileData({
                                            ...profileData,
                                            lastName: ''
                                        });
                                    };
                                }}
                                onClear={() => {

                                    setProfileData({
                                        ...profileData,
                                        lastName: ''
                                    });
                                }}
                            />
                            <MuiInput 
                                value={profileData.name}
                                placeholder='Имя'
                                isError={isNameError || isLatinNameError}
                                errorMessage={isLatinNameError ? 'Используйте русские буквы' : 'Заполните поле'}
                                style={s.mb32}
                                onChange={(e) => {

                                    const value = e.nativeEvent.text;

                                    if (/[a-zA-Z]/.test(value)) {
                                        setIsLatinNameError(true);
                                    } else {
                                        setIsLatinNameError(false);
                                    };

                                    setProfileData({
                                        ...profileData,
                                        name: value
                                    });

                                    setIsNameError(false);

                                }}
                                onBlur={(e) => {

                                    const value = e.nativeEvent.text;

                                    const isEmpty = checkIfWhitespaceString(value);
        
                                    if (!value || isEmpty) {
                                        setIsNameError(true)
                                    };
        
                                    if (isEmpty) {
                                        setProfileData({
                                            ...profileData,
                                            name: ''
                                        });
                                    };
                                }}
                                onClear={() => {

                                    setProfileData({
                                        ...profileData,
                                        name: ''
                                    });
                                }}
                            />
                            <MuiInput 
                                value={profileData.patronymic}
                                placeholder='Отчество'
                                isError={isPatronymicError || isLatinPatronymicError}
                                errorMessage={isLatinPatronymicError ? 'Используйте русские буквы' : 'Заполните поле'}
                                style={s.mb16}
                                onChange={(e) => {

                                    const value = e.nativeEvent.text;

                                    if (/[a-zA-Z]/.test(value)) {
                                        setIsLatinPatronymicError(true);
                                    } else {
                                        setIsLatinPatronymicError(false);
                                    };

                                    setProfileData({
                                        ...profileData,
                                        patronymic: value
                                    });

                                    setIsPatronymicError(false);

                                }}
                                onBlur={(e) => {

                                    const value = e.nativeEvent.text;

                                    const isEmpty = checkIfWhitespaceString(value);
        
                                    if (!value || isEmpty) {
                                        setIsPatronymicError(true)
                                    };
        
                                    if (isEmpty) {
                                        setProfileData({
                                            ...profileData,
                                            patronymic: ''
                                        });
                                    };
                                }}
                                onClear={() => {

                                    setProfileData({
                                        ...profileData,
                                        patronymic: ''
                                    });
                                }}
                            />
                        </View>
                }
                <View style={[s.panel, s.mb24]}>
                    <Text style={[s.panel.title, s.mb16]}>
                        {isTrademark ? 'Логотип' : 'Аватар'}
                    </Text>
                    <View style={s.row}>
                        <PhotoLoaderSlim
                            round
                            name='avatar'
                            style={s.mr16}
                            value={avatar}
                            label='Загрузить'
                            onSelect={addPhoto((data) => Object.keys(data).length !== 0 && setAvatar(data))}
                        />
                        <Text style={[s.defaultText, { fontSize: 14, width: '65%' }]}>
                            Используйте свободный формат социальных сетей
                        </Text>
                    </View>
                </View>
                <View style={[s.panel, s.mb24]}>
                    <Text style={[s.panel.title, { marginBottom: 20 }]}>
                        Когда вы на связи в чате и по телефону?
                    </Text>
                    <View style={[s.row, { marginBottom: 20 }]}>
                        <BouncyCheckbox 
                            text='Пн'
                            size={22}
                            isChecked={true}
                            style={{ marginRight: 20 }}
                            fillColor={theme.colors.blue}
                            textStyle={s.checkBox.text}
                            onPress={(isChecked) => handleChangeWorkingHours(isChecked, 0)}
                        />
                        <BouncyCheckbox 
                            text='Вт'
                            size={22}
                            isChecked={true}
                            style={{ marginRight: 20 }}
                            fillColor={theme.colors.blue}
                            textStyle={s.checkBox.text}
                            onPress={(isChecked) => handleChangeWorkingHours(isChecked, 1)}
                        />
                        <BouncyCheckbox 
                            text='Ср'
                            size={22}
                            isChecked={true}
                            style={{ marginRight: 20 }}
                            fillColor={theme.colors.blue}
                            textStyle={s.checkBox.text}
                            onPress={(isChecked) => handleChangeWorkingHours(isChecked, 2)}
                        />
                        <BouncyCheckbox 
                            text='Чт'
                            size={22}
                            isChecked={true}
                            style={{ marginRight: 20 }}
                            fillColor={theme.colors.blue}
                            textStyle={s.checkBox.text}
                            onPress={(isChecked) => handleChangeWorkingHours(isChecked, 3)}
                        />
                    </View>
                    <View style={[s.row, { marginBottom: 32 }]}>
                        <BouncyCheckbox 
                            text='Пт'
                            size={22}
                            isChecked={true}
                            style={{ marginRight: 20 }}
                            fillColor={theme.colors.blue}
                            textStyle={s.checkBox.text}
                            onPress={(isChecked) => handleChangeWorkingHours(isChecked, 4)}
                        />
                        <BouncyCheckbox 
                            text='Сб'
                            size={22}
                            isChecked={true}
                            style={{ marginRight: 20 }}
                            fillColor={theme.colors.blue}
                            textStyle={s.checkBox.text}
                            onPress={(isChecked) => handleChangeWorkingHours(isChecked, 5)}
                        />
                        <BouncyCheckbox 
                            text='Вс'
                            size={22}
                            isChecked={true}
                            style={{ marginRight: 20 }}
                            fillColor={theme.colors.blue}
                            textStyle={s.checkBox.text}
                            onPress={(isChecked) => handleChangeWorkingHours(isChecked, 6)}
                        />
                    </View>
                    <Text style={[s.defaultText, { fontSize: 14, marginBottom: 16 }]}>
                        Временной интервал
                    </Text>
                    <TouchableOpacity
                        style={s.timeSelector}
                        onPress={() => setIsSelectionVisible(true)}
                    >
                        <Text style={[
                            s.timeSelector.text,
                            fromMinute === '' && { color: '#878F9B' },
                        ]}>
                            {fromMinute === '' ? 'Начало' : `${fromHour}:${fromMinute}`}
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={s.timeSelector}
                        onPress={() => setIsSelectionVisible(true)}
                    >
                        <Text style={[
                            s.timeSelector.text,
                            fromMinute === '' && { color: '#878F9B' },
                        ]}>
                            {toMinute === '' ? 'Конец' : `${toHour}:${toMinute}`}
                        </Text>
                    </TouchableOpacity>
                </View>
                <BouncyCheckbox 
                    size={22}
                    isChecked={isPolicyAgreed}
                    textStyle={{ left: -5, textDecorationLine: "none", }}
                    style={[s.mb24, { alignItems: 'flex-start', paddingRight: 30 }]}
                    fillColor={theme.colors.blue}
                    text={
                        <>
                            <Text style={s.licenseText}>Завершая регистрацию, вы подписываете </Text>
                            <TextButton
                                style={s.textButton}
                                title='агентский договор с компанией ООО "ГЕПТОП"'
                                onPress={() =>
                                    api.navigation.navigate('DocumentPopup', { uri: 'https://storage.yandexcloud.net/getarent-documents-bucket/44c8b0961f3fa6b1.pdf' })
                                }
                            />
                            <Text style={s.licenseText}>, которая является правообладателем Getarent</Text>
                        </>
                    }
                    onPress={() => {
                        setIsPolicyAgreed(!isPolicyAgreed);
                    }}
                />
                <PrimaryButton
                    style={s.submitBtn}
                    onPress={handleSubmit}
                    title={
                        (
                            isUserDataLoading || 
                            isAvatarLoading || 
                            isWorkingHoursLoading ||
                            isCarCreateLoading
                        ) 
                        ? 
                            <Waiter size='small' /> 
                        : 
                            'Завершить регистрацию'
                    }
                    disabled={
                        (
                            isTrademark
                            ?
                                !profileData.trademark ||
                                checkIfWhitespaceString(profileData.trademark)
                            :
                                (
                                    !profileData.lastName ||
                                    !profileData.name ||
                                    !profileData.patronymic ||
                                    isLatinLastNameError ||
                                    isLatinNameError ||
                                    isLatinPatronymicError ||
                                    checkIfWhitespaceString(profileData.lastName) ||
                                    checkIfWhitespaceString(profileData.name) ||
                                    checkIfWhitespaceString(profileData.patronymic)
                                )
                        ) ||
                        !avatar ||
                        fromHour === '' ||
                        !isPolicyAgreed
                    }
                />
            </ScrollView>
            <TimeIntervalPicker 
                visible={isSelectionVisible}
                initialFromHour='08'
                initialFromMinute='00'
                initialToHour='20'
                initialToMinute='00'
                onSubmit={(fromHour, fromMinute, toHour, toMinute) => {

                    setFromHour(fromHour);
                    setFromMinute(fromMinute);
                    setToHour(toHour);
                    setToMinute(toMinute);

                    setIsSelectionVisible(false);
                }}
            />
        </>
    )
};

export default ProfileDataHostReg;
