import { View, Alert } from 'react-native';
import React, { useCallback, useState } from 'react';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';

import actions from 'actions';
import { Thumbnail, Waiter } from 'components';
import { showLoadPhotoError } from 'functions';
import PsoPhotoLoader from '../PsoPhotoLoader/PsoPhotoLoader';

import s from './styles';

const generateSeqId = (requiredPhotosIds = [], additionalPhotos = []) => {

	let seqId;

	const currentIds = additionalPhotos
		.map(photo => photo.sequentialIdWithinStep)
		.concat(requiredPhotosIds);

	for (let i = 0; i < currentIds.length + 1; i += 1) {
		if (!currentIds.includes(i)) {
			seqId = i;
		}
	}

	return seqId;
};

const AdditionalPhotosForm = ({ requiredPhotosIds = [] }) => {

	const dispatch = useDispatch();

	const [waiter, setWaiter] = useState(false);

	const { photos } = useSelector(({ pso }) => pso, shallowEqual);

	const additionalPhotos = photos.filter(
		photo => !requiredPhotosIds.includes(photo.sequentialIdWithinStep)
	);

	const addPhoto = useCallback(
		async (event, sequentialIdWithinStep) => {
			
			try {
				setWaiter(true);

				const res = await event;

				setWaiter(false);

				dispatch(
					actions.psoAddPhoto({ sequentialIdWithinStep, ...res })
				);

			} catch (err) {
				showLoadPhotoError(err.message);
			} finally {
				setWaiter(false);
			}
		},

		[dispatch]
	);

	const removePhoto = useCallback(
		sequentialIdWithinStep => {
			dispatch(actions.psoRemovePhoto(sequentialIdWithinStep));
		},
		[dispatch]
	);

	return (
		<View style={s.photos}>
			<PsoPhotoLoader
				name="photo"
				text="Добавить"
				isPrimary={false}
				style={s.uploader}
				onSelect={event =>
					addPhoto(
						event,
						generateSeqId(requiredPhotosIds, additionalPhotos)
					)
				}
			/>
			{Boolean(additionalPhotos.length) &&
				additionalPhotos.map(file =>
					file.respInfo?.path ? (
						<Thumbnail
							resizeMode="cover"
							style={s.thumbnail}
							key={file.sequentialIdWithinStep}
							source={{
								uri: file.respInfo?.path,
							}}
							onPressDelete={() =>
								removePhoto(file.sequentialIdWithinStep)
							}
						/>
					) : (
						<Thumbnail
							resizeMode="cover"
							style={s.thumbnail}
							key={file.sequentialIdWithinStep}
							source={{
								uri: file.url,
							}}
						/>
					)
				)}
			{waiter && <Waiter />}
		</View>
	);
};

export default AdditionalPhotosForm;
