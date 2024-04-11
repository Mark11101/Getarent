import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { ScrollView, View, Text, Alert } from 'react-native';
import { TextInputMask } from 'react-native-masked-text';

import api from 'api';
import actions from 'actions';
import { TABS } from '../HostRegistration';
import addPhoto from '../functions/addPhoto';
import isOlderThan18 from '../functions/isOlderThan18';
import addDotsToDate from '../functions/addDotsToDate';
import { checkIfWhitespaceString } from '../../../functions';
import checkIfDateValid from '../functions/checkIfDateValid';
import assemblePhotoObject from '../functions/assemblePhotoObject';
import checkIfObjectNotEmpty from '../functions/checkIfObjectNotEmpty';
import { RadioButton, MuiInput, PrimaryButton, Waiter, PhotoLoaderSlim } from '../../../components';

import s from '../styles';
import authStyles from '../../../screens/Auth/styles';

const OwnerDataHostReg = ({ 
    name, 
    carId, 
    navigation, 
    isSecondCar,
    setPassedSteps, 
    resetPassesSteps,
    incompletedOwnerData, 
}) => {

    const dispatch = useDispatch();

    const [ownerData, setOwnerData] = useState({});

    const [frontPassport, setFrontPassport] = useState();
    const [backPassport, setBackPassport] = useState();

    const [isIndividual, setIsIndividual] = useState(true);

    const [isLastNameError, setIsLastNameError] = useState(false);
    const [isNameError, setIsNameError] = useState(false);
    const [isPatronymicError, setIsPatronymicError] = useState(false);
    const [isBirthDateError, setIsBirthDateError] = useState(false);
    const [isPassportNumberError, setIsPassportNumberError] = useState(false);
    const [isPassportDateError, setIsPassportDateError] = useState(false);
    const [isAddressError, setIsAddressError] = useState(false);

    const [isLatinLastNameError, setIsLatinLastNameError] = useState(false);
    const [isLatinNameError, setIsLatinNameError] = useState(false);
    const [isLatinPatronymicError, setIsLatinPatronymicError] = useState(false);

    const [isBirthDateFormatError, setIsBirthDateFormatError] = useState(false);
    const [isPassportNumberLengthError, setIsPassportNumberLengthError] = useState(false);
    const [isPassportDateFormatError, setIsPassportDateFormatError] = useState(false);

    const [isCompanyNameError, setIsCompanyNameError] = useState(false);
    const [isINNError, setIsINNError] = useState(false);
    const [isLegalAddressError, setIsLegalAddressError] = useState(false);

    const [isINNLengthError, setIsINNLengthError] = useState(false);

    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async () => {

        setIsLoading(true);

        const ownerFormData = new FormData();

        if (isIndividual) {

            ownerFormData.append(
                'type',
                'INDIVIDUAL',
            );

            ownerFormData.append(
                'firstName',
                ownerData.name,
            );
    
            ownerFormData.append(
                'lastName',
                ownerData.lastName,
            );
    
            ownerFormData.append(
                'midName',
                ownerData.patronymic,
            );
    
            ownerFormData.append(
                'birthDate',
                ownerData.birthDate,
            );
    
            ownerFormData.append(
                'serialNumber',
                ownerData.passportNumber,
            );
    
            ownerFormData.append(
                'dateOfIssue',
                ownerData.passportDate,
            );
    
            ownerFormData.append(
                'registrationAddress',
                ownerData.registrationAddress,
            );
    
            ownerFormData.append(
                'frontSidePhoto',
                checkIfObjectNotEmpty(frontPassport) ? assemblePhotoObject(frontPassport) : undefined,
            );
    
            ownerFormData.append(
                'registrationSidePhoto',
                checkIfObjectNotEmpty(backPassport) ? assemblePhotoObject(backPassport) : undefined,
            );

        } else {

            ownerFormData.append(
                'type',
                'LEGAL',
            );

            ownerFormData.append(
                'companyName',
                ownerData.companyName,
            );

            ownerFormData.append(
                'inn',
                ownerData.INN,
            );

            ownerFormData.append(
                'companyAddress',
                ownerData.legalAddress,
            );
        };

        try {
            
            const res = await api.web.host.sendOwnerData(carId, ownerFormData);

            if (res?.uuid) {

                if (isSecondCar) {
                
                    try {
            
                        const res = await api.web.host.completeCarRegistration(carId);
            
                        if (res?.error) {
                            throw res.error
                        } else {
        
                            api.navigation.navigate('Cars');
                            
                            dispatch(actions.profileRequest());
                            dispatch(actions.getCarsList());

                            resetPassesSteps();
                            navigation.navigate(TABS.CAR_DATA);

                            api.navigation.deepNavigate('Cars', 'MyCars');
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
                        setIsLoading(false);
                    };

                } else {
                    navigation.navigate(TABS.PROFILE_DATA);
                    setPassedSteps();
                };

            } else {
                throw res.error;
            };

        } catch (error) {
            
            console.log(error);

            Alert.alert('Хм, что-то пошло не так', 'Попробуйте еще раз', [
                {
                    text: 'Ок',
                    style: 'cancel',
                },
            ]);

        } finally {
            setIsLoading(false);
        };
    };

    React.useEffect(() => {

        if (!!incompletedOwnerData && Object.keys(incompletedOwnerData).length !== 0) {

            if (incompletedOwnerData.type === 'INDIVIDUAL') {

                setTimeout(() => {
        
                    setOwnerData({
                        ...ownerData,
                        name: incompletedOwnerData.firstName,
                        lastName: incompletedOwnerData.lastName,
                        patronymic: incompletedOwnerData.midName,
                        birthDate: incompletedOwnerData.birthDate,
                        passportNumber: incompletedOwnerData.serialNumber,
                        passportDate: incompletedOwnerData.dateOfIssue,
                        registrationAddress: incompletedOwnerData.registrationAddress,
                    });
                }, 700);

                setFrontPassport(incompletedOwnerData.frontSidePhotoUrl);
                setBackPassport(incompletedOwnerData.registrationSidePhotoUrl);

            } else {
                
                setIsIndividual(false);
                
                setTimeout(() => {
        
                    setOwnerData({
                        ...ownerData,
                        companyName: incompletedOwnerData.companyName,
                        INN: incompletedOwnerData.inn,
                        legalAddress: incompletedOwnerData.companyAddress,
                    });
                }, 700);
            }
        }

    }, [incompletedOwnerData]);

    return (
        <ScrollView name={name} style={s.scrollView}>
            <Text style={[ authStyles.header, { marginBottom: 24 } ]}>
                Заполните данные владельца авто
            </Text>
            <View style={[s.row, s.mb24]}>
                <RadioButton
                    material
                    label="Физическое лицо"
                    style={{ marginRight: 20 }}
                    labelStyle={s.radio.text}
                    onPress={() => setIsIndividual(true)}
                    checked={isIndividual}
                />
                <RadioButton
                    material
                    label="Юридическое лицо"
                    labelStyle={s.radio.text}
                    onPress={() => setIsIndividual(false)}
                    checked={!isIndividual}
                />
            </View>

            <View style={{
                opacity: isIndividual ? 1 : 0,
                position: isIndividual ? 'relative' : 'absolute',
                zIndex: isIndividual ? 1000 : 0,
                top: isIndividual ? 0 : 200,
            }}>
                <View style={[s.panel, s.mb24]}>
                    <Text style={[s.panel.title, s.mb24]}>
                        Ф.И.О владельца авто
                    </Text>
                    <MuiInput 
                        maxLength={36}
                        placeholder='Фамилия'
                        value={ownerData.lastName}
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

                            setOwnerData({
                                ...ownerData,
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
                                setOwnerData({
                                    ...ownerData,
                                    lastName: ''
                                });
                            };
                        }}
                        onClear={() => {

                            setOwnerData({
                                ...ownerData,
                                lastName: ''
                            });
                        }}
                    />
                    <MuiInput 
                        placeholder='Имя'
                        value={ownerData.name}
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

                            setOwnerData({
                                ...ownerData,
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
                                setOwnerData({
                                    ...ownerData,
                                    name: ''
                                });
                            };
                        }}
                        onClear={() => {

                            setOwnerData({
                                ...ownerData,
                                name: ''
                            });
                        }}
                    />
                    <MuiInput 
                        placeholder='Отчество'
                        value={ownerData.patronymic}
                        isError={isPatronymicError || isLatinPatronymicError}
                        errorMessage={isLatinPatronymicError ? 'Используйте русские буквы' : 'Заполните поле'}
                        style={s.mb32}
                        onChange={(e) => {

                            const value = e.nativeEvent.text;

                            if (/[a-zA-Z]/.test(value)) {
                                setIsLatinPatronymicError(true);
                            } else {
                                setIsLatinPatronymicError(false);
                            };

                            setOwnerData({
                                ...ownerData,
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
                                setOwnerData({
                                    ...ownerData,
                                    patronymic: ''
                                });
                            };
                        }}
                        onClear={() => {

                            setOwnerData({
                                ...ownerData,
                                patronymic: ''
                            });
                        }}
                    />
                    <MuiInput 
                        maxLength={10}
                        type={'datetime'}
                        keyboardType="numeric"
                        options={{
                            format: 'DD.MM.YYYY'
                        }}
                        {...{ RenderInput: TextInputMask }}
                        value={ownerData.birthDate}
                        placeholder='Дата рождения'
                        infoMessage='Сервис доступен лицам старше 18 лет'
                        errorMessage={isBirthDateFormatError ? 'Сервис доступен лицам старше 18 лет' : 'Это обязательное поле'}
                        isError={isBirthDateError || isBirthDateFormatError}
                        style={s.mb32}
                        onChange={(e) => {

                            const value = e.nativeEvent.text;

                            const valueWithDots = value.length >= 8 ? addDotsToDate(value) : value;

                            if (valueWithDots.length === 10) {

                                const isOlder18 = isOlderThan18(valueWithDots);

                                isOlder18 
                                ? 
                                    setIsBirthDateFormatError(false)
                                :
                                    setIsBirthDateFormatError(true)
                            };

                            setOwnerData({
                                ...ownerData,
                                birthDate: valueWithDots
                            });

                            setIsBirthDateError(false);
                        }}
                        onBlur={(e) => {

                            const value = e.nativeEvent.text;
                            
                            if (!value) {
                                setIsBirthDateError(true)
                            } else if (!checkIfDateValid(value) || !isOlderThan18(value)) {
                                setIsBirthDateFormatError(true);
                            }
                        }}
                        onClear={() => {

                            setOwnerData({
                                ...ownerData,
                                birthDate: ''
                            });

                            setIsBirthDateFormatError(false);
                        }}
                    />
                </View>
                <View style={[s.panel, s.mb16]}>
                    <Text style={[s.panel.title]}>
                        Паспорт
                    </Text>
                    <Text style={[s.defaultText, s.mb24]}>
                        Для подтверждения ваших данных и внесения их в договор приложите фотографии паспорта
                    </Text>
                    <MuiInput 
                        maxLength={10}
                        keyboardType="numeric"
                        value={ownerData.passportNumber}
                        errorMessage={isPassportNumberLengthError ? '10 символов' : 'Заполните поле'}
                        placeholder='Введите серию и номер без пробелов'
                        isError={isPassportNumberError || isPassportNumberLengthError}
                        style={s.mb32}
                        onChange={(e) => {

                            const value = e.nativeEvent.text;

                            (/^-?\d+$/.test(value) || value === '') && setOwnerData({
                                ...ownerData,
                                passportNumber: value
                            });

                            setIsPassportNumberError(false);
                            setIsPassportNumberLengthError(false);
                        }}
                        onBlur={(e) => {

                            const value = e.nativeEvent.text;

                            if (!value) {
                                setIsPassportNumberError(true)
                            } else if (value.length < 10) {
                                setIsPassportNumberLengthError(true);
                            }
                        }}
                        onClear={() => {

                            setOwnerData({
                                ...ownerData,
                                passportNumber: ''
                            });

                            setIsPassportNumberLengthError(false);
                        }}
                    />
                    <MuiInput 
                        maxLength={10}
                        type={'datetime'}
                        keyboardType="numeric"
                        options={{
                            format: 'DD.MM.YYYY'
                        }}
                        {...{ RenderInput: TextInputMask }}
                        value={ownerData.passportDate}
                        placeholder='Дата выдачи паспорта'
                        errorMessage={isPassportDateFormatError ? 'Некорректная дата' : 'Заполните поле'}
                        isError={isPassportDateError || isPassportDateFormatError}
                        style={s.mb32}
                        onChange={(e) => {

                            const value = e.nativeEvent.text;

                            const valueWithDots = value.length >= 8 ? addDotsToDate(value) : value;

                            setOwnerData({
                                ...ownerData,
                                passportDate: valueWithDots
                            });

                            setIsPassportDateError(false);
                            setIsPassportDateFormatError(false);

                        }}
                        onBlur={(e) => {

                            const value = e.nativeEvent.text;
                            
                            if (!value) {
                                setIsPassportDateError(true)
                            } else if (!checkIfDateValid(value)) {
                                setIsPassportDateFormatError(true);
                            }
                        }}
                        onClear={() => {

                            setOwnerData({
                                ...ownerData,
                                passportDate: ''
                            });

                            setIsPassportDateFormatError(false);
                        }}
                    />
                    <MuiInput 
                        value={ownerData.registrationAddress}
                        errorMessage='Заполните поле'
                        placeholder='Адрес регистрации, как в паспорте'
                        isError={isAddressError}
                        style={s.mb32}
                        onChange={(e) => {

                            const value = e.nativeEvent.text;

                            setOwnerData({
                                ...ownerData,
                                registrationAddress: value
                            });

                            setIsAddressError(false);

                        }}
                        onBlur={(e) => {

                            const value = e.nativeEvent.text;

                            const isEmpty = checkIfWhitespaceString(value);

                            if (!value || isEmpty) {
                                setIsAddressError(true)
                            };

                            if (isEmpty) {
                                setOwnerData({
                                    ...ownerData,
                                    registrationAddress: ''
                                });
                            };
                        }}
                        onClear={() => {

                            setOwnerData({
                                ...ownerData,
                                registrationAddress: ''
                            });
                        }}
                    />
                    <Text style={[s.defaultText, s.mb16, s.mt4, { fontSize: 14 }]}>
                        Приложите фотографии паспорта
                    </Text>
                    <PhotoLoaderSlim
                        name='passportFront'
                        style={s.mb32}
                        value={frontPassport}
                        label='Первый разворот паспорта'
                        onSelect={addPhoto((data) => Object.keys(data).length !== 0 && setFrontPassport(data))}
                    />
                    <PhotoLoaderSlim
                        name='passportBack'
                        value={backPassport}
                        label='Разворот паспорта с регистрацией'
                        onSelect={addPhoto((data) => Object.keys(data).length !== 0 && setBackPassport(data))}
                    />
                </View>
            </View>
        
            <View style={{
                opacity: isIndividual ? 0 : 1,
                position: isIndividual ? 'absolute' : 'relative',
                zIndex: isIndividual ? 0 : 1000,
                bottom: isIndividual ? 0 : 'auto',
            }}>
                <View style={[s.panel, s.mb24]}>
                    <Text style={[s.panel.title, s.mb24]}>
                        Данные компании
                    </Text>
                    <MuiInput 
                        value={ownerData.companyName}
                        errorMessage='Заполните поле'
                        placeholder='Название'
                        isError={isCompanyNameError}
                        style={s.mb32}
                        onChange={(e) => {

                            const value = e.nativeEvent.text;

                            setOwnerData({
                                ...ownerData,
                                companyName: value
                            });

                            setIsCompanyNameError(false);

                        }}
                        onBlur={(e) => {

                            const value = e.nativeEvent.text;

                            const isEmpty = checkIfWhitespaceString(value);

                            if (!value || isEmpty) {
                                setIsCompanyNameError(true)
                            };

                            if (isEmpty) {
                                setOwnerData({
                                    ...ownerData,
                                    companyName: ''
                                });
                            };
                        }}
                        onClear={() => {

                            setOwnerData({
                                ...ownerData,
                                companyName: ''
                            });
                        }}
                    />
                    <MuiInput 
                        maxLength={10}
                        value={ownerData.INN}
                        keyboardType='numeric'
                        errorMessage={isINNLengthError ? '10 символов' : 'Заполните поле'}
                        placeholder='ИНН'
                        isError={isINNError || isINNLengthError}
                        style={s.mb32}
                        onChange={(e) => {

                            const value = e.nativeEvent.text;

                            (/^-?\d+$/.test(value) || value === '') && setOwnerData({
                                ...ownerData,
                                INN: value
                            });

                            setIsINNError(false);
                            setIsINNLengthError(false);

                        }}
                        onBlur={(e) => {

                            const value = e.nativeEvent.text;
                            
                            if (!value) {
                                setIsINNError(true);
                            } else if (value.length < 10) {
                                setIsINNLengthError(true);
                            }
                        }}
                        onClear={() => {

                            setOwnerData({
                                ...ownerData,
                                INN: ''
                            });
                        }}
                    />
                    <MuiInput 
                        value={ownerData.legalAddress}
                        errorMessage='Заполните поле'
                        placeholder='Юридический адрес'
                        isError={isLegalAddressError}
                        style={s.mb16}
                        onChange={(e) => {

                            const value = e.nativeEvent.text;

                            setOwnerData({
                                ...ownerData,
                                legalAddress: value
                            });

                            setIsLegalAddressError(false);

                        }}
                        onBlur={(e) => {

                            const value = e.nativeEvent.text;

                            const isEmpty = checkIfWhitespaceString(value);

                            if (!value || isEmpty) {
                                setIsLegalAddressError(true)
                            };

                            if (isEmpty) {
                                setOwnerData({
                                    ...ownerData,
                                    legalAddress: ''
                                });
                            };
                        }}
                        onClear={() => {

                            setOwnerData({
                                ...ownerData,
                                legalAddress: ''
                            });
                        }}
                    />
                </View>
            </View>
            
            <PrimaryButton
                style={[ 
                    authStyles.submitBtn, 
                    s.resumeBtn, 
                    s.primaryBtn,
                    isSecondCar && {
                        marginTop: 60
                    },
                    { 
                        width: isSecondCar ? '70%' : 103, 
                        alignSelf: isSecondCar ? 'center' : 'flex-end', 
                    }]}
                title={isLoading ? <Waiter size='small' /> : (isSecondCar ? 'Добавить авто' : "Далее")}
                onPress={handleSubmit}
                disabled={
                    (
                        isIndividual
                        ?
                            (
                                !ownerData.lastName || 
                                !ownerData.name || 
                                !ownerData.patronymic ||
                                isLatinLastNameError ||
                                isLatinNameError ||
                                isLatinPatronymicError ||
                                ownerData.birthDate?.length !== 10 ||
                                isBirthDateFormatError ||
                                isPassportDateFormatError ||
                                ownerData.passportNumber?.length !== 10 ||
                                ownerData.passportDate?.length !== 10 ||
                                !ownerData.registrationAddress ||
                                !frontPassport ||
                                !backPassport ||
                                checkIfWhitespaceString(ownerData.lastName) ||
                                checkIfWhitespaceString(ownerData.name) ||
                                checkIfWhitespaceString(ownerData.patronymic) ||
                                checkIfWhitespaceString(ownerData.registrationAddress)
                            )
                        :
                            (
                                !ownerData.companyName ||
                                ownerData.INN?.length !== 10 ||
                                !ownerData.legalAddress ||
                                checkIfWhitespaceString(ownerData.companyName) ||
                                checkIfWhitespaceString(ownerData.legalAddress)
                            )
                    )
                }
            />
        </ScrollView>
    )
};

export default OwnerDataHostReg;
