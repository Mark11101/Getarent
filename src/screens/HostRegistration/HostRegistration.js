import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { View, KeyboardAvoidingView, Platform, TouchableOpacity, } from 'react-native';

import api from 'api';
import CarDataHostReg from './Tabs/CarDataHostReg';
import CarDocumentsHostReg from './Tabs/CarDocumentsHostReg';
import OwnerDataHostReg from './Tabs/OwnerDataHostReg';
import ProfileDataHostReg from './Tabs/ProfileDataHostReg';
import { ProgressVisualizationTabs } from '../../components';
import GoBackIcon from 'img/rent-out/go-back-icon.svg'
import { requestNeedDocumentsModal } from '../../modals';

import styles from './styles';

export const TABS = {
	REGISTRATION: 'Регистрация',
	CAR_DATA: 'Авто',
	CAR_DOCUMENTS: 'Документы',
	OWNER_DATA: 'Владелец',
	PROFILE_DATA: 'Финал'
}

const HostRegistration = ({ route: { params: { isSecondCar = false, isCreatedCarExist = false, onPressBack } = {} }}) => {

    const dispatch = useDispatch();

    const role = useSelector(st => st.profile.role);

    const [carId, setCarId] = useState('');

    const [isCheckDataCompleted, setIsCheckDataCompleted] = useState(false);

    const initialPassedSteps = isSecondCar ? [] : [TABS.REGISTRATION];

	const [passedSteps, setPassedSteps] = useState(initialPassedSteps);

    const [incompletedPTSSTSData, setIncompletedPTSSTSData] = useState({});
    const [incompletedOwnerData, setIncompletedOwnerData] = useState({});

    React.useEffect(() => {
        if (role !== 'HOST') {
            requestNeedDocumentsModal({ isHost: true })
                .then(res => {
                    if (!res) api.navigation.navigate('Observer')
                })
        }
    }, [role]);

    const checkFinalData = () => {

        setIsCheckDataCompleted(true);
        api.navigation.navigate(TABS.PROFILE_DATA);
    };

    const checkOwnerData = async (carId, passedSteps, isSecondCar) => {

        try {
            
            const res = await api.web.host.getOwnerData(carId);

            const isDataCompleted = !!res && (
                res.type === 'INDIVIDUAL'
                ?
                    (
                        !!res.firstName &&
                        !!res.lastName &&
                        !!res.midName &&
                        !!res.birthDate &&
                        !!res.registrationAddress &&
                        !!res.serialNumber &&
                        !!res.dateOfIssue &&
                        !!res.registrationSidePhotoUrl &&
                        !!res.frontSidePhotoUrl
                    )
                :
                    (
                        !!res.inn &&
                        !!res.companyAddress &&
                        !!res.companyName
                    )
            );

            if (isDataCompleted) {

                setPassedSteps([
                    ...passedSteps,
                    TABS.OWNER_DATA
                ]);

                !isSecondCar && checkFinalData();

            } else {

                setIncompletedOwnerData(res);
                
                setIsCheckDataCompleted(true);

                api.navigation.navigate(TABS.OWNER_DATA);
            };

        } catch (error) {
            console.log(error);
        };
    };

    const checkPTSSTSData = async (carId, passedSteps, isSecondCar) => {

        let savedPassedSteps = [
            ...passedSteps,
            TABS.CAR_DATA,
        ];

        setPassedSteps(savedPassedSteps);

        try {
            
            const ptsRes = await api.web.host.getPTSData(carId);
            const stsRes = await api.web.host.getSTSData(carId);

            const isPTSDataCompleted = (
                ptsRes?.type === 'ELECTRONIC'
                ?
                    (
                        !!ptsRes.number &&
                        !!ptsRes.dateOfIssue
                    )
                :
                    (
                        !!ptsRes.series &&
                        !!ptsRes.number &&
                        !!ptsRes.dateOfIssue &&
                        !!stsRes.frontSidePhotoUrl &&
                        !!stsRes.reverseSidePhotoUrl
                    )
            );

            const isSTSDataCompleted = !!stsRes && (
                !!stsRes.number &&
                !!stsRes.dateOfIssue &&
                !!stsRes.frontSidePhotoUrl &&
                !!stsRes.reverseSidePhotoUrl
            )

            if (isPTSDataCompleted && isSTSDataCompleted) {

                savedPassedSteps = [
                    ...savedPassedSteps,
                    TABS.CAR_DOCUMENTS,
                ]

                setPassedSteps(savedPassedSteps);

                checkOwnerData(carId, savedPassedSteps, isSecondCar);

            } else {

                setIncompletedPTSSTSData({
                    pts: ptsRes,
                    sts: stsRes,
                });

                setIsCheckDataCompleted(true);

                api.navigation.navigate(TABS.CAR_DOCUMENTS);
            };

        } catch (error) {
            console.log(error);
        };
    };
    
	return (
        <View style={styles.container}>
            <KeyboardAvoidingView
                style={styles.container}
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            >
                {
                    isSecondCar
                    &&
                        <View style={styles.goBack}>
                            <TouchableOpacity
                                style={styles.goBackBtn}
                                onPress={() => !!onPressBack ? onPressBack() : api.navigation.goBack()}
                            >
                                <GoBackIcon />
                            </TouchableOpacity>
                        </View>
                }
                <ProgressVisualizationTabs
                    passedSteps={passedSteps}
                    initialRouteName={TABS.CAR_DATA}
                    forbiddenRoutes={[ TABS.REGISTRATION ]}
                    disableOnPress={true}
                >
                    {/* Frozen unreachable step */}
                    { !isSecondCar && <View name={TABS.REGISTRATION} /> }

                    <CarDataHostReg
                        name={TABS.CAR_DATA}
                        passedSteps={passedSteps}
                        setPassedSteps={() => setPassedSteps([
                            ...passedSteps,
                            TABS.CAR_DATA
                        ])}
                        isSecondCar={isSecondCar}
                        isCreatedCarExist={isCreatedCarExist}
                        onCarIdRequested={setCarId}
                        checkPTSSTSData={checkPTSSTSData}
                        isCheckDataCompleted={isCheckDataCompleted}
                    />

                    <CarDocumentsHostReg
                        name={TABS.CAR_DOCUMENTS}
                        carId={carId}
                        incompletedData={incompletedPTSSTSData}
                        setPassedSteps={() => setPassedSteps([
                            ...passedSteps,
                            TABS.CAR_DOCUMENTS
                        ])}
                    />

                    <OwnerDataHostReg
                        name={TABS.OWNER_DATA}
                        carId={carId}
                        isSecondCar={isSecondCar}
                        incompletedOwnerData={incompletedOwnerData}
                        resetPassesSteps={() => setPassedSteps(initialPassedSteps)}
                        setPassedSteps={() => setPassedSteps([
                            ...passedSteps,
                            TABS.OWNER_DATA
                        ])}
                    />

                    {
                        !isSecondCar
                        &&
                            <ProfileDataHostReg
                                name={TABS.PROFILE_DATA}
                                carId={carId}
                                setPassedSteps={() => setPassedSteps([
                                    ...passedSteps,
                                    TABS.PROFILE_DATA
                                ])}
                            />
                    }

                </ProgressVisualizationTabs>

            </KeyboardAvoidingView>
        </View>
    )
}

export default HostRegistration
