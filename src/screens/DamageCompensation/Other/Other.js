import { Formik } from 'formik';
import { useDispatch } from 'react-redux';
import React, { useState, useCallback } from 'react';
import { SafeAreaView, ScrollView, View, Text } from 'react-native';

import { 
    Header, 
    Waiter,
    Thumbnail, 
    FormikInput,
    PrimaryButton,
} from 'components';
import api from 'api';
import actions from 'actions';
import { showLoadPhotoError } from 'functions';
import { PhotoLoader } from '../../../components';

import s from './styles';

const initialValues = {
	photos: [],
	description: '',
};

const Filler = React.memo(function Filler({ count }) {
	return [...new Array(count)].map((v, i) => (
		<View key={i} collapsable={false} />
	));
});

const Other = ({ route: { params: { rentId } = {} } }) => {

    const dispatch = useDispatch();

    const [waiter, setWaiter] = useState(false);

    const onSubmit = useCallback(

        async ({ photos, description }) => {

            if (description.length < 10) {

                dispatch(actions.error('Миниимальная длина текста: 10'));
                return
            };

            setWaiter(true);

            try {
                const res = await api.web.compensationDocuments(
                    rentId,
                    'OTHER',
                    photos.map(p => p.key),
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
                dispatch(actions.error('Не удалось отправить данные, попробуйте еще раз'));
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

                setFieldValue(field, [...values, res])

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
                            title='Другое'
                        />
                        <View style={s.container}>
                            <Text style={s.text}>
                                Максимально подробно опишите вашу проблему
                            </Text>
                            <FormikInput
                                multiline
                                // style={styles.input}
                                labelStyle={s.textAreaLabel}
                                inputStyle={s.textAreaInput}
                                name="description"
                            />
                            <View style={s.carPhotosView}>
                                <Text style={s.carPhotosText}>
                                    При необходимости, загрузите фотографии:
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
                        />
                    </View>
                </SafeAreaView>
            )}
        </Formik>
    );
};

export default Other;
