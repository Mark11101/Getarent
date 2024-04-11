import {
    ActivityIndicator,
    Dimensions,
    Image, Platform,
    SafeAreaView,
    ScrollView,
    StyleSheet, Text,
    TouchableOpacity,
    View
} from "react-native";
import theme from "../../theme";
import React, {useCallback, useEffect, useMemo, useState} from "react";
import {Header, Icon, Waiter} from "../../components";
import api from "api";
import EnhancedImageViewing from "react-native-image-viewing";
import {shallowEqual, useSelector} from "react-redux";
import ImagePicker from "react-native-image-crop-picker";
import {showMessage} from "react-native-flash-message";

const SCREEN_WIDTH = Dimensions.get('window').width;

const styles = StyleSheet.create({
    image: {
        width: "100%",
        height: "100%",
        backgroundColor: "#f3f3f3"
    },
    imageView: {
        width: SCREEN_WIDTH / 3,
        height: SCREEN_WIDTH / 3,
        padding: 5
    },
    imageViewPhotoAdd: {
        width: (SCREEN_WIDTH / 3) - 10,
        height: (SCREEN_WIDTH / 3) - 10,
        margin: 5,
        borderWidth: 2,
        borderStyle: "dashed",
        borderColor: theme.colors.blue,
        justifyContent: "center",
        alignItems: "center"
    },
    imageViewPhotoAddIcon: {
        width: 33,
        height: 33,
    },
    imagesList: {
        flexDirection: 'row',
        flexWrap: 'wrap'
    },
    uploader: {
        width: SCREEN_WIDTH / 3.1,
        height: SCREEN_WIDTH / 3.1,
    },
    blockTitle: {
        fontFamily: 'Inter',
        fontSize: 17,
        width: "100%",
        textAlign: "center",
        marginVertical: 13,
    }
});

const SCREEN_STATES = {
    LOAD_ADDITIONAL_IMAGES: "LOAD_ADDITIONAL_IMAGES",
    RESOURCES_LOADED: "RESOURCES_LOADED",
}

export const PsoPhotosView = () => {
    const [screenState, setScreenState] = useState(SCREEN_STATES.LOAD_ADDITIONAL_IMAGES);
    const [additionalImagesLoadingCount, setAdditionalImageLoadingCount] = useState(0);
    const [additionalPhotos, setAdditionalPhotos] = useState([]);

    const [activeImageListForViewing, setActiveImageListForViewing] = useState([]);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [visibleImageViewing, setIsVisibleImageViewing] = useState(false);

    const {
        rent,
        refreshing,
        preRentalInspection = {},
        postRentalInspection = {},
        contentInfo = {},
    } = useSelector(st => st.rentRoom, shallowEqual);

    useEffect(() => {
        const onScreenStart = async () => {
            setScreenState(SCREEN_STATES.LOAD_ADDITIONAL_IMAGES);

            try {
                const result = await api.web.getRentAdditionalPhotos(rent.id);
                setAdditionalPhotos(result.photoKeys.map(photoUrl => ({url: photoUrl})));
            } catch (e) {
                console.log(e);
            } finally {
                setScreenState(SCREEN_STATES.RESOURCES_LOADED)
            }
        }

        onScreenStart();
    }, [rent.id]);

    const rentalInspectionPhotos = [
        ...preRentalInspection.inspectionPhotos,
        ...postRentalInspection.inspectionPhotos
    ];

    const onAdditionalPhotoAdd = useCallback(() => {
        ImagePicker[
            __DEV__
                ? "openPicker"
                : "openCamera"
            ]({
            mediaType: "photo",
            compressImageQuality: 0.3,
            forceJpg: true
        }).then(async (image) => {
            const data = new FormData();
            data.append(`photos`, {
                uri: image.path,
                type: 'image/jpeg',
                name: 'image.jpg'
            });


            try {
                setAdditionalImageLoadingCount(prevVal => prevVal + 1);
                const response = await api.web.addRentAdditionalPhotos(rent.id, data);

                if (response.countOfFailedLoadPhoto !== 0) {
                    showMessage({
                        message: `Не удалось загрузить фото`,
                        description: "Повторите загрузку вновь!",

                        type: "danger",
                        duration: 5000
                    });
                }

                setAdditionalPhotos(existsPhotos => [...response.photos.map(photoUrl => ({url: photoUrl})), ...existsPhotos]);
            } catch (e) {
                showMessage({
                    message: `Не удалось выполнить загрузку доп. фотографий.`,
                    description: "Повторите загрузку вновь!",

                    type: "danger",
                    duration: 5000
                });
            } finally {
                setAdditionalImageLoadingCount((prevVal) => prevVal <= 0 ? 0 : prevVal - 1);
            }
        })
    }, []);

    return (
        <SafeAreaView style={theme.styles.container}>
            <Header
                big
                title={contentInfo.rentPhotosButtonName}
                onPressBack={() => api.navigation.goBack()}
            />

            {!screenState !== SCREEN_STATES.RESOURCES_LOADED && !refreshing ? (
                <ScrollView>
                    <>
                        <Text style={styles.blockTitle}>
                            Доп. фотографии
                        </Text>

                        <View style={styles.imagesList}>
                            <TouchableOpacity
                                style={[styles.imageViewPhotoAdd, additionalImagesLoadingCount !== 0 ? {opacity: 0.3} : {}]}
                                key={"Add_Photo_Button"}
                                onPress={onAdditionalPhotoAdd}
                            >
                                <Icon
                                    style={styles.imageViewPhotoAddIcon}
                                    name={'photo-add'}
                                    size={30}
                                    color={theme.colors.blue}
                                />
                            </TouchableOpacity>

                            {additionalImagesLoadingCount ? (
                                <TouchableOpacity
                                    style={styles.imageViewPhotoAdd}
                                    key={`Loading_Element_${Math.random()}`}
                                >
                                    <ActivityIndicator/>
                                </TouchableOpacity>
                            ) : null}

                            {additionalPhotos.map((item, index) => (
                                <TouchableOpacity
                                    style={styles.imageView}
                                    key={`Image_${item.url}`}
                                    onPress={() => {
                                        setCurrentImageIndex(index);
                                        setIsVisibleImageViewing(true);
                                        setActiveImageListForViewing(additionalPhotos);
                                    }}
                                >
                                    <Image
                                        style={styles.image}
                                        source={{
                                            uri: item.url
                                        }}
                                    />
                                </TouchableOpacity>
                            ))}
                        </View>
                    </>

                    {rentalInspectionPhotos.length ? (
                        <>
                            <Text style={styles.blockTitle}>
                                ПСО
                            </Text>

                            <View style={styles.imagesList}>
                                {rentalInspectionPhotos.map((item, index) => (
                                    <TouchableOpacity
                                        style={styles.imageView}
                                        key={`Image_${item.url}`}
                                        onPress={() => {
                                            setCurrentImageIndex(index);
                                            setIsVisibleImageViewing(true);
                                            setActiveImageListForViewing(rentalInspectionPhotos);
                                        }}
                                    >
                                        <Image
                                            style={styles.image}
                                            source={{
                                                uri: item.url
                                            }}
                                        />
                                    </TouchableOpacity>
                                ))}
                            </View>
                        </>
                    ) : null}
                </ScrollView>
            ) : <Waiter/>}

            {!screenState !== SCREEN_STATES.RESOURCES_LOADED && !refreshing ? (
                <EnhancedImageViewing
                    images={activeImageListForViewing.map(item => ({uri: item.url}))}
                    imageIndex={currentImageIndex}
                    visible={visibleImageViewing}
                    onRequestClose={() => setIsVisibleImageViewing(false)}
                />
            ) : null}
        </SafeAreaView>
    )
}