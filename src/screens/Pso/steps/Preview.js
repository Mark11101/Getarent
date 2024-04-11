import React from 'react';
import {useSelector, shallowEqual} from 'react-redux';
import {Text, View, StyleSheet, Image} from 'react-native';

import api from 'api';
import theme from 'theme';
import Layout from '../Layout';
import {NextStepBtn} from '../NextStepBtn';
import {getPsoConfig} from '../config';
import psoStyle from '../style';

const styles = StyleSheet.create({
    nextStepBtn: {
        ...psoStyle.nextStepBtn,
        marginTop: 35,
    },
    bannerImage: {
        width: "100%",
        height: 112,
        borderRadius: 18,
    },
    bannerImageView: {
        padding: 4,
        marginBottom: 16,
        borderRadius: 20,
        backgroundColor: "#F5F5F7"
    },
    title: {
        fontFamily: 'DelaGothicOne-Regular',
        lineHeight: 36,
        fontSize: 26,
        marginBottom: 16,
    },
    description: {
        marginBottom: 16,
        fontFamily: 'Inter',
        fontSize: 14,
        lineHeight: 22,
    },
    numberedList: {},
    numberedListItem: {
        flexDirection: "row",
        marginBottom: 16,
        width: "100%"
    },
    numberedListContent: {},
    numberedListNumberView: {
        width: 24,
        height: 24,
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 50,
        backgroundColor: "#000000",
        marginRight: 8
    },
    numberedListNumber: {
        color: "#ffffff"
    },
    numberedListTitle: {
        marginTop: 1,
        fontFamily: 'Inter-Bold',
        fontSize: 16,
        lineHeight: 22,
        marginBottom: 16,
        maxWidth: "95%"
    },
    numberedListDescription: {
        fontFamily: 'Inter',
        fontSize: 14,
        lineHeight: 22,
        maxWidth: "93%",
    },
});

const defaultDescriptionConditionList = [
    {
        "title": "Фотографируйте в светлое время суток",
        "description": "Даже если аренда начинается ночью. Осмотр машины можно делать заранее, до передачи ключей водитилю. Ночные фотографии приведут к отказу от страхования."
    },
    {
        "title": "Подходят только четкие изображения",
        "description": "Перефотографируйте, если вам кажется, что фото размытое. Нечеткие изображения не будут приняты к страховому осмотру."
    },
    {
        "title": "Объект полностью внутри границы фото",
        "description": "Не обрезайте фотографии: машина должна полностью попадать в границы фото. Обрезанные изображения не будут приняты к страховому осмотру."
    },
    {
        "title": "Фотографируйте чистое авто",
        "description": "Загрязнения помешают страховой компании оценить состояние авто, такие фотографии также не будут учитываться."
    }
];

export const PreviewStep = ({
                                route: {
                                    params: {uuid, isStart, role, insured},
                                },
                            }) => {
    const stepName = 'PREVIEW';
    const {next: nextStep, prev: prevStep} = getPsoConfig(role, insured)[stepName];

    const {
        contentInfo: {
            preRentalInspectionPreview
        }
    } = useSelector(st => st.rentRoom, shallowEqual);

    const conditionList = preRentalInspectionPreview?.conditionList ? (
        preRentalInspectionPreview?.conditionList?.length ? preRentalInspectionPreview?.conditionList : defaultDescriptionConditionList
    ) : []

    return (
        <Layout goBack={() => {
            api.navigation.navigate(prevStep, {uuid, isStart, role, insured})
        }}>
            <View style={psoStyle.stepView}>
                {
                    preRentalInspectionPreview?.bannerImageUrl && (
                        <View style={styles.bannerImageView}>
                            <Image
                                style={styles.bannerImage}
                                source={{
                                    uri: preRentalInspectionPreview.bannerImageUrl
                                }}
                            />
                        </View>
                    )
                }

                <Text style={styles.title}>
                    {preRentalInspectionPreview.title || "Сделайте осмотр автомобиля для страхования КАСКО"}
                </Text>

                {preRentalInspectionPreview.description ? (
                    <Text style={styles.description}>
                        {preRentalInspectionPreview.description}
                    </Text>
                ) : null}

                <View style={styles.numberedList}>
                    {conditionList.map((item, index) => (
                        <View style={styles.numberedListItem} key={`PSO_ConditionList_${index}`}>
                            <View style={styles.numberedListNumberView}>
                                <Text style={styles.numberedListNumber}>
                                    {index + 1}.
                                </Text>
                            </View>

                            <View style={styles.numberedListContent}>
                                <Text
                                    style={styles.numberedListTitle}
                                    numberOfLines={3}
                                >
                                    {item.title}
                                </Text>
                                <Text style={styles.numberedListDescription}>
                                    {item.description}
                                </Text>
                            </View>
                        </View>
                    ))}
                </View>

                <NextStepBtn
                    style={styles.nextStepBtn}
                    title={"Начать осмотр"}
                    onPress={() => {
                        api.navigation.navigate(nextStep, {
                            uuid,
                            isStart,
                            role,
                            insured,
                        })
                    }}
                />
            </View>
        </Layout>
    );
};
