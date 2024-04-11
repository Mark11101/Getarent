import { Formik } from 'formik';
import { useDispatch } from 'react-redux';
import React, { useState, useCallback } from 'react';
import BouncyCheckbox from "react-native-bouncy-checkbox";
import { SafeAreaView, ScrollView, View, Text } from 'react-native';

import { 
    Header, 
    Waiter,
    Thumbnail, 
    PrimaryButton,
} from 'components';
import api from 'api';
import actions from 'actions';
import { showLoadPhotoError } from 'functions';
import { PhotoLoader } from '../../../components';

import s from './styles';
import theme from 'theme';

const initialValues = {
    certificatePhoto: '',
	photos: [],
    isCertificateNotExist: false,
};

const Filler = React.memo(function Filler({ count }) {
	return [...new Array(count)].map((v, i) => (
		<View key={i} collapsable={false} />
	));
});

const Accidents = ({ route: { params: { rentId } = {} } }) => {

    const dispatch = useDispatch();

    const [waiter, setWaiter] = useState(false);

    const onSubmit = useCallback(

        async ({ photos, certificatePhoto, isCertificateNotExist }) => {

            setWaiter(true);
            
            const photosArray = [];

            !!photos && photosArray.push(...(photos.map(p => p.key)));
            !!certificatePhoto && photosArray.push(certificatePhoto.key);

            const description = isCertificateNotExist ? 'Нет справки' : null;

            try {
                const res = await api.web.compensationDocuments(
                    rentId,
                    'ACCIDENT',
                    photosArray,
                    description,
                );

                if (res?.error) {
                    throw res.error;
                } else {
                    console.log(res)
                };

                api.navigation.navigate('CompleteCompensation');

            } catch (err) {

                console.log(err);
				
                dispatch(
					actions.error(
						'Попробуйте сфотографировать документы еще раз'
					)
				);

            } finally {
                setWaiter(false);
            }
        },
        [dispatch]
    );

    const addPhoto = useCallback(

        (values, field, setFieldValue) => async event => {

            setWaiter(true);
            
            try {
                const res = await event;

                field === 'photos'
                ?
                    setFieldValue(field, [...values, res])
                :
                    setFieldValue(field, res)

            } catch (err) {
                showLoadPhotoError(err.message)
            } finally {
                setWaiter(false);
            }
        },
        [dispatch]
    );

    const removePhoto = useCallback((file, files, setFieldValue) => {

        setFieldValue(
            'photos',
            files.filter(f => f !== file)
        );
    }, []);

    return (
        <Formik {...{ initialValues, onSubmit }}>
            {({ values, handleSubmit, setFieldValue }) => (
                <SafeAreaView style={s.safeArea}>
                    <ScrollView>
                        <Header
                            title='ДТП, аварии, повреждения'
                        />
                        <View style={s.container}>
                            <Text style={s.text}>
                                Загрузите фотографию справки соответвующих органов, 
                                подтверждающую факт происшествия (с указанием обстоятельств 
                                происшествия) и содержащую перечень повреждений.
                            </Text>
                            {
                                !values.certificatePhoto
                                &&
                                    <BouncyCheckbox 
                                        text='У меня нет справки'
                                        fillColor={theme.colors.blue}
                                        innerIconStyle={{
                                            borderRadius: 10,
                                        }}
                                        textStyle={[
                                            theme.styles.P1_5, 
                                            { marginLeft: -5, textDecorationLine: "none", }
                                        ]}
                                        style={s.checkbox}
                                        isChecked={values.isCertificateNotExist}
                                        onPress={() => setFieldValue(
                                            'isCertificateNotExist', 
                                            !values.isCertificateNotExist
                                        )}
                                    />
                            }
                            {
                                !values.isCertificateNotExist
                                &&
                                    <View style={s.accidentCertificateLoader}>
                                        {
                                            values.certificatePhoto
                                            ?
                                                <Thumbnail
                                                    style={s.certificatePhoto}
                                                    resizeMode="cover"
                                                    source={{ uri: values.certificatePhoto.path }}
                                                    onPressDelete={() =>
                                                        setFieldValue(
                                                            'certificatePhoto',
                                                            ''
                                                        )
                                                    }
                                                />
                                            :
                                                <PhotoLoader
                                                    style={s.certificatePhoto}
                                                    name="photo"
                                                    onSelect={addPhoto(
                                                        values.certificatePhoto,
                                                        'certificatePhoto',
                                                        setFieldValue
                                                    )}
                                                />
                                        }
                                    </View>
                            }
                            <View style={s.carPhotosView}>
                                <Text style={s.carPhotosText}>
                                    Если при завершении аренды вы не 
                                    загрузили фотографии, загрузите их здесь:
                                </Text>
                                <View style={s.carPhotos}>
                                    <PhotoLoader
                                        style={s.thumbnail}
                                        name="photo"
                                        onSelect={addPhoto(
                                            values.photos,
                                            'photos',
                                            setFieldValue
                                        )}
                                    />
                                    {values.photos.map(file => (
                                        <Thumbnail
                                            key={file.key}
                                            style={s.thumbnail}
                                            resizeMode="cover"
                                            source={{ uri: file.path }}
                                            onPressDelete={() =>
                                                removePhoto(
                                                    file,
                                                    values.photos,
                                                    setFieldValue
                                                )
                                            }
                                        />
                                    ))}
                                    <Filler
                                        count={
                                            Math.abs(
                                                4 - ((values.photos.length + 1) % 4)
                                            ) % 4
                                        }
                                    />
                                </View>
                            </View>
                            {waiter && <Waiter />}
                        </View>
                    </ScrollView>
                    <View style={s.resumeBtn}>
                        <PrimaryButton 
                            title='Продолжить'
                            onPress={handleSubmit}
                            disabled={
                                !values.isCertificateNotExist && 
                                !values.certificatePhoto
                            }
                        />
                    </View>
                </SafeAreaView>
            )}
        </Formik>
    );
};

export default Accidents;
