import React, { useState } from 'react';
import { TextInputMask } from 'react-native-masked-text';
import { ScrollView, View, Text, Alert } from 'react-native';

import api from 'api';
import { TABS } from '../HostRegistration';
import addPhoto from '../functions/addPhoto';
import addDotsToDate from '../functions/addDotsToDate';
import checkIfDateValid from '../functions/checkIfDateValid';
import assemblePhotoObject from '../functions/assemblePhotoObject';
import checkIfObjectNotEmpty from '../functions/checkIfObjectNotEmpty';
import convertISODateToDDMMYYYY from '../functions/convertISODateToDDMMYYYY';
import { RadioButton, MuiInput, PrimaryButton, Waiter, PhotoLoaderSlim } from '../../../components';

import s from '../styles';
import authStyles from '../../../screens/Auth/styles';

const CarDocumentsHostReg = ({ 
    name, 
    carId, 
    navigation,
    setPassedSteps, 
    incompletedData, 
}) => {

    const [carDocumentsData, setCarDocumentsData] = useState({});

    const [frontSTS, setFrontSTS] = useState();
    const [backSTS, setBackSTS] = useState();
    const [frontPTS, setFrontPTS] = useState();
    const [backPTS, setBackPTS] = useState();
    
    const [isEPTS, setIsEPTS] = useState(true);

    const [isPTSSeriaError, setIsPTSSeriaError] = useState(false);
    const [isPTSNumberError, setIsPTSNumberError] = useState(false);
    const [isPTSDateError, setIsPTSDateError] = useState(false);
    const [isEPTSNumberError, setIsEPTSNumberError] = useState(false);
    const [isEPTSDateError, setIsEPTSDateError] = useState(false);
    const [isSTSNumberError, setIsSTSNumberError] = useState(false);
    const [isSTSDateError, setIsSTSDateError] = useState(false);

    const [isPTSSeriaLengthError, setIsPTSSeriaLengthError] = useState(false);
    const [isPTSNumberLengthError, setIsPTSNumberLengthError] = useState(false);
    const [isPTSDateFormatError, setIsPTSDateFormatError] = useState(false);
    const [isEPTSNumberLengthError, setIsEPTSNumberLengthError] = useState(false);
    const [isEPTSDateFormatError, setIsEPTSDateFormatError] = useState(false);
    const [isSTSNumberLengthError, setIsSTSNumberLengthError] = useState(false);
    const [isSTSDateFormatError, setIsSTSDateFormatError] = useState(false);

    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async () => {

        setIsLoading(true);

        const ptsData = new FormData();

        ptsData.append(
            'dateOfIssue',
            isEPTS ? carDocumentsData.eptsDate : carDocumentsData.ptsDate,
        );

        ptsData.append(
            'series',
            isEPTS ? '' : carDocumentsData.ptsSeria
        );

        ptsData.append(
            'number',
            isEPTS ? carDocumentsData.eptsNumber : carDocumentsData.ptsNumber,
        );

        ptsData.append(
            'type',
            isEPTS ? 'ELECTRONIC' : 'MANUAL',
        );

        ptsData.append(
            'frontSidePhoto',
            checkIfObjectNotEmpty(frontPTS) ? assemblePhotoObject(frontPTS) : undefined,
        );

        ptsData.append(
            'reverseSidePhoto',
            checkIfObjectNotEmpty(backPTS) ? assemblePhotoObject(backPTS) : undefined,
        );

        const stsData = new FormData();

        stsData.append(
            'dateOfIssue',
            carDocumentsData.stsDate,
        );

        stsData.append(
            'number',
            carDocumentsData.stsNumber
        );
        
        stsData.append(
            'frontSidePhoto',
            checkIfObjectNotEmpty(frontSTS) ? assemblePhotoObject(frontSTS) : undefined,
        );

        stsData.append(
            'reverseSidePhoto',
            checkIfObjectNotEmpty(backSTS) ? assemblePhotoObject(backSTS) : undefined,
        );
        
        try {
            
            const ptsRes = await api.web.host.sendPTSData(carId, ptsData);
            const stsRes = await api.web.host.sendSTSData(carId, stsData);

            if (ptsRes?.uuid && stsRes?.uuid) {

                navigation.navigate(TABS.OWNER_DATA);
                setPassedSteps();

            } else {
                throw [ptsRes.error, stsRes.error];
            };

        } catch (error) {

            console.log(error)
            
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

        const pts = incompletedData?.pts;
        const sts = incompletedData?.sts;

        if (!!pts && Object.keys(pts).length !== 0) {
            
            if (pts.type === 'ELECTRONIC') {

                setTimeout(() => {

                    setCarDocumentsData({
                        ...carDocumentsData,
                        eptsNumber: pts.number,
                        eptsDate: convertISODateToDDMMYYYY(pts.dateOfIssue),
                    });
                }, 700);

            } else {

                setIsEPTS(false);

                setTimeout(() => {
                    setCarDocumentsData({
                        ...carDocumentsData,
                        ptsSeria: pts.series,
                        ptsNumber: pts.number,
                        ptsDate: convertISODateToDDMMYYYY(pts.dateOfIssue),
                    });
                }, 700);

                setFrontPTS(pts.frontSidePhotoUrl);
                setBackPTS(pts.reverseSidePhotoUrl);
            }
        };

        if (!!sts && Object.keys(sts).length !== 0) {

            setTimeout(() => {
                setCarDocumentsData({
                    ...carDocumentsData,
                    stsNumber: sts.number,
                    stsDate: convertISODateToDDMMYYYY(sts.dateOfIssue),
                });
            }, 700);

            setFrontSTS(sts.frontSidePhotoUrl);
            setBackSTS(sts.reverseSidePhotoUrl);
        }

    }, [incompletedData]);
    
    return (
        <ScrollView name={name} style={s.scrollView}>
            <Text style={[ authStyles.header, { marginBottom: 24 } ]}>
                Документы на авто
            </Text>
            <View style={[s.panel, s.mb24]}>
                <Text style={s.panel.title}>
                    Данные {isEPTS ? 'ЭПТС' : 'ПТС'}
                </Text>
                <View style={[s.row, s.mb24]}>
                    <RadioButton
                        material
                        label="Электронный ПТС"
                        style={{ marginRight: 20 }}
                        labelStyle={s.radio.text}
                        onPress={() => setIsEPTS(true)}
                        checked={isEPTS}
                    />
                    <RadioButton
                        material
                        label="Бумажный ПТС"
                        labelStyle={s.radio.text}
                        onPress={() => setIsEPTS(false)}
                        checked={!isEPTS}
                    />
                </View>
                <View style={{ 
                    opacity: isEPTS ? 1 : 0,
                    position: isEPTS ? 'relative' : 'absolute',
                    zIndex: isEPTS ? 1000 : 0,
                    bottom: isEPTS ? 0 : 'auto',
                }}>
                    <MuiInput 
                        maxLength={11}
                        keyboardType="numeric"
                        value={carDocumentsData.eptsNumber}
                        errorMessage={isEPTSNumberLengthError ? '11 символов' : 'Это обязательное поле'}
                        placeholder='Номер ЭПТС'
                        isError={isEPTSNumberError || isEPTSNumberLengthError}
                        style={s.mb32}
                        onChange={(e) => {

                            const value = e.nativeEvent.text;

                            (/^-?\d+$/.test(value) || value === '') && setCarDocumentsData({
                                ...carDocumentsData,
                                eptsNumber: value
                            });

                            setIsEPTSNumberError(false);
                            setIsEPTSNumberLengthError(false);

                        }}
                        onBlur={(e) => {

                            const value = e.nativeEvent.text;

                            if (!value) {
                                setIsEPTSNumberError(true)
                            } else if (value.length < 11) {
                                setIsEPTSNumberLengthError(true);
                            }
                        }}
                        onClear={() => {

                            setCarDocumentsData({
                                ...carDocumentsData,
                                eptsNumber: ''
                            });

                            setIsEPTSNumberLengthError(false);
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
                        value={carDocumentsData.eptsDate}
                        errorMessage={isEPTSDateFormatError ? 'Некорректная дата' : 'Это обязательное поле'}
                        placeholder='Дата выдачи ЭПТС'
                        isError={isEPTSDateError || isEPTSDateFormatError}
                        style={s.mb32}
                        onChange={(e) => {

                            const value = e.nativeEvent.text;

                            const valueWithDots = value.length >= 8 ? addDotsToDate(value) : value;

                            setCarDocumentsData({
                                ...carDocumentsData,
                                eptsDate: valueWithDots
                            });

                            setIsEPTSDateError(false);
                            setIsEPTSDateFormatError(false);

                        }}
                        onBlur={(e) => {

                            const value = e.nativeEvent.text;
                            
                            if (!value) {
                                setIsEPTSDateError(true)
                            } else if (!checkIfDateValid(value)) {
                                setIsEPTSDateFormatError(true);
                            }
                        }}
                        onClear={() => {

                            setCarDocumentsData({
                                ...carDocumentsData,
                                eptsDate: ''
                            });

                            setIsEPTSDateFormatError(false);
                        }}
                    />
                </View>
                <View style={{ 
                    opacity: isEPTS ? 0 : 1,
                    position: isEPTS ? 'absolute' : 'relative',
                    zIndex: isEPTS ? 0 : 1000,
                    bottom: isEPTS ? 0 : 'auto',
                }}>
                    <MuiInput 
                        maxLength={4}
                        value={carDocumentsData.ptsSeria}
                        errorMessage={isPTSSeriaLengthError ? '4 символа' : isPTSSeriaError}
                        placeholder='Серия ПТС'
                        isError={isPTSSeriaError || isPTSSeriaLengthError}
                        style={s.mb32}
                        onChange={(e) => {

                            const value = e.nativeEvent.text;

                            setCarDocumentsData({
                                ...carDocumentsData,
                                ptsSeria: value.toUpperCase().replace(/ /g,''),
                            });

                            if (/[a-zA-Z]/.test(value)) {
                                setIsPTSSeriaError('Используйте русские буквы');
                            } else {

                                setIsPTSSeriaError('');

                                if (value.length === 4) {

                                    if (/\d{2}[а-яА-Я]{2}/.test(value)) {
                                        setIsPTSSeriaError('');
                                    } else {
                                        setIsPTSSeriaError('Неверный формат поля, пример: 77ТМ');
                                    }
                                };
                            };

                            setIsPTSSeriaLengthError(false);
                        }}
                        onBlur={(e) => {

                            const value = e.nativeEvent.text;

                            if (value.length < 4) {
                                setIsPTSSeriaLengthError(true);
                            };
                        }}
                        onClear={() => {

                            setCarDocumentsData({
                                ...carDocumentsData,
                                ptsSeria: ''
                            });

                            setIsPTSSeriaLengthError(false);
                            setIsPTSSeriaError('');
                        }}
                    />
                    <MuiInput 
                        maxLength={6}
                        keyboardType="numeric"
                        value={carDocumentsData.ptsNumber}
                        errorMessage={isPTSNumberLengthError ? '6 символов' : 'Это обязательное поле'}
                        placeholder='Номер ПТС'
                        isError={isPTSNumberError || isPTSNumberLengthError}
                        style={s.mb32}
                        onChange={(e) => {

                            const value = e.nativeEvent.text;

                            (/^-?\d+$/.test(value) || value === '') && setCarDocumentsData({
                                ...carDocumentsData,
                                ptsNumber: value
                            });

                            setIsPTSNumberError(false);
                            setIsPTSNumberLengthError(false);

                        }}
                        onBlur={(e) => {

                            const value = e.nativeEvent.text;

                            if (!value) {
                                setIsPTSNumberError(true)
                            } else if (value.length < 6) {
                                setIsPTSNumberLengthError(true);
                            }
                        }}
                        onClear={() => {

                            setCarDocumentsData({
                                ...carDocumentsData,
                                ptsNumber: ''
                            });

                            setIsPTSNumberLengthError(false);
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
                        value={carDocumentsData.ptsDate}
                        errorMessage={isPTSDateFormatError ? 'Некорректная дата' : 'Это обязательное поле'}
                        placeholder='Дата выдачи ПТС'
                        isError={isPTSDateError || isPTSDateFormatError}
                        style={s.mb32}
                        onChange={(e) => {

                            const value = e.nativeEvent.text;

                            const valueWithDots = value.length >= 8 ? addDotsToDate(value) : value;

                            setCarDocumentsData({
                                ...carDocumentsData,
                                ptsDate: valueWithDots
                            });

                            setIsPTSDateError(false);
                            setIsPTSDateFormatError(false);

                        }}
                        onBlur={(e) => {

                            const value = e.nativeEvent.text;
                            
                            if (!value) {
                                setIsPTSDateError(true)
                            } else if (!checkIfDateValid(value)) {
                                setIsPTSDateFormatError(true);
                            }
                        }}
                        onClear={() => {

                            setCarDocumentsData({
                                ...carDocumentsData,
                                ptsDate: ''
                            });

                            setIsPTSDateFormatError(false);
                        }}
                    />
                    <PhotoLoaderSlim
                        name='frontPTS'
                        style={s.mb32}
                        value={frontPTS}
                        label='Лицевая сторона'
                        onSelect={addPhoto((data) => Object.keys(data).length !== 0 && setFrontPTS(data))}
                    />
                    <PhotoLoaderSlim
                        name='backPTS'
                        style={s.mb32}
                        value={backPTS}
                        label='Обратная сторона'
                        onSelect={addPhoto((data) => Object.keys(data).length !== 0 && setBackPTS(data))}
                    />
                    {/* <View style={[s.photos, s.mb24]}>
                        <PhotoLoader
                            asFormData
                            name="frontPTS"
                            style={s.photo}
                            textStyle={s.photoText}
                            iconColor={theme.colors.blue}
                            text='Лицевая сторона'
                            onSelectFormData={() => {}}
                            // onSelect={addPhoto((data) => setFrontPTS(data.key))}
                        />
                        <PhotoLoader
                            asFormData
                            name="backPTS"
                            style={s.photo}
                            textStyle={s.photoText}
                            iconColor={theme.colors.blue}
                            text='Обратная сторона'
                            onSelectFormData={() => {}}
                            // onSelect={addPhoto((data) => setBackPTS(data.key))}
                        />
                    </View> */}
                </View>
                <Text style={[s.panel.title, s.mb24, s.mt16]}>
                    Данные СТС
                </Text>
                <MuiInput 
                    maxLength={10}
                    value={carDocumentsData.stsNumber}
                    errorMessage={isSTSNumberLengthError ? '10 символов' : isSTSNumberError}
                    placeholder='Серия номер CТС'
                    isError={isSTSNumberError || isSTSNumberLengthError}
                    style={s.mb32}
                    onChange={(e) => {

                        const value = e.nativeEvent.text;

                        setCarDocumentsData({
                            ...carDocumentsData,
                            stsNumber: value.toUpperCase().replace(/ /g,'')
                        });
                        
                        if (/[a-zA-Z]/.test(value)) {
                            setIsSTSNumberError('Используйте русские буквы');
                        } else {

                            setIsSTSNumberError('');

                            if (value.length === 10) {

                                if (/\d{2}[а-яА-Я]{2}\d{6}/.test(value)) {
                                    setIsSTSNumberError('');
                                } else {
                                    setIsSTSNumberError('Неверный формат поля, пример: 78ОТ757744');
                                }
                            };
                        };

                        setIsSTSNumberLengthError(false);

                    }}
                    onBlur={(e) => {

                        const value = e.nativeEvent.text;

                        if (value.length < 10) {
                            setIsSTSNumberLengthError('Это обязательное поле');
                        }
                    }}
                    onClear={() => {

                        setCarDocumentsData({
                            ...carDocumentsData,
                            stsNumber: ''
                        });

                        setIsSTSNumberError(false);
                        setIsSTSNumberLengthError(false);
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
                    value={carDocumentsData.stsDate}
                    errorMessage={isSTSDateFormatError ? 'Некорректная дата' : 'Это обязательное поле'}
                    placeholder='Дата выдачи СТС'
                    isError={isSTSDateError || isSTSDateFormatError}
                    style={s.mb32}
                    onChange={(e) => {

                        const value = e.nativeEvent.text;

                        const valueWithDots = value.length >= 8 ? addDotsToDate(value) : value;

                        setCarDocumentsData({
                            ...carDocumentsData,
                            stsDate: valueWithDots
                        });

                        setIsSTSDateError(false);
                        setIsSTSDateFormatError(false);

                    }}
                    onBlur={(e) => {

                        const value = e.nativeEvent.text;
                        
                        if (!value) {
                            setIsSTSDateError(true)
                        } else if (!checkIfDateValid(value)) {
                            setIsSTSDateFormatError(true);
                        }
                    }}
                    onClear={() => {

                        setCarDocumentsData({
                            ...carDocumentsData,
                            stsDate: ''
                        });

                        setIsSTSDateFormatError(false);
                    }}
                />
                <PhotoLoaderSlim
                    name='frontSTS'
                    style={s.mb32}
                    value={frontSTS}
                    label='Лицевая сторона'
                    onSelect={addPhoto((data) => Object.keys(data).length !== 0 && setFrontSTS(data))}
                />
                <PhotoLoaderSlim
                    name='backSTS'
                    style={s.mb16}
                    value={backSTS}
                    label='Обратная сторона'
                    onSelect={addPhoto((data) => Object.keys(data).length !== 0 && setBackSTS(data))}
                />
            </View>
            <PrimaryButton
                style={[ authStyles.submitBtn, s.resumeBtn, s.primaryBtn, { width: 103, alignSelf: 'flex-end' }]}
                title={isLoading ? <Waiter size='small' /> : "Далее" }
                onPress={handleSubmit}
                disabled={
                    (
                        isEPTS 
                        ?
                            (
                                carDocumentsData.eptsNumber?.length !== 11 || 
                                !carDocumentsData.eptsDate ||
                                isEPTSDateFormatError
                            )
                        :
                            (
                                carDocumentsData.ptsSeria?.length !== 4 || 
                                carDocumentsData.ptsNumber?.length !== 6 || 
                                !carDocumentsData.ptsDate ||
                                isPTSSeriaError ||
                                !frontPTS ||
                                !backPTS ||
                                isPTSDateFormatError
                            )
                    ) ||
                    carDocumentsData.stsNumber?.length !== 10 ||
                    !carDocumentsData.stsDate ||
                    isSTSNumberError ||
                    !frontSTS ||
                    !backSTS ||
                    isSTSDateFormatError
                }
            />
        </ScrollView>
    )
};

export default CarDocumentsHostReg;
