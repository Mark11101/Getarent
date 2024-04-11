import { useDispatch } from 'react-redux';
import React, { useCallback } from 'react';
import ImagePicker from 'react-native-image-crop-picker';
import { TouchableOpacity, Text, StyleSheet, Alert } from 'react-native';

import api from 'api';
import actions from 'actions';
import Avatar from './Avatar';

import theme from 'theme';

const AvatarLoader = ({
	style,
	avatar,
	diameter,
	titleStyle,
	text = 'Выбрать другое',
	onSelect,
}) => {

	const dispatch = useDispatch();
	
	const [isLoading, setIsLoading] = React.useState(false);

	const selectImage = useCallback(
		(opener) =>
			onSelect(
				new Promise((resolve, reject) => {
					opener({ 
						includeBase64: true, 
						compressImageQuality: 0.3 
					})
						.then(image => {

							setIsLoading(true);

							if (!image) {
								return reject({
									message: 'Ошибка загрузки фото',
								});
							};

							const ext = (image?.mime || '')
								.toLowerCase()
								.match(/\w+$/)[0];

							if (!['jpg', 'jpeg', 'png'].includes(ext)) {
								dispatch(
									actions.error(
										`Недопустимое расширение файла .${ext}`
									)
								);
							};

							api.web
								.uploadAvatar(image)
								.then(({ error, ...result }) => {
									if (error) {
										reject(error);
									}
									resolve(result);
								})
								.catch(error => reject(error));
						})

						.catch(error => reject(error));

				}).finally(() => setIsLoading(false))
			),
		[onSelect]
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

	return (
		<TouchableOpacity
			style={[styles.container, style]}
			activeOpacity={0.7}
			onPress={chooseSource}
		>
			<Avatar 
				avatar={avatar} 
				diameter={diameter} 
				isLoading={isLoading}
			/>
			<Text style={[styles.text, titleStyle]}>
				{text}
			</Text>
		</TouchableOpacity>
	);
};

export default React.memo(AvatarLoader);

const styles = StyleSheet.create({
	container: {
		justifyContent: 'center',
		alignItems: 'center',
	},
	text: {
		...theme.styles.P1,
		marginTop: theme.spacing(6.5),
		color: theme.colors.blue,
	},
});
