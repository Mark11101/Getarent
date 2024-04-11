import React, { useCallback, useState } from 'react';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import { View, StyleSheet } from 'react-native';
import { Thumbnail } from 'components';

import api from 'api';
import actions from 'actions';
import theme from 'theme';
import PsoPhotoLoader from './PsoPhotoLoader/PsoPhotoLoader';
import { showLoadPhotoError } from 'functions';
import {createPhotoStorageUniqKey, useCachedPRIStorageKey} from "./usePso";

const styles = StyleSheet.create({
	photos: {
		width: '100%',
		flexDirection: 'row',
		flexWrap: 'wrap',
		justifyContent: 'space-between',
	},
	uploader: {
		...theme.styles.thumbnail,
		width: theme.normalize(150),
		height: theme.normalize(115),
		marginBottom: theme.spacing(2),
	},
	thumbnail: {
		...theme.styles.thumbnail,
		width: theme.normalize(150),
		height: theme.normalize(115),
	},
});

export const MainPhotosForm = ({ stepPhotos, stepName, style }) => {
	const dispatch = useDispatch();
	const { photos } = useSelector(({ pso }) => pso, shallowEqual);
	const storageKey = useCachedPRIStorageKey()

	const addPhoto = useCallback(
		async (event, sequentialIdWithinStep) => {
			try {
				const res = await event;
				const imageData = { sequentialIdWithinStep, ...res };

				let cachedImages = [];
				let imagesByStep = {};

				try {
					imagesByStep = await api.storage.getWithoutErrorHandling(storageKey);
					cachedImages = imagesByStep[stepName] || [];
				} catch (e) {
					await api.storage.set(storageKey, {});
				}

				cachedImages = cachedImages.filter(_imageData => _imageData.sequentialIdWithinStep !== imageData.sequentialIdWithinStep);
				cachedImages.push(imageData);
				imagesByStep[stepName] = cachedImages;

				dispatch(actions.psoAddPhoto(imageData));
				await api.storage.set(storageKey, imagesByStep);
			} catch (err) {
				showLoadPhotoError(err.message);
			}
		},
		[dispatch, stepName]
	);

	const removePhoto = useCallback(
		async (sequentialIdWithinStep) => {
			let cachedImages = [];
			let imagesByStep = {};

			try {
				imagesByStep = await api.storage.getWithoutErrorHandling(storageKey);
				cachedImages = imagesByStep[stepName] || [];
			} catch (e) {
				await api.storage.set(storageKey, {});
			}

			cachedImages = cachedImages.filter(imageData => imageData.sequentialIdWithinStep !== sequentialIdWithinStep);
			imagesByStep[stepName] = cachedImages;
			await api.storage.set(storageKey, imagesByStep);

			dispatch(actions.psoRemovePhoto(sequentialIdWithinStep));
		},
		[dispatch, stepName]
	);

	return (
		<>
			{photos && (
				<View style={[style, styles.photos]}>
					{stepPhotos.map(
						({ sequentialIdWithinStep: id, hint, icon }) => {
							const alreadyUploadedPhoto = photos.find(
								photo => photo.sequentialIdWithinStep === id
							);
							return alreadyUploadedPhoto ? (
								<PsoPhotoLoader
									name={id}
									style={styles.uploader}
									onSelect={event => addPhoto(event, id)}
									key={
										alreadyUploadedPhoto.sequentialIdWithinStep
									}
									hint={hint}
									thumbnail={
										alreadyUploadedPhoto.respInfo
											? () => (
													<Thumbnail
														style={styles.thumbnail}
														resizeMode="cover"
														source={{
															uri: alreadyUploadedPhoto
																.respInfo.path,
														}}
														onPressDelete={() =>
															removePhoto(id)
														}
													/>
											  )
											: () => (
													<Thumbnail
														style={styles.thumbnail}
														resizeMode="cover"
														source={{
															uri: alreadyUploadedPhoto.url,
														}}
														isUploaded
													/>
											  )
									}
								/>
							) : (
								<PsoPhotoLoader
									name={id}
									style={styles.uploader}
									onSelect={event => addPhoto(event, id)}
									key={hint}
									hint={hint}
									backgroundIcon={icon}
								/>
							);
						}
					)}
				</View>
			)}
		</>
	);
};
