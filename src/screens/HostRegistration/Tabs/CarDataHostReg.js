import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { ScrollView, View, Text, Alert } from 'react-native';

import { 
    Waiter, 
    MuiInput, 
    BlurPopup,
    MuiSelect,
    PrimaryButton,
    WarningSvg
} from 'components';
import api from 'api';
import actions from 'actions';
import { TABS } from '../HostRegistration';
import bodyTypes from '../constants/bodyTypes';
import engineTypes from '../constants/engineTypes';
import { checkIfWhitespaceString } from 'functions';
import displacementTypes from '../constants/displacementTypes';
import transmissionTypes from '../constants/transmissionTypes';
import transmissionBoxTypes from '../constants/transmissionBoxTypes';

import CheckDriverSvg from '../media/check-driver-image.svg';
import CarNotFoundSvg from '../media/car-not-found-image.svg';

import s from '../styles';
import theme from 'theme';
import authStyles from '../../../screens/Auth/styles';

const CarDataHostReg = ({ 
    name, 
    navigation, 
    passedSteps, 
    setPassedSteps, 
    checkPTSSTSData, 
    onCarIdRequested,
    isSecondCar = false,
    isCreatedCarExist = false,
    isCheckDataCompleted 
}) => {

    const dispatch = useDispatch();

    const role = useSelector(st => st.profile.role);

    const [licensePlateNumber, setLicensePlateNumber] = useState('');
    const [isLicensePlateNumberError, setIsLicensePlateNumberError] = useState('');
    
    const [isLatinInputError, setIsLatinInputError] = useState('');

    const [isCheckDataModalVisible, setIsCheckDataModalVisible] = useState(false);
    const [isCarNotFoundModalVisible, setIsCarNotFoundModalVisible] = useState(false);

    const [isCarDataStepVisible, setIsCarDataStepVisible] = useState(false);

    const [carId, setCarId] = useState('');
    const [carData, setCarData] = useState({});

    const [isCreateFailed, setIsCreateFailed] = useState(false);
    const [isJustCreated, setIsJustCreated] = useState(false);
    const [isAlreadyCreated, setIsAlreadyCreated] = useState(false); // host has a car
    const [isAlreadyExist, setIsAlreadyExist] = useState(false); // host add a same car

    const [isGetCarDataCalledSecondTime, setIsGetCarDataCalledSecondTime] = useState(false);

    const [isSeatsNumberError, setIsSeatsNumberError] = useState(false);
    const [isBrandError, setIsBrandError] = useState(false);
    const [isModelError, setIsModelError] = useState(false);
    const [isYearError, setIsYearError] = useState(false);
    const [isVinError, setIsVinError] = useState(false);
    const [isBodyTypeError, setIsBodyTypeError] = useState(false);
    const [isEngineTypeError, setIsEngineTypeError] = useState(false);
    const [isEnginePowerError, setIsEnginePowerError] = useState(false);
    const [isEngineDisplacementError, setIsEngineDisplacementError] = useState(false);
    const [isTransmissionLayoutError, setIsTransmissionLayoutError] = useState(false);
    const [isTransmissionTypeError, setIsTransmissionTypeError] = useState(false);
    const [isPriceError, setIsPriceError] = useState(false);

    const [vinError, setVinError] = useState('');
    const [yearError, setYearError] = useState('');

    const [isLoading, setIsLoading] = useState(false);

    const checkIfRegNumberValid = (value) => (/^[АВЕКМНОРСТУХ]\d{3}(?<!000)[АВЕКМНОРСТУХ]{2}\d{2,3}$/.test(value));

    const getCarData = async () => {

        setIsCreateFailed(false);

        try {
                        
            const res = await api.web.host.getCar();

            if (!!res?.uuid) {

                setCarId(res.uuid);

                onCarIdRequested(res.uuid);

                if (
                    !res.seatsQuantity &&
                    !res.brand &&
                    !res.model &&
                    !res.vin &&
                    !res.bodyType &&
                    !res.engineType &&
                    !res.engineDisplacement &&
                    !res.enginePower &&
                    !res.transmissionType &&
                    !res.transmissionLayout &&
                    !res.price
                ) {

                    if (isSecondCar) {

                        setIsCarDataStepVisible(true);
                        setIsCheckDataModalVisible(false);

                        !isCreatedCarExist && setTimeout(() => setIsCarNotFoundModalVisible(true), 500);

                    } else {

                        if (isGetCarDataCalledSecondTime) {
    
                            setIsCheckDataModalVisible(false);
                            isJustCreated && setTimeout(() => setIsCarNotFoundModalVisible(true), 500);
                            
                        } else {
                            // useEffect 182
                            setIsGetCarDataCalledSecondTime(true);
                        };
                    };

                } else if (
                    res.seatsQuantity &&
                    res.brand &&
                    res.model &&
                    res.vin &&
                    res.bodyType &&
                    res.engineType &&
                    res.engineDisplacement &&
                    res.enginePower &&
                    res.transmissionType &&
                    res.transmissionLayout &&
                    res.price
                ) {

                    checkPTSSTSData(res.uuid, passedSteps, isSecondCar);

                } else {

                    const productionYear = res.productionYear <= 0 ? '' : res.productionYear;
                    const price = res.price <= 0 ? '' : res.price;
                    
                    setCarData({
                        seatsQuantity: res.seatsQuantity ?? '',
                        brand: res.brand ?? '',
                        model: res.model ?? '',
                        productionYear: productionYear ?? '',
                        vin: res.vin ?? '',
                        bodyType: res.bodyType ?? '',
                        engineType: res.engineType ?? '',
                        enginePower: res.enginePower ?? '',
                        engineDisplacement: res.engineDisplacement ?? '',
                        transmissionLayout: res.transmissionLayout ?? '',
                        transmissionType: res.transmissionType ?? '',
                        price: price ?? '',
                    });

                    !res.seatsQuantity && setIsSeatsNumberError(true);
                    !res.brand && setIsBrandError(true);
                    !res.model && setIsModelError(true);
                    !productionYear && setIsYearError(true);
                    !res.vin && setIsVinError(true);
                    !res.bodyType && setIsBodyTypeError(true);
                    !res.engineType && setIsEngineTypeError(true);
                    !res.enginePower && setIsEnginePowerError(true);
                    !res.engineDisplacement && setIsEngineDisplacementError(true);
                    !res.transmissionLayout && setIsTransmissionLayoutError(true);
                    !res.transmissionType && setIsTransmissionTypeError(true);
                    !price && setIsPriceError(true);

                    setIsCheckDataModalVisible(false);
                    setIsCarDataStepVisible(true);
                }

            } else {
                throw res.error
            }

        } catch (error) {
            
            console.log(error);

            if (isSecondCar) {

                setIsAlreadyCreated(false);
                setIsCheckDataModalVisible(false);

            } else {

                setIsCheckDataModalVisible(false);
                setTimeout(() => setIsCarNotFoundModalVisible(true), 500);
            };

        } finally {
            !isSecondCar && setIsCarDataStepVisible(true);
        }
    };
    
    const createCar = async () => {

        setIsAlreadyExist(false);
        setIsCheckDataModalVisible(true);

        try {

            const res = await api.web.host.createCar(licensePlateNumber);

            if (!!res?.car?.uuid) {                

                dispatch(actions.profileRequest());
                dispatch(actions.getCarsList());

                setIsJustCreated(true);

                setTimeout( async () => getCarData(), 15000);

            } else {
                throw res.error;
            };
            
        } catch (error) {

            console.log(error);
            
            setTimeout(() => {

                setIsCheckDataModalVisible(false);

                if (error.statusCode === 409) {

                    setIsAlreadyExist(true);
                    setTimeout(() => setIsCarNotFoundModalVisible(true), 500);
    
                } else {

                    setIsCreateFailed(true);
                    setTimeout(() => setIsCarNotFoundModalVisible(true), 500);
                }; 
            }, 500);
        };
    };
    
    const handleSubmit = async () => {

        setIsLoading(true);

        let data = Object.assign({}, carData);

        data.seatsQuantity = Number(data.seatsQuantity);
        data.productionYear = Number(data.productionYear);
        data.price = Number(data.price.toString().replace(/ /g, ""));

        try {

            const res = await api.web.host.sendCarParameters(carId, data);

            if (!res?.error) {

                navigation.navigate(TABS.CAR_DOCUMENTS);
                setPassedSteps();

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
        isGetCarDataCalledSecondTime && setTimeout(() => getCarData(), role === 'OBSERVER' ? 15000 : 1000);
    }, [isGetCarDataCalledSecondTime]);

    React.useEffect(() => {
        
        if (role === 'HOST') {
            
            if (!isSecondCar) {
                setIsAlreadyCreated(true);
                setIsCheckDataModalVisible(true);
            };
            
            setTimeout(() => getCarData(), 1000);
        }

    }, []);
    
    React.useEffect(() => {

        if (isCreatedCarExist) {
            setIsCheckDataModalVisible(true);
        };

    }, [isCreatedCarExist]);

    React.useEffect(() => {
        isCheckDataCompleted && setIsCheckDataModalVisible(false);
    }, [isCheckDataCompleted]);
    
    return (
        <>
            <ScrollView name={name} style={s.scrollView}>
                <Text style={[ authStyles.header, { marginBottom: 24 } ]}>
                    Данные автомобиля
                </Text>
                {
                    !isCarDataStepVisible && !isAlreadyCreated
                    ?
                        <View style={s.panel}>
                            <Text style={s.panel.title}>
                                Введите госномер автомобиля
                            </Text>
                            <View style={[s.row, s.mb16]}>
                                <WarningSvg 
                                    style={s.mr6} 
                                    color={isLatinInputError ? theme.colors.red : theme.colors.svgLightGrey} 
                                />
                                <Text style={[
                                    s.panel.infoMessage,
                                    isLatinInputError && { color: theme.colors.red }
                                ]}>
                                    Используйте русские буквы
                                </Text>
                            </View>
                            <MuiInput 
                                withoutUpLabel
                                value={licensePlateNumber}
                                placeholder='А000АА999'
                                isError={isLicensePlateNumberError}
                                errorMessage='Неверный формат номера'
                                style={isLicensePlateNumberError ? s.mb32 : s.mb16}
                                onChange={(e) => {

                                    const value = e.nativeEvent.text;

                                    setLicensePlateNumber(value.toUpperCase());

                                    if (/[a-zA-Z]/.test(value)) {
                                        setIsLatinInputError(true);
                                    } else {
                                        setIsLatinInputError(false);
                                    };

                                    if (checkIfRegNumberValid(value) || value.length === 0) {
                                        setIsLicensePlateNumberError(false);
                                    };

                                    setIsLicensePlateNumberError(false);
                                }}
                                onBlur={(e) => {

                                    const value = e.nativeEvent.text;

                                    if (!checkIfRegNumberValid(value)) {
                                        setIsLicensePlateNumberError(true)
                                    };
                                }}
                            />
                            <View style={s.row}>
                                <PrimaryButton
                                    title="Продолжить"
                                    style={[s.panel.resumeBtn]}
                                    onPress={() => {

                                        if (!checkIfRegNumberValid(licensePlateNumber)) {
                                            setIsLicensePlateNumberError(true)
                                        } else {
                                            setIsLicensePlateNumberError(false);
                                            createCar();
                                        }
                                    }}
                                    disabled={
                                        isLatinInputError ||
                                        licensePlateNumber === ''
                                    }
                                />
                                <Text style={[s.defaultText, { flexShrink: 1, fontSize: 11.5 }]}>
                                    Автомобиль должен быть зарегистрирован в РФ.
                                </Text>
                            </View>
                        </View>
                    :
                        <>
                            <View style={[s.panel, s.mb24]}>
                                <Text style={[s.panel.title, s.mb24]}>
                                    Данные автомобиля
                                </Text>
                                {
                                    (
                                        !!carData?.productionYear && 
                                        carData?.productionYear.toString().length === 4 &&
                                        !checkIfWhitespaceString(carData?.productionYear) &&
                                        carData?.productionYear < 2013
                                    )
                                    &&
                                        <View style={[s.row, s.mb24, { alignItems: 'flex-start'}]}>
                                            <WarningSvg 
                                                style={[s.mr6, { top: 4 }]} 
                                                color={theme.colors.red} 
                                            />
                                            <Text style={s.panel.infoMessage}>
                                                Ваш автомобиль старше 2013 года выпуска. К сожалению, вы не сможете воспользоваться услугой страхования КАСКО на время аренды
                                            </Text>
                                        </View>
                                }
                                <MuiInput 
                                    maxLength={1}
                                    keyboardType="numeric"
                                    errorMessage='Заполните поле'
                                    placeholder='Кол-во мест (с водителем)'
                                    value={carData.seatsQuantity?.toString()}
                                    isError={isSeatsNumberError}
                                    style={s.mb32}
                                    onChange={(e) => {

                                        const value = e.nativeEvent.text;

                                        (/^-?\d+$/.test(value) || value === '') && setCarData({
                                            ...carData,
                                            seatsQuantity: value
                                        });

                                        if (Number(value) < 1) {
                                            setIsSeatsNumberError(true);
                                        } else {
                                            setIsSeatsNumberError(false);                                            
                                        };
                                    }}
                                    onBlur={(e) => {

                                        const value = e.nativeEvent.text;

                                        if (!value) {
                                            setIsSeatsNumberError(true)
                                        };
                                    }}
                                    onClear={() => {

                                        setCarData({
                                            ...carData,
                                            seatsQuantity: ''
                                        });
                                    }}
                                />
                                <MuiInput 
                                    maxLength={40}
                                    value={carData.brand}
                                    errorMessage='Заполните поле'
                                    placeholder='Марка'
                                    isError={isBrandError}
                                    style={s.mb32}
                                    onChange={(e) => {

                                        const value = e.nativeEvent.text;

                                        setCarData({
                                            ...carData,
                                            brand: value
                                        });

                                        setIsBrandError(false);

                                    }}
                                    onBlur={(e) => {

                                        const value = e.nativeEvent.text;

                                        const isEmpty = checkIfWhitespaceString(value);

                                        if (!value || isEmpty) {
                                            setIsBrandError(true)
                                        };

                                        if (isEmpty) {
                                            setCarData({
                                                ...carData,
                                                brand: ''
                                            });
                                        };
                                    }}
                                    onClear={() => {

                                        setCarData({
                                            ...carData,
                                            brand: ''
                                        });
                                    }}
                                />
                                <MuiInput 
                                    maxLength={40}
                                    value={carData.model}
                                    errorMessage='Заполните поле'
                                    placeholder='Модель'
                                    isError={isModelError}
                                    style={s.mb32}
                                    onChange={(e) => {

                                        const value = e.nativeEvent.text;

                                        setCarData({
                                            ...carData,
                                            model: value
                                        });

                                        setIsModelError(false);

                                    }}
                                    onBlur={(e) => {

                                        const value = e.nativeEvent.text;

                                        const isEmpty = checkIfWhitespaceString(value);

                                        if (!value || isEmpty) {
                                            setIsModelError(true)
                                        };

                                        if (isEmpty) {
                                            setCarData({
                                                ...carData,
                                                model: ''
                                            });
                                        };
                                    }}
                                    onClear={() => {

                                        setCarData({
                                            ...carData,
                                            model: ''
                                        });
                                    }}
                                />
                                <MuiInput 
                                    maxLength={4}
                                    keyboardType='numeric'
                                    value={carData.productionYear?.toString()}
                                    errorMessage={!!yearError ? yearError : 'Заполните поле'}
                                    placeholder='Год'
                                    isError={isYearError || !!yearError}
                                    style={s.mb32}
                                    onChange={(e) => {

                                        const value = e.nativeEvent.text;

                                        (/^-?\d+$/.test(value) || value === '') && setCarData({
                                            ...carData,
                                            productionYear: value
                                        });

                                        const currentDate = new Date();
                                        const currentYear = currentDate.getFullYear();

                                        if (value > currentYear) {
                                            setYearError('Вашу машину еще не собрали :)');
                                        } else {
                                            setYearError('');
                                        };

                                        if (value < 1) {
                                            setIsYearError(true);
                                        } else {
                                            setIsYearError(false);
                                        };
                                    }}
                                    onBlur={(e) => {

                                        const value = e.nativeEvent.text;

                                        if (!value || Number(value) < 1000) {
                                            setIsYearError(true)
                                        };
                                    }}
                                    onClear={() => {

                                        setCarData({
                                            ...carData,
                                            productionYear: ''
                                        });
                                    }}
                                />
                                <MuiInput 
                                    maxLength={17}
                                    value={carData.vin}
                                    errorMessage={!!vinError ? vinError : 'Заполните поле'}
                                    placeholder='VIN номер'
                                    isError={isVinError || !!vinError}
                                    style={s.mb32}
                                    onChange={(e) => {

                                        const value = e.nativeEvent.text;
                                        
                                        if (/[а-яА-Я]/.test(value)) {
                                            setVinError('Латинские буквы и цифры');
                                        } else {
                                            setVinError('');
                                        };

                                        setCarData({
                                            ...carData,
                                            vin: value.toUpperCase().replace(/ /g,'')
                                        });

                                        setIsVinError(false);
                                    }}
                                    onBlur={(e) => {

                                        const value = e.nativeEvent.text;

                                        if (!value) {
                                            setIsVinError(true)
                                        } else {
                                            
                                            if (value.length < 17) {
                                                setVinError('17 символов');
                                            };
                                        }
                                    }}
                                    onClear={() => {

                                        setCarData({
                                            ...carData,
                                            vin: ''
                                        });

                                        setVinError('');
                                    }}
                                />
                                <MuiSelect 
                                    label='Тип кузова'
                                    value={carData.bodyType}
                                    isError={isBodyTypeError}
                                    errorMessage='Заполните поле'
                                    options={bodyTypes.map((bodyType) => ({
                                        label: bodyType.label,
                                        value: bodyType.value,
                                    }))}
                                    style={s.mb32}
                                    onChange={(type) => {
                                        setCarData({
                                            ...carData,
                                            bodyType: type,
                                        });
                                        setIsBodyTypeError(false);
                                    }}
                                />
                                <MuiSelect 
                                    label='Тип двигателя'
                                    value={carData.engineType}
                                    isError={isEngineTypeError}
                                    errorMessage='Заполните поле'
                                    options={engineTypes.map((engineType) => ({
                                        label: engineType.label,
                                        value: engineType.value,
                                    }))}
                                    style={s.mb32}
                                    onChange={(type) => {
                                        setCarData({
                                            ...carData,
                                            engineType: type,
                                        });
                                        setIsEngineTypeError(false);
                                    }}
                                />
                                <MuiInput 
                                    maxLength={4}
                                    keyboardType="numeric"
                                    value={carData.enginePower}
                                    errorMessage='Заполните поле'
                                    placeholder='Мощность двигателя, л.с.'
                                    isError={isEnginePowerError}
                                    postfix='л. с.'
                                    style={s.mb32}
                                    onChange={(e) => {

                                        const value = e.nativeEvent.text;

                                        (/^-?\d+$/.test(value) || value === '') && setCarData({
                                            ...carData,
                                            enginePower: value
                                        });

                                        if (Number(value) < 1) {
                                            setIsEnginePowerError(true);
                                        } else {
                                            setIsEnginePowerError(false);
                                        }
                                    }}
                                    onBlur={(e) => {

                                        const value = e.nativeEvent.text;

                                        if (!value) {
                                            setIsEnginePowerError(true)
                                        };
                                    }}
                                    onClear={() => {

                                        setCarData({
                                            ...carData,
                                            enginePower: ''
                                        });
                                    }}
                                />
                                <MuiSelect 
                                    label='Объем двигателя'
                                    value={carData.engineDisplacement}
                                    isError={isEngineDisplacementError}
                                    errorMessage='Заполните поле'
                                    options={displacementTypes.map((displacementType) => ({
                                        label: displacementType.label,
                                        value: displacementType.value,
                                    }))}
                                    style={s.mb32}
                                    onChange={(type) => {
                                        setCarData({
                                            ...carData,
                                            engineDisplacement: type,
                                        });
                                        setIsEngineDisplacementError(false);
                                    }}
                                />
                                <MuiSelect 
                                    label='Привод'
                                    value={carData.transmissionLayout}
                                    isError={isTransmissionLayoutError}
                                    errorMessage='Заполните поле'
                                    options={transmissionBoxTypes.map((transmissionLayout) => ({
                                        label: transmissionLayout.label,
                                        value: transmissionLayout.value,
                                    }))}
                                    style={s.mb32}
                                    onChange={(type) => {
                                        setCarData({
                                            ...carData,
                                            transmissionLayout: type,
                                        });
                                        setIsTransmissionLayoutError(false);
                                    }}
                                />
                                <MuiSelect 
                                    label='Коробка передач'
                                    value={carData.transmissionType}
                                    isError={isTransmissionTypeError}
                                    errorMessage='Заполните поле'
                                    options={transmissionTypes.map((transmissionType) => ({
                                        label: transmissionType.label,
                                        value: transmissionType.value,
                                    }))}
                                    style={s.mb32}
                                    onChange={(type) => {
                                        setCarData({
                                            ...carData,
                                            transmissionType: type,
                                        });
                                        setIsTransmissionTypeError(false);
                                    }}
                                />
                                <MuiInput 
                                    maxLength={11}
                                    keyboardType="numeric"
                                    value={carData.price?.toString()}
                                    errorMessage='Заполните поле'
                                    placeholder='Текущая рыночная стоимость авто'
                                    isError={isPriceError}
                                    postfix='₽'
                                    style={s.mb16}
                                    onChange={(e) => {

                                        const value = e.nativeEvent.text;

                                        const numericValue = value.replace(/[^0-9]/g, '');
                                        const formattedValue = numericValue.replace(/\B(?=(\d{3})+(?!\d))/g, ' ');

                                        setCarData({
                                            ...carData,
                                            price: formattedValue
                                        });

                                        if (numericValue < 1) {
                                            setIsPriceError(true);
                                        } else {
                                            setIsPriceError(false);
                                        };
                                    }}
                                    onBlur={(e) => {

                                        const value = e.nativeEvent.text;

                                        if (!value) {
                                            setIsPriceError(true)
                                        };
                                    }}
                                    onClear={() => {

                                        setCarData({
                                            ...carData,
                                            price: ''
                                        });
                                    }}
                                />
                            </View>
                            <PrimaryButton
                                style={[ authStyles.submitBtn, s.resumeBtn, s.primaryBtn, { width: 103, alignSelf: 'flex-end' }]}
                                title={isLoading ? <Waiter size='small' /> : "Далее" }
                                onPress={handleSubmit}
                                disabled={
                                    !carData.seatsQuantity ||
                                    !carData.brand ||
                                    !carData.model ||
                                    carData.productionYear?.toString().length !== 4 ||
                                    carData.vin?.length !== 17 ||
                                    !carData.bodyType ||
                                    !carData.engineType ||
                                    !carData.enginePower ||
                                    !carData.engineDisplacement ||
                                    !carData.transmissionLayout ||
                                    !carData.transmissionType ||
                                    !carData.price ||
                                    isSeatsNumberError ||
                                    isYearError ||
                                    isEnginePowerError ||
                                    isPriceError ||
                                    !!vinError ||
                                    !!yearError ||
                                    checkIfWhitespaceString(carData.brand) ||
                                    checkIfWhitespaceString(carData.model)
                                }
                            />
                        </>
                }
            </ScrollView>
            <BlurPopup
                blurAmount={4}
                closable={false}
                visible={isCheckDataModalVisible}
                withBlur={Platform.OS === 'ios'}
            >
                <CheckDriverSvg />

                <Text style={[ authStyles.header, s.secondaryHeader, { marginVertical: 16, marginTop: 32, textAlign: 'center' } ]}>
                    {(isAlreadyCreated || isCreatedCarExist) ? 'Подготавливаем данные' : 'Проверяем данные...'}
                </Text>

                <Text style={s.text}>
                    {(isAlreadyCreated || isCreatedCarExist) ? 'Буквально несколько секунд…' : 'Может занять пару минут, но обычно не дольше 15 секунд'}
                    
                </Text>

                <View style={s.popupFooter}>
                    <Waiter size='small' />
                </View>
            </BlurPopup>
            <BlurPopup
                visible={isCarNotFoundModalVisible}
                onClose={() => setIsCarNotFoundModalVisible(false)}
            >
                <CarNotFoundSvg />

                {
                    isAlreadyExist
                    ?
                        <Text style={[ authStyles.header, s.secondaryHeader, { marginVertical: 16, marginTop: 32, textAlign: 'center' } ]}>
                            Такая машина уже зарегистрирована 
                        </Text>
                    :
                        <View>
                            <Text style={[ authStyles.header, s.secondaryHeader, { marginVertical: 16, marginTop: 32, textAlign: 'center' } ]}>
                                {isCreateFailed ? 'Произошла ошибка' : 'Машина не найдена'}
                            </Text>
                            <Text style={s.text}>
                                {isCreateFailed ? 'Попробуйте позже' : 'Заполните все данные вручную'}
                            </Text>
                        </View>
                }


                <View style={s.popupFooter}>

                    <PrimaryButton
                        style={[ authStyles.submitBtn, s.primaryBtn, { width: 160 } ]}
                        title='Продолжить'
                        onPress={() => setIsCarNotFoundModalVisible(false)}
                    />
                </View>
            </BlurPopup>
        </>
    )
};

export default CarDataHostReg;
