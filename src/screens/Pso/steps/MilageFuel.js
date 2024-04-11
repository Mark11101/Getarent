import React from 'react';
import {useSelector, shallowEqual} from 'react-redux';
import {Text, View, StyleSheet} from 'react-native';

import api from 'api';
import theme from 'theme';
import Layout from '../Layout';
import NavigationProgress from '../NavigationProgress';
import {MainPhotosForm} from '../MainPhotosForm';
import {NextStepBtn} from '../NextStepBtn';
import usePso, {useCachedPRIStorageKey} from '../usePso';
import {getPsoConfig} from '../config';
import psoStyle from '../style';
import {useDispatch} from "react-redux";
import actions from "actions";

const styles = StyleSheet.create({
    text: {
        ...theme.getFontProps('regular', 13, 22),
        marginTop: 10,
        marginBottom: 22,
    },
    nextStepBtnTitle: {
        ...theme.styles.shrink,
        paddingTop: 2,
        paddingLeft: 15,
        paddingRight: 15,
        lineHeight: 16,
        textAlign: 'center',
    },
    nextStepBtn: {
        ...psoStyle.nextStepBtn,
        marginTop: 20,
    },
});

export const MilageFuelStep = ({
                                   route: {
                                       params: {uuid, isStart, role, insured},
                                   },
                               }) => {
    const stepName = 'MILAGE_AND_FUEL';
    const {photos: stepPhotos, next: nextStep} = getPsoConfig(role, insured)[stepName];
    const requiredPhotosIds = stepPhotos.map(
        ({sequentialIdWithinStep}) => sequentialIdWithinStep
    );
    const dispatch = useDispatch();
    const storageKey = useCachedPRIStorageKey()

    const {photos} = useSelector(({pso}) => pso, shallowEqual);
    const {waiter, goBack, onSubmit, finish} = usePso({
        role,
        uuid,
        stepName,
        isStart,
        insured,
        nextStep: async () => {
            await api.web.psoFinish(uuid, role, isStart);
            dispatch(actions.rentRoomRequest(uuid, role));
            await api.storage.set(storageKey, {});

            const endNavigationScreenName = finish ? 'RentRoom' : 'PsoWait';
            api.navigation.navigate(
                endNavigationScreenName,
                {
                    uuid,
                    isStart,
                    role,
                    insured,
                }
            );
        },
    });
    const requiredUploadedPhotos = photos.filter(photo =>
        requiredPhotosIds.includes(photo.sequentialIdWithinStep)
    );

    const nextStepBtnTitle = 'Завершить осмотр и подписать акт передачи'

    return (
        <Layout waiter={waiter} goBack={goBack}>
            <View style={psoStyle.stepView}>
                <Text style={psoStyle.title}>
                    Сфотографируйте пробег и уровень топлива на одометре
                </Text>
                <NavigationProgress
                    {...{role, stepName: 'MILAGE_AND_FUEL', insured}}
                />
                <MainPhotosForm
                    stepName={stepName}
                    stepPhotos={stepPhotos}
                    style={psoStyle.mainPhotosForm}
                />
                <View style={theme.styles.flex}/>
                {/* TODO: add check for photos existence and disabled*/}
                <NextStepBtn
                    title={nextStepBtnTitle}
                    titleStyle={styles.nextStepBtnTitle}
                    style={styles.nextStepBtn}
                    onPress={onSubmit}
                    disabled={
                        stepPhotos.length !== requiredUploadedPhotos.length
                    }
                />
            </View>
        </Layout>
    );
};
