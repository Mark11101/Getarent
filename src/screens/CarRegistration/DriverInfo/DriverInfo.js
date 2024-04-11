import { 
    View, 
    ScrollView, 
    SafeAreaView,
    KeyboardAvoidingView, 
} from 'react-native';
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import api from 'api';
import actions from 'actions';
import { RadioButton, Input } from 'components';
import RegCarHeader from '../components/Header/RegCarHeader';
import NavigationButtons from '../components/NavigationButtons/NavigationButtons';

import s from './styles';

const DriverInfo = () => {

    const dispatch = useDispatch();

    const { firstName, lastName } = useSelector(st => st.profile);

    const { 
        name,
        surname,
        patronymic,
        passport,
        address,
        companyName,
        INN,
        companyAddress,
        isIndividual,
    } = useSelector(st => st.carRegistration);

    const [inputName, setInputName] = useState(name);
    const [inputSurname, setInputSurname] = useState(surname);
    const [inputPatronymic, setInputPatronymic] = useState(patronymic);
    const [inputPassport, setInputPassport] = useState(passport);
    const [inputAddress, setInputAddress] = useState(address);

    const [inputINN, setInputINN] = useState(INN);
    const [inputCompanyName, setInputCompanyName] = useState(companyName);
    const [inputCompanyAddress, setInputCompanyAddress] = useState(companyAddress);

    const [isPassportError, setIsPassportError] = useState('');
    const [isINNError, setIsINNError] = useState('');

    const [isIndividualPerson, setIsIndividualPerson] = useState(isIndividual);

    useEffect(() => {

        if (!name && firstName) {

            setInputName(firstName);

            dispatch(actions.updateCarRegistrationData({
                name: firstName
            }));
        };

        if (!surname && lastName) {

            setInputSurname(lastName);

            dispatch(actions.updateCarRegistrationData({
                surname: lastName
            }));
        };

    }, [firstName, lastName]);

    const saveData = () => {

        if (isIndividualPerson) {

            dispatch(actions.updateCarRegistrationData({
                name: inputName,
                surname: inputSurname,
                patronymic: inputPatronymic,
                passport: inputPassport,
                address: inputAddress,
                companyName: '',
                INN: '',
                companyAddress: '',
                isIndividual: true,
            }));

            setInputCompanyName('');
            setInputINN('');
            setInputCompanyAddress('');

        } else {

            dispatch(actions.updateCarRegistrationData({
                name: '',
                surname: '',
                patronymic: '',
                passport: '',
                address: '',
                companyName: inputCompanyName,
                INN: inputINN,
                companyAddress: inputCompanyAddress,
                isIndividual: false,
            }));

            setInputName('');
            setInputSurname('');
            setInputPatronymic('');
            setInputPassport('');
            setInputAddress('');
        };
    }

    const handlePressResume = () => {
     
        api.navigation.navigate('RegCarDocuments');
        saveData();
    };
    
    return (
        <SafeAreaView style={s.safeArea}>
            <KeyboardAvoidingView
                style={{ flex: 1 }}
                behavior={Platform.OS === 'ios' ? 'padding' : null}
            >
                <ScrollView 
                    style={s.container}
                    keyboardShouldPersistTaps="handled"
                >
                    <View style={s.section}>
                        <RegCarHeader 
                            title='Владелец'
                            screenNumber={2}
                        />
                        <View style={s.personTypes}>
                            <RadioButton
                                white
                                label='Физическое лицо' 
                                checked={isIndividualPerson} 
                                labelStyle={s.radionBtnText}
                                onPress={() => setIsIndividualPerson(true)}
                            />
                            <RadioButton
                                white
                                label='Юридическое лицо' 
                                checked={!isIndividualPerson} 
                                labelStyle={s.radionBtnText}
                                onPress={() => setIsIndividualPerson(false)}
                            />
                        </View>
                        {
                            isIndividualPerson
                            ?
                                <>
                                    <Input 
                                        white
                                        label='Фамилия'
                                        style={s.input}
                                        value={inputSurname}
                                        placeholder='Иванов'
                                        labelStyle={s.labelStyle}
                                        inputStyle={s.inputStyle}
                                        onChange={(e) => {

                                            const text = e.nativeEvent.text; 

                                            !/[a-zA-Z]/.test(text)
                                            &&
                                                setInputSurname(text)
                                        }}
                                    />
                                    <Input 
                                        white
                                        label='Имя'
                                        style={s.input}
                                        value={inputName}
                                        placeholder='Иван'
                                        labelStyle={s.labelStyle}
                                        inputStyle={s.inputStyle}
                                        onChange={(e) => {

                                            const text = e.nativeEvent.text; 

                                            !/[a-zA-Z]/.test(text)
                                            &&
                                                setInputName(text)
                                        }}
                                    />
                                    <Input 
                                        white
                                        style={s.input}
                                        label='Отчество'
                                        placeholder='Иванович'
                                        value={inputPatronymic}
                                        labelStyle={s.labelStyle}
                                        inputStyle={s.inputStyle}
                                        onChange={(e) => {

                                            const text = e.nativeEvent.text; 

                                            !/[a-zA-Z]/.test(text)
                                            &&
                                                setInputPatronymic(text)
                                        }}
                                    />
                                    <Input 
                                        white
                                        maxLength={11}
                                        style={s.input}
                                        value={inputPassport}
                                        error={isPassportError}
                                        keyboardType='numeric'
                                        placeholder='---- ------'
                                        labelStyle={s.labelStyle}
                                        inputStyle={s.inputStyle}
                                        label='Серия и номер паспорта'
                                        onChange={(e) => {

                                            const value = e.nativeEvent.text;

                                            if (value.length === 11 || value.length === 0) {
                                                setIsPassportError(false);
                                            };
                                            
                                            if (value.length === 4 && inputPassport.length !== 5) {
                                                setInputPassport(value + ' ');
                                            } else {
                                                setInputPassport(value);
                                            };
                                        }}
                                        onEndEditing={(e) => {

                                            const value = e.nativeEvent.text;

                                            if (value.length < 11) {
                                                setIsPassportError(true);
                                            };
                                        }}
                                    />
                                    <Input 
                                        white
                                        style={s.input}
                                        value={inputAddress}
                                        label='Адрес регистрации'
                                        labelStyle={s.labelStyle}
                                        inputStyle={s.inputStyle}
                                        placeholder='Как указано в паспорте'
                                        onChange={(e) => {
                                            setInputAddress(e.nativeEvent.text)
                                        }}
                                    />
                                </>
                            :
                                <>
                                    <Input 
                                        white
                                        style={s.input}
                                        value={inputCompanyName}
                                        label='Название компании'
                                        labelStyle={s.labelStyle}
                                        inputStyle={s.inputStyle}
                                        placeholder='ООО "Гетарент"'
                                        onChange={(e) => {
                                            setInputCompanyName(e.nativeEvent.text)
                                        }}
                                    />
                                    <Input 
                                        white
                                        label='ИНН'
                                        maxLength={10}
                                        style={s.input}
                                        value={inputINN}
                                        error={isINNError}
                                        keyboardType='numeric'
                                        labelStyle={s.labelStyle}
                                        inputStyle={s.inputStyle}
                                        placeholder='Введите 10 цифр'
                                        onChange={(e) => {

                                            const value = e.nativeEvent.text;

                                            if (value.length === 10 || value.length === 0) {
                                                setIsINNError(false);
                                            };

                                            setInputINN(e.nativeEvent.text)
                                        }}
                                        onEndEditing={(e) => {

                                            const value = e.nativeEvent.text;

                                            if (value.length < 10 && value.length > 0) {

                                                setIsINNError(true);
                                            
                                            };
                                        }}
                                    />
                                    <Input 
                                        white
                                        style={s.input}
                                        label='Адрес компании'
                                        labelStyle={s.labelStyle}
                                        inputStyle={s.inputStyle}
                                        value={inputCompanyAddress}
                                        placeholder='Москва, Красная площадь, 1'
                                        onChange={(e) => {
                                            setInputCompanyAddress(e.nativeEvent.text)
                                        }}
                                    />
                                </>
                        }
                    </View>
                    <NavigationButtons 
                        onPressResume={handlePressResume}
                        onPressBack={saveData}
                        disabledResume={
                            isIndividualPerson && (
                                !inputName ||
                                !inputSurname ||
                                !inputPatronymic ||
                                !(inputPassport && inputPassport.length === 11) ||
                                !inputAddress
                            ) ||
                            !isIndividualPerson && (
                                !inputCompanyName ||
                                !(inputINN && inputINN.length === 10) ||
                                !inputCompanyAddress
                            )
                        }
                    />
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    )
};

export default DriverInfo;
