import React, { useCallback, useState } from 'react';
import { Text, StyleSheet, View } from 'react-native';
import { useDispatch } from 'react-redux';
import theme from 'theme';
import api from 'api';
import actions from 'actions';
import auto_1 from 'img/auto_1.png';
import auto_2 from 'img/auto_2.png';
import auto_3 from 'img/auto_3.png';
import auto_4 from 'img/auto_4.png';

const photosAuto = [auto_1, auto_2, auto_3, auto_4];

import {
	PhotoLoader,
	PrimaryButton,
	ImagePlaceholder,
	Thumbnail,
} from 'components';
import { Formik } from 'formik';

import Layout from '../Layout';
import usePso from '../usePso';
import psoStyle from '../style';
import NavigationProgress from '../NavigationProgress';

import { showLoadPhotoError } from 'functions';

const arr = [...Array(4)].map((_, i) => i);

export default function PsoPhotoAuto({
	route: {
		params: { uuid, isStart, role },
	},
}) {
	const stepName = 'GENERAL';
	const nextStep = useCallback(
		() => api.navigation.navigate('PsoVinAuto', { uuid, isStart, role }),
		[isStart, role, uuid]
	);

	const { waiter, initialValues, goBack, setWaiter } = usePso({
		role,
		uuid,
		stepName,
		isStart,
		nextStep,
	});

	const dispatch = useDispatch(),
		[deletedPhotos, setDeletedPhotos] = useState([]),
		onSubmit = useCallback(
			async ({ photos }) => {
				setWaiter(true);

				try {
					const res = await api.web.updatePsoEndpoint(
						role,
						uuid,
						stepName,
						photos.filter(p => p.isUpload).map(p => p.key),
						deletedPhotos,
						isStart
					);

					if (res?.error) {
						throw res.error;
					}
					nextStep();
				} catch (err) {
					dispatch(
						actions.error(
							'Попробуйте сфотографировать документы еще раз'
						)
					);
				} finally {
					setWaiter(false);
				}
			},
			[isStart, role, uuid, deletedPhotos, setWaiter, nextStep, dispatch]
		),
		addPhoto = useCallback(
			(x, values, setFieldValue) => async event => {
				setWaiter(true);

				try {
					const res = await event;

					const photos = [...values];
					photos[x] = res;

					setFieldValue('photos', [...photos]);

				} catch (err) {
					showLoadPhotoError(err.message);
				} finally {
					setWaiter(false);
				}
			},
			[setWaiter, dispatch]
		),
		removePhoto = useCallback(
			(x, files, setFieldValue) => {
				const file = { ...files[x] };
				const photos = [...files];
				photos[x] = null;
				setFieldValue('photos', [...photos]);

				if (!file?.isUpload) {
					setDeletedPhotos([...deletedPhotos, file.key]);
				}
			},
			[deletedPhotos]
		);

	const headerTitle = isStart
		? 'Перед тем как начать аренду, сфотографируйте автомобиль с разных сторон и в салоне'
		: 'Перед тем как завершить аренду, сфотографируйте автомобиль с разных сторон и в салоне';

	return (
		<Formik {...{ initialValues, onSubmit, enableReinitialize: true }}>
			{({ values, handleSubmit, setFieldValue }) => (
				<Layout waiter={waiter} goBack={goBack}>
					<View style={psoStyle.offset}>
						<Text style={psoStyle.headerTitle}>{headerTitle}</Text>
						<NavigationProgress {...{ role, stepName }} />
						<Text style={psoStyle.title}>
							Общие фотографии машины
						</Text>
						<Text style={psoStyle.lightText}>
							Делайте фотографии только при хорошем освещении.
							Сделайте 4 фотографии машины, как показано в
							примере:
						</Text>
						<View style={styles.exampleContainer}>
							{photosAuto.map((x, i) => (
								<ImagePlaceholder
									key={i}
									style={styles.exampleImgElement}
									imageStyle={styles.exampleImg}
									source={x}
									placeholder={i + 1}
								/>
							))}
						</View>
						{values?.photos && (
							<View style={styles.photos}>
								{arr.map(x =>
									values.photos[x] ? (
										<Thumbnail
											key={x}
											style={styles.thumbnail}
											resizeMode="cover"
											source={{
												uri: values.photos[x].path
											}}
											onPressDelete={() =>
												removePhoto(
													x,
													values.photos,
													setFieldValue
												)
											}
										/>
									) : (
										<PhotoLoader
											name={x}
											style={styles.thumbnail}
											onSelect={addPhoto(
												x,
												values.photos,
												setFieldValue
											)}
											text={`Фото ${x + 1}`}
											key={x}
										/>
									)
								)}
							</View>
						)}
					</View>
					<View style={theme.styles.flex} />

					<View style={psoStyle.offset}>
						{values?.photos && (
							<PrimaryButton
								disabled={
									values.photos.filter(x => !!x).length < 4
								}
								title="Следующий шаг"
								onPress={handleSubmit}
							/>
						)}
					</View>
				</Layout>
			)}
		</Formik>
	);
}

const styles = StyleSheet.create({
	photos: {
		width: '100%',
		flexDirection: 'row',
		flexWrap: 'wrap',
		justifyContent: 'space-between',
	},
	exampleContainer: {
		flexDirection: 'row',
		flexWrap: 'wrap',
		justifyContent: 'space-between',
		marginHorizontal: -10,
	},
	exampleImgElement: {
		flexBasis: '40%',
		marginHorizontal: 10,
		marginVertical: 10,
		borderRadius: 50,
		flexGrow: 1,
		flexShrink: 1,
	},
	exampleImg: {
		width: '100%',
		height: 100,
	},
	thumbnail: {
		...theme.styles.thumbnail,
		marginBottom: theme.spacing(2),
	},
});
