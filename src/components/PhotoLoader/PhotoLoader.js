import RNFetchBlob from 'rn-fetch-blob';
import React, { useCallback, useState } from 'react';
import ImagePicker from 'react-native-image-crop-picker';
import { TouchableOpacity, Text, Alert, View } from 'react-native';

import api from 'api';
import Icon from '../Icon';
import Waiter from '../Waiter';
import s from './styles';
import theme from 'theme';

const PhotoLoader = ({
	style,
	waiter,
	affectedKeys = [],
	isPublic = false,
	text = 'Добавить',
	icon: name = 'photo-add',
	iconColor: color = theme.colors.blue,
	iconSize: size = theme.normalize(24),
	inputStyled,
	textStyle,
	error,
	onSelectFormData,
	asFormData = false,
	onSelect = () => {},
}) => {

	const [imageKey, setImageKey] = useState('');
	const [uploaded, setUploaded] = useState(false);

	const [isLoading, setIsLoading] = useState(false);

	const callErrorAlert = () => {
		Alert.alert('', 'Не удалось загрузить фото, попробуйте еще раз');
	};

	React.useEffect(() => {

		if (affectedKeys.includes(imageKey)) {
			setUploaded(false);
		}

	}, [affectedKeys, imageKey]);

	const selectImage = useCallback(
		(opener) =>
			onSelect(
				new Promise((resolve, reject) => {

					opener({ includeBase64: true, compressImageQuality: 0.3 })
						.then(image => {

							if (__DEV__) {
								// console.log(image);
							};

							setIsLoading(true);

							if (!image) {

								callErrorAlert();

								return reject({
									message: 'Ошибка загрузки фото',
								});
							};

							const ext = (image?.mime || '')
								.toLowerCase()
								.match(/\w+$/)[0];

							if (!['jpg', 'jpeg', 'png'].includes(ext)) {
								return reject({
									message: `Неверное расширение файла .${ext}`,
								});
							};

							if (asFormData) {
								
								onSelectFormData(image);

							} else {

								api.web
									.getUploadUrl(
										ext,
										isPublic ? 'public' : 'private'
									)
									.then(({ error, ...rest }) => {
										if (error) {

											console.log(error);

											callErrorAlert();
											reject(error);
										};
	
										return rest;
									})
									.then(async ({ url, key }) => {
										setImageKey(key);
	
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

											console.log(message);

											callErrorAlert();
											throw { message, status };
										});
									})
									.then(res => {
										if (res.respInfo.status === 200) {
	
											res.respInfo['key'] = image.key;
											res.respInfo['path'] = image.path;
											res.respInfo['isUpload'] = image.isUpload;
	
											image.text = text;
	
											setUploaded(true);
											setIsLoading(false);

											resolve(image);
	
										} else {
											callErrorAlert();
											console.log(res);
										}
									})
									.catch((err) => {
										setIsLoading(false);
										reject(err);
									});
							}
						})
						.catch((err) => {
							setIsLoading(false);
							reject(err);
						});
				})
			),
		[isPublic, onSelect, text]
	);

	const chooseSource = () => {
		Alert.alert('Выбор фото', '', [
			{
				text: 'Отмена',
				style: 'cancel',
			},
			{
				text: 'Камера',
				onPress: () => selectImage(ImagePicker.openCamera),
			},
			{
				text: 'Галерея',
				onPress: () => selectImage(ImagePicker.openPicker),
			},
		]);
	};

	return inputStyled ? (
		<TouchableOpacity
			style={[s.inputStyledContainer, style]}
			onPress={chooseSource}
		>
			{waiter && isLoading && (
				<View style={s.waiter}>
					<Waiter size='small' />
				</View>
			)}
			{uploaded && (
				<Icon
					style={s.inputStyledCheckIcon}
					{...{ name: 'checkmark', color, size: theme.normalize(12) }}
				/>
			)}
			<Text style={s.inputStyledText}>{text}</Text>
			<Icon
				style={[
					s.inputStyledIcon,
					{
						width: size,
						height: size,
					},
				]}
				{...{ name, color, size }}
			/>
		</TouchableOpacity>
	) : (
		<TouchableOpacity 
			onPress={chooseSource}
			style={[
				s.container, 
				style, 
				error && { borderColor: theme.colors.red },
			]} 
		>
			<Icon
				style={{
					width: size,
					height: size,
				}}
				{...{ name, color, size }}
			/>
			<Text style={[
				s.text, 
				textStyle,
			]}>
				{text}
			</Text>
		</TouchableOpacity>
	);
};

export default React.memo(PhotoLoader);
