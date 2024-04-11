import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import { SafeAreaView, Text, ScrollView, View, KeyboardAvoidingView, Alert } from 'react-native';

import api from 'api';
import actions from 'actions';
import brands from './brands';
import InputComponent from '../components/Input/Input';
import SelectComponent from '../components/Select/Select';
import RegCarHeader from '../components/Header/RegCarHeader';
import NavigationButtons from '../components/NavigationButtons/NavigationButtons';

import s from './styles';

const RegCarParametrs = () => {

    const dispatch = useDispatch();

    const { cities } = useSelector(st => st.cities, shallowEqual);

    useEffect(() => {
		dispatch(actions.getCities());
	}, [dispatch]);

    const { 
        brand,
        model,
        year,
        price,
        city,
        registrationNumber,
        VINNumber,
    } = useSelector(st => st.carRegistration);

    const [inputBrand, setInputBrand] = useState(brand);
    const [inputModel, setInputModel] = useState(model);
    const [inputYear, setInputYear] = useState(year);
    const [inputCarPrice, setInputCarPrice] = useState(price);
    const [inputCity, setInputCity] = useState(city.value);
    const [inputRegistrationNumber, setInputRegistrationNumber] = useState(registrationNumber);
    const [inputVINNumber, setInputVINNumber] = useState(VINNumber);

    const [isRegistrationNumberError, setIsRegistrationNumberError] = useState(false);
    const [isVINNumberError, setIsVINNumberError] = useState(false);

    const checkIfRegNumberValid = (value) => (/^[АВЕКМНОРСТУХ]\d{3}(?<!000)[АВЕКМНОРСТУХ]{2}\d{2,3}$/.test(value));
    
    const saveData = () => {

        dispatch(actions.updateCarRegistrationData({
            brand: inputBrand,
            model: inputModel,
            year: inputYear,
            price: inputCarPrice,
            city: {
                value: inputCity,
                label: cities?.find((city) => city.id === inputCity)?.name,
            },
            registrationNumber: inputRegistrationNumber,
            VINNumber: inputVINNumber,
        }));
    };

    const handlePressResume = () => {

        api.navigation.navigate('RegCarСharacteristics');
        saveData();
    };

    return (
        <SafeAreaView style={s.safeArea}>
            <KeyboardAvoidingView
                style={{ flex: 1 }}
                behavior={Platform.OS === 'ios' ? 'padding' : null}
            >
                <ScrollView style={s.container}>
                    <RegCarHeader 
						title='Отлично!'
						screenNumber={4}
					/>
                    <Text style={s.subTitle}>
                        Теперь осталось добавить информацию о вашей машине 🙃
                    </Text>
                    <View style={s.inputs}>
                        <SelectComponent 
                            label='Марка'
                            search={true}
                            value={inputBrand}
                            options={Object.getOwnPropertyNames(brands).map(value => ({
                                label: value,
                                value,
                            }))}
                            onChange={setInputBrand}
                        />
                        <SelectComponent 
                            label='Модель'
                            search={true}
                            value={inputModel}
                            disabled={!inputBrand}
                            options={inputBrand ? brands[inputBrand].models.map(value => ({
                                label: value,
                                value,
                            })) : []}
                            onChange={setInputModel}
                        />
                        <SelectComponent 
                            label='Год'
                            value={inputYear}
                            options={[
                                // 1990, 1991, 1992, 1993, 1994, 1995, 1996, 1997, 1998, 1999, 2000, 2001,
                                // 2002, 2003, 2004, 2005, 2006, 2007, 2008, 2009, 2010, 2011, 2012,
                                2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023
                            ].reverse().map(value => ({
                                label: value,
                                value,
                            }))}
                            onChange={setInputYear}
                        />
                        <SelectComponent 
                            label='Город'
                            search={true}
                            value={inputCity}
                            options={!!cities && cities.length !== 0 ? cities.map(value => ({
                                label: value.name,
                                value: value.id,
                            })) : []}
                            onChange={setInputCity}
                        />
                        <InputComponent 
                            borderRadius={15}
                            value={inputCarPrice}
                            keyboardType='numeric'
                            inputStyle={s.inputStyle}
                            labelStyle={s.inputLabel}
                            label='Рыночная стоимость автомобиля, руб.'
                            onChange={(e) => {
                                setInputCarPrice(e.nativeEvent.text)
                            }}
                        />
                        <InputComponent 
                            maxLength={9}
                            borderRadius={15}
                            label='Гос. номер'
                            placeholder='А123АА77'
                            inputStyle={s.inputStyle}
                            labelStyle={s.inputLabel}
                            value={inputRegistrationNumber}
                            error={isRegistrationNumberError}
                            onChange={(e) => {

                                const value = e.nativeEvent.text;

                                // if (/[a-zA-Z]/.test(value)) {
                                //     Alert.alert('', 'Пожалуйста, переключите раскладку')
                                // };

                                setInputRegistrationNumber(value.toUpperCase());

                                if (checkIfRegNumberValid(value) || value.length === 0) {
                                    setIsRegistrationNumberError(false);
                                };
                            }}
                            onEndEditing={(e) => {

                                const value = e.nativeEvent.text;

                                if (!checkIfRegNumberValid(value)) {
                                    setIsRegistrationNumberError(true)
                                };
                            }}
                        />
                        <InputComponent 
                            maxLength={17}
                            label='Vin-номер'
                            borderRadius={15}
                            value={inputVINNumber}
                            error={isVINNumberError}
                            inputStyle={s.inputStyle}
                            labelStyle={s.inputLabel}
                            placeholder='Введите 17 знаков'
                            onChange={(e) => {

                                const value = e.nativeEvent.text;

                                if (/[а-яА-Я]/.test(value)) {
                                    Alert.alert('', 'Пожалуйста, переключите раскладку')
                                };

                                (/^[A-Za-z0-9][A-Za-z0-9]*$/.test(value) || !value)
                                &&
                                    setInputVINNumber(value.toUpperCase());

                                if (value.length === 17 || value.length === 0) {
                                    setIsVINNumberError(false)
                                }
                            }}
                            onEndEditing={(e) => {

                                const value = e.nativeEvent.text;
                                
                                if (value.length < 17) {
                                    setIsVINNumberError(true)
                                };
                            }}
                        />
                    </View>
                    <NavigationButtons 
                        onPressResume={handlePressResume}
                        onPressBack={saveData}
                        disabledResume={
                            !inputBrand ||
                            !inputModel ||
                            !inputYear ||
                            !inputCity ||
                            !inputCarPrice ||
                            !inputRegistrationNumber ||
                            !inputVINNumber ||
                            !checkIfRegNumberValid(inputRegistrationNumber) ||
                            inputVINNumber.length !== 17
                        }
                    />
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    )
};

export default RegCarParametrs;
