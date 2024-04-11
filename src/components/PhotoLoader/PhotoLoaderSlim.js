import React, { useCallback, useEffect, useMemo, useState } from 'react'
import ImagePicker from 'react-native-image-crop-picker'
import { TouchableOpacity, Text, Alert, View, StyleSheet, Image } from 'react-native'
import Waiter from '../Waiter'
import RNFetchBlob from 'rn-fetch-blob'
import theme from 'theme'
import api from '../../api'
import { CameraBigSvg, CameraSvg, TickSvg } from '../Svg'

const callErrorAlert = () => {
	Alert.alert('', 'Не удалось загрузить фото, попробуйте еще раз')
}

const EXT_LIST = [ 'jpg', 'jpeg', 'png' ]

const PhotoLoaderSlim = ({
	style, loading,
	label = 'Добавить', onSelect, text,
	asFormData, value, round = false,
	affectedKeys = [], isPublic = false,
	...props
}) => {
	const [ isLoading, setIsLoading ] = useState(false)
	const [ imageKey, setImageKey ] = useState('')
	const [ uploaded, setUploaded ] = useState(false)
	const [ preview, setPreview ] = useState()

	useEffect(() => {
		if (affectedKeys.includes(imageKey)) {
			setUploaded(false)
		}
	}, [ affectedKeys, imageKey ])

	const selectImage = useCallback(
		opener => onSelect(new Promise((resolve, reject) => {
			opener({ includeBase64: true, compressImageQuality: 0.3 })
				.then(image => {
					setIsLoading(true)

					if (!image) {
						callErrorAlert()
						return reject({ message: 'Ошибка загрузки фото' })
					}

					const ext = (image?.mime || '')
						.toLowerCase()
						.match(/\w+$/)[0]

					if (!EXT_LIST.includes(ext)) return reject({
						message: `Неверное расширение файла .${ext}`,
					})

					if (asFormData) {
						resolve(image)
					} else {
						api.web.getUploadUrl(ext, isPublic ? 'public' : 'private')
							.then(({ error, ...rest }) => {
								if (error) {
									callErrorAlert()
									reject(error)
								}
								return rest
							})
							.then(async ({ url, key }) => {
								setImageKey(key)

								image.key = key
								image.isUpload = true

								return RNFetchBlob.fetch(
									'PUT', url,
									{ 'Content-type': 'application/octet-stream' },
									image.data
								).catch((message, status) => {
									callErrorAlert()
									throw { message, status }
								})
							})
							.then(res => {
								if (res.respInfo.status === 200) {
									res.respInfo['key'] = image.key
									res.respInfo['path'] = image.path
									res.respInfo['isUpload'] = image.isUpload

									image.text = text

									setUploaded(true)
									setIsLoading(false)
									
									setPreview(image.path)
									
									resolve(image)
								} else {
									callErrorAlert()
								}
							})
							.catch((err) => {
								setIsLoading(false)
								reject(err)
							})
					}
				})
				.catch((err) => {
					reject(err)
				})
				.finally(() => {
					setIsLoading(false)
				})
			})),
		[]
	)

	const chooseSource = () => {
		Alert.alert('Выбор фото', '', [
			{
				text: 'Отмена',
				style: 'cancel'
			},
			{
				text: 'Камера',
				onPress: () => selectImage(ImagePicker.openCamera)
			},
			{
				text: 'Галерея',
				onPress: () => selectImage(ImagePicker.openPicker)
			}
		])
	}
	
	const isUploaded = useMemo(() => {
		return asFormData
			? Boolean(value)
			: (value || uploaded)
	}, [ uploaded, asFormData, value ])

	return <TouchableOpacity
		style={[
			styles.input,
			round ? styles.inputRound : null,
			style,
		].filter(Boolean)}
		onPress={chooseSource}
		activeOpacity={0.7}
	>
		{
			!round && (
				isLoading ? <View style={styles.waiter}>
					<Waiter size='small' />
				</View> : <TickSvg
					style={{ marginRight: 10 }}
					color={isUploaded ? theme.colors.blue : "white"}
					tickColor={isUploaded ? "white" :  "#E7F1FB"}
				/>
			)
		}

		{
			(preview || props.preview) && round && <Image 
				width={100} 
				height={100} 
				style={{ top: -10 }}
				source={{ uri: preview || props.preview }} 
			/>
		}
		<Text
			numberOfLines={1}
			ellipsizeMode='tail'
			style={[
				styles.label,
				round ? styles.textRound : null
			].filter(Boolean)}
		>
			{ label }
		</Text>
		
		{
			round
				? <CameraBigSvg style={{ marginTop: 8 }} />
				: <CameraSvg style={styles.icon} />
		}
		
	</TouchableOpacity>
}

const styles = StyleSheet.create({
	input: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'flex-start',

		width: '100%',
		height: 38,

		backgroundColor: 'rgba(6, 107, 214, 0.10)',
		paddingHorizontal: 10,
		paddingVertical: 9,
		marginBottom: 27,

		borderRadius: 19,
		borderStyle: 'solid',
		borderWidth: 1,
		borderColor: theme.colors.blue
	},
	inputRound: {
		width: 100,
		height: 100,
		borderRadius: 50,
		marginBottom: 0,
		borderColor: 'transparent',
		backgroundColor: theme.colors.svgLightGrey,
		flexDirection: 'column',
		overflow: 'hidden',
	},
	textRound: {
		position: 'absolute',
		bottom: 0,
		width: 100,
		height: 33,
		backgroundColor: 'rgba(34, 34, 34, 0.50)',
		fontSize: 12,
		color: theme.colors.white,
		textAlign: "center",
		paddingTop: 4
	},
	label: {
		width: '70%',

		color: theme.colors.black,
		fontFamily: 'Inter-Regular',
		fontSize: 14,
		lineHeight: 20,

		marginTop: 0,
		marginBottom: 0
	},
	icon: {
		position: 'absolute',
		right: 10
	},
	waiter: {
		marginLeft: theme.spacing(6),
		marginRight: theme.spacing(2)
	}
})

export default PhotoLoaderSlim
