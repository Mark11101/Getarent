import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { SafeAreaView, Text, ScrollView, View } from 'react-native';

import api from 'api';
import actions from 'actions';
import InputComponent from '../components/Input/Input';
import RegCarHeader from '../components/Header/RegCarHeader';
import { Thumbnail, PhotoLoader, RadioButton } from 'components';
import NavigationButtons from '../components/NavigationButtons/NavigationButtons';

import s from './styles';
import theme from 'theme';

const RegCarDocuments = () => {

    const dispatch = useDispatch();

    const { 
        frontSidePassport,
        registrationSidePassport,
        isEPTS,
        seriesEPTS,
        numberEPTS,
        seriesPTS,
        numberPTS,
        frontSidePTS,
        backSidePTS,
        frontSideSTS,
        backSideSTS,
    } = useSelector(st => st.carRegistration);

    const [passportMainPage, setPassportMainPage] = useState(frontSidePassport);
    const [passportRegistrationPage, setPassportRegistrationPage] = useState(registrationSidePassport);
    const [ptsFrontPage, setPtsFrontPage] = useState(frontSidePTS);
    const [ptsBackPage, setPtsBackPage] = useState(backSidePTS);
    const [stsFrontPage, setStsFrontPage] = useState(frontSideSTS);
    const [stsBackPage, setStsBackPage] = useState(backSideSTS);

    const [isElectronicPTS, setIsElectronicPTS] = useState(isEPTS);

    const [inputSeriesEPTS, setInputSeriesEPTS] = useState(seriesEPTS);
    const [inputNumberEPTS, setInputNumberEPTS] = useState(numberEPTS);
    const [inputSeriesPTS, setInputSeriesPTS] = useState(seriesPTS);
    const [inputNumberPTS, setInputNumberPTS] = useState(numberPTS);

    const [isEptsSeriaError, setIsEptsSeriaError] = useState(false);
    const [isEptsNumberError, setIsEptsNumberError] = useState(false);
    const [isPtsSeriaError, setIsPtsSeriaError] = useState(false);
    const [isPtsNumberError, setIsPtsNumberError] = useState(false);

    const saveData = () => {

        if (isElectronicPTS) {

            dispatch(actions.updateCarRegistrationData({
                frontSidePassport: passportMainPage,
                registrationSidePassport: passportRegistrationPage,
                isEPTS: true,
                seriesEPTS: inputSeriesEPTS,
                numberEPTS: inputNumberEPTS,
                seriesPTS: '',
                numberPTS: '',
                frontSideSTS: stsFrontPage,
                backSideSTS: stsBackPage,
            }));

            setInputSeriesPTS('');
            setInputNumberPTS('');

        } else {

            dispatch(actions.updateCarRegistrationData({
                frontSidePassport: passportMainPage,
                registrationSidePassport: passportRegistrationPage,
                isEPTS: false,
                seriesEPTS: '',
                numberEPTS: '',
                seriesPTS: inputSeriesPTS,
                numberPTS: inputNumberPTS,
                frontSidePTS: ptsFrontPage,
                backSidePTS: ptsBackPage,
                frontSideSTS: stsFrontPage,
                backSideSTS: stsBackPage,
            }));

            setInputSeriesEPTS('');
            setInputNumberEPTS('');
        };
    }

    const handlePressResume = () => {

        api.navigation.navigate('RegCarParametrs');
        saveData();
    };

    const isPassportMainPageLoaded = Object.keys(passportMainPage).length !== 0;
    const isPassportRegistrationPageLoaded = Object.keys(passportRegistrationPage).length !== 0;

    const isPtsFrontPage = Object.keys(ptsFrontPage).length !== 0;
    const isPtsBackPage = Object.keys(ptsBackPage).length !== 0;
    const isStsFrontPage = Object.keys(stsFrontPage).length !== 0;
    const isStsBackPage = Object.keys(stsBackPage).length !== 0;

    return (
        <SafeAreaView style={s.safeArea}>
            <ScrollView style={s.container}>
                <View style={s.section}>
                    <RegCarHeader 
                        title='Паспорт'
                        screenNumber={3}
                    />
                    <View style={s.photos}>
                        {
                            isPassportMainPageLoaded
                            ?
                                <Thumbnail
                                    style={s.thumbnail}
                                    resizeMode="cover"
                                    source={{ uri: passportMainPage.path }}
                                    onPressDelete={() => setPassportMainPage({})}
                                />
                            :
                                <PhotoLoader
                                    asFormData
                                    name="photo"
                                    style={s.photo}
                                    textStyle={s.photoText}
                                    iconColor={theme.colors.white}
                                    text='Главная страница паспорта'
                                    onSelectFormData={(photo) => setPassportMainPage(photo)}
                                />
                        }
                        {
                            isPassportRegistrationPageLoaded
                            ?
                                <Thumbnail
                                    resizeMode="cover"
                                    style={s.thumbnail}
                                    source={{ uri: passportRegistrationPage.path }}
                                    onPressDelete={() => setPassportRegistrationPage({})}
                                />
                            :
                                <PhotoLoader
                                    asFormData
                                    name="photo"
                                    style={s.photo}
                                    textStyle={s.photoText}
                                    iconColor={theme.colors.white}
                                    text='Страница регистрации паспорта'
                                    onSelectFormData={(photo) => setPassportRegistrationPage(photo)}
                                />
                        }
                    </View>
                </View>
                <View style={s.section}>
                    <Text style={s.title}>
                        ПТС
                    </Text>
                    <View style={s.radioBtns}>
                        <RadioButton
                            white
                            label='Электронный ПТС' 
                            checked={isElectronicPTS} 
                            style={{ marginRight: 20 }}
                            labelStyle={s.radionBtnText}
                            onPress={() => {
                                setIsElectronicPTS(true);
                            }}
                        />
                        <RadioButton
                            white
                            label='Старый ПТС' 
                            checked={!isElectronicPTS} 
                            labelStyle={s.radionBtnText}
                            onPress={() => {
                                setIsElectronicPTS(false);
                            }}
                        />
                    </View>
                    {
                        isElectronicPTS
                        ?
                            <>
                                <InputComponent 
                                    maxLength={4}
                                    label='Серия ЭПТС'
                                    error={isEptsSeriaError}
                                    keyboardType='numeric'
                                    value={inputSeriesEPTS}
                                    placeholder='Первые 4 символа'
                                    onChange={(e) => {

                                        const value = e.nativeEvent.text;

                                        setInputSeriesEPTS(value);

                                        if (value.length === 4 || value.length === 0) {
                                            setIsEptsSeriaError(false)
                                        }
                                    }}
                                    onEndEditing={(e) => {
        
                                        const value = e.nativeEvent.text;
                                        
                                        if (value.length < 4) {
                                            setIsEptsSeriaError(true)
                                        };
                                    }}
                                />
                                <InputComponent 
                                    maxLength={11}
                                    error={isEptsNumberError}
                                    label='Номер ЭПТС'
                                    keyboardType='numeric'
                                    value={inputNumberEPTS}
                                    placeholder='Следующие 11 символов'
                                    onChange={(e) => {

                                        const value = e.nativeEvent.text;

                                        setInputNumberEPTS(value);

                                        if (value.length === 11 || value.length === 0) {
                                            setIsEptsNumberError(false)
                                        }
                                    }}
                                    onEndEditing={(e) => {
        
                                        const value = e.nativeEvent.text;
                                        
                                        if (value.length < 11) {
                                            setIsEptsNumberError(true)
                                        };
                                    }}
                                />
                            </>
                        :
                            <>
                                <InputComponent 
                                    maxLength={4}
                                    label='Серия ПТС'
                                    error={isPtsSeriaError}
                                    value={inputSeriesPTS}
                                    placeholder='Первые 4 символа'
                                    onChange={(e) => {

                                        const value = e.nativeEvent.text;

                                        setInputSeriesPTS(value);

                                        if (value.length === 4 || value.length === 0) {
                                            setIsPtsSeriaError(false)
                                        }
                                    }}
                                    onEndEditing={(e) => {
        
                                        const value = e.nativeEvent.text;
                                        
                                        if (value.length < 4) {
                                            setIsPtsSeriaError(true)
                                        };
                                    }}
                                />
                                <InputComponent 
                                    maxLength={6}
                                    error={isPtsNumberError}
                                    label='Номер ПТС'
                                    keyboardType='numeric'
                                    value={inputNumberPTS}
                                    style={{ marginBottom: 30 }}
                                    placeholder='Следующие 6 символов'
                                    onChange={(e) => {

                                        const value = e.nativeEvent.text;

                                        setInputNumberPTS(value);

                                        if (value.length === 6 || value.length === 0) {
                                            setIsPtsNumberError(false)
                                        }
                                    }}
                                    onEndEditing={(e) => {
        
                                        const value = e.nativeEvent.text;
                                        
                                        if (value.length < 6) {
                                            setIsPtsNumberError(true)
                                        };
                                    }}
                                />
                                <Text style={s.subTitle}>
                                    Фотографии
                                </Text>
                                <View style={s.photos}>
                                    {
                                        isPtsFrontPage
                                        ?
                                            <Thumbnail
                                                resizeMode="cover"
                                                style={s.thumbnail}
                                                source={{ uri: ptsFrontPage.path }}
                                                onPressDelete={() => setPtsFrontPage({})}
                                            />
                                        :
                                            <PhotoLoader
                                                asFormData
                                                name="photo"
                                                style={s.photo}
                                                textStyle={s.photoText}
                                                iconColor={theme.colors.white}
                                                text='Лицевая сторона документа'
                                                onSelectFormData={(photo) => setPtsFrontPage(photo)}
                                            />
                                    }
                                    {
                                        isPtsBackPage
                                        ?
                                            <Thumbnail
                                                style={s.thumbnail}
                                                resizeMode="cover"
                                                source={{ uri: ptsBackPage.path }}
                                                onPressDelete={() => setPtsBackPage({})}
                                            />
                                        :
                                            <PhotoLoader
                                                asFormData
                                                name="photo"
                                                style={s.photo}
                                                textStyle={s.photoText}
                                                iconColor={theme.colors.white}
                                                text='Обратная сторона документа'
                                                onSelectFormData={(photo) => setPtsBackPage(photo)}
                                            />
                                    }
                                </View>
                            </>
                    }
                </View>
                <View style={s.section}>
                    <Text style={s.title}>
                        СТС
                    </Text>
                    <Text style={s.helpText}>
                        Свидетельство о регистрации автомобиля необходимо для страхования ваших аренд на Getarent
                    </Text>
                    <View style={s.photos}>
                        {
                            isStsFrontPage
                            ?
                                <Thumbnail
                                    style={s.thumbnail}
                                    resizeMode="cover"
                                    source={{ uri: stsFrontPage.path }}
                                    onPressDelete={() => setStsFrontPage({})}
                                />
                            :
                                <PhotoLoader
                                    asFormData
                                    name="photo"
                                    style={s.photo}
                                    textStyle={s.photoText}
                                    iconColor={theme.colors.white}
                                    text='Лицевая сторона документа'
                                    onSelectFormData={(photo) => setStsFrontPage(photo)}
                                />
                        }
                        {
                            isStsBackPage
                            ?
                                <Thumbnail
                                    style={s.thumbnail}
                                    resizeMode="cover"
                                    source={{ uri: stsBackPage.path }}
                                    onPressDelete={() => setStsBackPage({})}
                                />
                            :
                                <PhotoLoader
                                    asFormData
                                    name="photo"
                                    style={s.photo}
                                    textStyle={s.photoText}
                                    iconColor={theme.colors.white}
                                    text='Обратная сторона документа'
                                    onSelectFormData={(photo) => setStsBackPage(photo)}
                                />
                        }
                    </View>
                </View>
                <NavigationButtons 
                    onPressResume={handlePressResume}
                    onPressBack={saveData}
                    disabledResume={
                        !isPassportMainPageLoaded ||
                        !isPassportRegistrationPageLoaded ||
                        (
                            isElectronicPTS && (!inputSeriesEPTS || !inputNumberEPTS)
                        ) ||
                        (
                            !isElectronicPTS && (!inputSeriesPTS || !inputNumberPTS || !isPtsFrontPage || !isPtsBackPage)
                        ) ||
                        !isStsFrontPage ||
                        !isStsBackPage ||
                        (
                            isElectronicPTS && (isEptsSeriaError || isEptsNumberError)
                        ) ||
                        (
                            !isElectronicPTS && (isPtsSeriaError || isPtsNumberError)
                        )
                    }
                />
            </ScrollView>
        </SafeAreaView>
    )
};

export default RegCarDocuments;
