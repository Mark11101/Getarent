import React, { useCallback, useState } from 'react';
import { TouchableOpacity, Text, View, Alert } from 'react-native';
import ImagePicker from 'react-native-image-crop-picker';
import RNFetchBlob from 'rn-fetch-blob';

import api from 'api';
import theme from 'theme';
import { Icon, Waiter } from 'components';

import s from './styles';

const PsoPhotoLoader = ({
	style,
	isPublic = false,
	icon: name = 'photo-add',
	iconColor: color = theme.colors.blue,
	iconSize: size = theme.normalize(24),
	thumbnail: Thumbnail,
	onSelect,
	isPrimary = true,
	text = '',
	hint = '',
	backgroundIcon = '',
	disabled,
}) => {
	const [waiter, setWaiter] = useState(false);

	const callErrorAlert = () => {
		Alert.alert('', 'Не удалось загрузить фото, попробуйте еще раз')
	};

	const selectImage = useCallback(
		opener =>
			onSelect(
				new Promise((resolve, reject) => {

					setWaiter(true);

					opener({ includeBase64: true, compressImageQuality: 0.3 })
						.then(image => {

							if (!image) {
								setWaiter(false);

									callErrorAlert();

									return reject({
										message: 'Ошибка загрузки фото',
									});
								}
	
								const ext = (image?.mime || '')
									.toLowerCase()
									.match(/\w+$/)[0];
	
								if (!['jpg', 'jpeg', 'png'].includes(ext)) {

									setWaiter(false);

									return reject({
										message: `Неверное расширение файла .${ext}`,
									});
								}
	
								api.web
									.getUploadUrl(
										ext,
										isPublic ? 'public' : 'private'
									)
									.then(({ error, ...rest }) => {

										if (error) {
											setWaiter(false);
											callErrorAlert();
											console.log(error);
											reject(error);
										}
	
										return rest;
									})
									.then( async ({ url, key }) => {

										image.key = key;
										image.isUpload = true;
										
										return RNFetchBlob.fetch(
											'PUT',
											url,
											{
												'Content-type':
													'application/octet-stream',
											},
											image.data

										).catch((message, status) => {

											setWaiter(false);						
											throw { message, status };
										});
									})
									.then((res) => {

										if (res.respInfo.status === 200) {

											res.respInfo['key'] = image.key;
											res.respInfo['path'] = image.path;
											res.respInfo['isUpload'] = image.isUpload;

										setWaiter(false);
										resolve(res);
									} else {
										dispatch(
											actions.error(
												'Не удалось загрузить фото. Попробуйте еще раз.'
											)
										);
									}
								})
								.catch(err => {
									setWaiter(false);
									reject(err);
								});
						})
						.catch(err => {
							setWaiter(false);
							reject(err);
						});
				})
			),
		[isPublic, onSelect]
	);

	const chooseSource = () =>
		__DEV__
			? selectImage(ImagePicker.openPicker)
			: selectImage(ImagePicker.openCamera);

	const onPressWhileThumbnail = Thumbnail ? {} : { onPress: chooseSource };

	return isPrimary ? (
		<View style={s.container}>
			<TouchableOpacity
				style={[s.primaryWrap, style]}
				disabled={disabled}
				{...onPressWhileThumbnail}
			>
				{Thumbnail ? (
					<Thumbnail />
				) : (
					<>
						<Icon
							name={backgroundIcon}
							style={{
								width: 92,
								height: 90,
								fontSize: 90,
								position: 'absolute',
								top: '50%',
								left: '50%',
								transform: [
									{ translateX: -50 },
									{ translateY: -50 },
								],
							}}
							color={theme.colors.lightCyan}
						/>
						<Icon
							style={{
								...s.icon,
								width: size,
								height: size,
							}}
							{...{ name, color, size }}
						/>
					</>
				)}
				{waiter && <Waiter />}
			</TouchableOpacity>
			<Text style={s.hint}>{hint}</Text>
		</View>
	) : (
		<TouchableOpacity
			style={[s.secondaryWrap, style]}
			disabled={disabled}
			onPress={chooseSource}
		>
			<Icon
				style={{
					width: size,
					height: size,
				}}
				{...{ name, color, size }}
			/>
			<Text style={s.text}>{text}</Text>
		</TouchableOpacity>
	);
};

export default React.memo(PsoPhotoLoader);
