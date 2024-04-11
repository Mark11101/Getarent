import React, { useCallback, useMemo, useState } from 'react'
import { TouchableOpacity, Text, Alert, View, StyleSheet } from 'react-native'
import ImagePicker from 'react-native-image-crop-picker'
import RNFetchBlob from 'rn-fetch-blob'
import Waiter from '../../Waiter'
import Thumbnail from '../../Thumbnail'
import { CameraSvg, RoundCrossSvg, TickSvg } from '../../Svg'
import theme from '../../../theme'
import { useDispatch } from 'react-redux'
import api from '../../../api'
import actions from '../../../actions'

const EXT_LIST = [ 'jpg', 'jpeg', 'png' ]

const defaultPreviewConfig = {
	width: 126,
	height: 94
}

const imageConfig = {
	includeBase64: true,
	compressImageQuality: 0.3
}

export const PhotoLoaderMultiple = ({
	label = 'Добавить', text = 'Фотография',
	previewConfig: forcedPreviewConfig = {},
	value = [], onChange = () => {},
	isPublic = false, containerStyle
}) => {
	const [ isLoading, setIsLoading ] = useState(false)
	const [ error, setError ] = useState(false)

	const dispatch = useDispatch()

	const previewConfig = useMemo(() => {
		return {
			...defaultPreviewConfig,
			...forcedPreviewConfig
		}
	}, [ forcedPreviewConfig ])

	const _uploadImage = useCallback(async (opener = ImagePicker.openPicker) => {
		try {
			const image = await opener(imageConfig)
			setIsLoading(true)
			setError(false)

			if (!image) throw {
				message: 'Ошибка загрузки фото'
			}

			const ext = (image?.mime || '')
				.toLowerCase()
				.match(/\w+$/)[0]

			if (!EXT_LIST.includes(ext)) throw {
				message: `Неверное расширение файла .${ext}`,
			}

			const { error, ...result } = await api.web.getUploadUrl(
				ext, isPublic ? 'public' : 'private'
			)

			if (error) throw error

			image.key = result.key
			image.isUpload = true
			image.text = text

			const blob = await RNFetchBlob.fetch(
				'PUT', result.url,
				{ 'Content-type': 'application/octet-stream' },
				image.data
			).catch((message, status) => {
				throw { message, status }
			})
			
			if (blob.respInfo.status !== 200) throw {
				message: 'Не удалось загрузить фото, попробуйте еще раз'
			}

			onChange([ ...value, image ])
		} catch (err) {
			if (/User cancelled image selection/.test(err.message)) return
			setError(true)
			dispatch(actions.error(err.message))
		} finally {
			setIsLoading(false)
		}
	}, [ dispatch, setIsLoading, onChange ])

	const _onPress = () => {
		Alert.alert('Выбор фото', '', [
			{
				text: 'Отмена',
				style: 'cancel'
			},
			{
				text: 'Камера',
				onPress: () => _uploadImage(ImagePicker.openCamera)
			},
			{
				text: 'Галерея',
				onPress: () => _uploadImage(ImagePicker.openPicker)
			}
		])
	}

	const _onDelete = file => {
		onChange(value.filter(image => image.key !== file.key))
	}

	const isUploaded = useMemo(() => {
		return value.length
	}, [ value ])

	return <View
		style={[
			styles.container,
			error ? styles.inputError : null,
			// isUploaded ? styles.inputUploaded : null,
			containerStyle
		].filter(Boolean)}
	>
		<View style={styles.previews}>
			{
				!!value?.length && value.map((file, idx) => <Thumbnail
					key={file.key}
					style={{
						...styles.preview,
						...previewConfig,
						marginRight: (idx + 1) % 3 === 0 ? 0 : '2%'
					}}
					resizeMode="cover"
					source={{ uri: file.path }}
					onPressDelete={() => _onDelete(file)}
				/>)
			}
		</View>

		<TouchableOpacity
			style={styles.button}
			onPress={_onPress}
			activeOpacity={0.7}
		>
			{
				isLoading
					? <Waiter isBlock={true} style={styles.waiter} size='small' />
					: (
						error ? <RoundCrossSvg
							style={{ marginRight: 10 }}
						/> : <TickSvg
							style={{ marginRight: 10 }}
							color={isUploaded ? theme.colors.blue : "white"}
							tickColor={isUploaded ? "white" :  "#E7F1FB"}
						/>
					)
			}
			
			<Text
				numberOfLines={1}
				ellipsizeMode='tail'
				style={styles.label}
			>
				{ label }
			</Text>
			
			{ <CameraSvg style={styles.icon} /> }
		</TouchableOpacity>
	</View>
}

const styles = StyleSheet.create({
	container: {
		flexDirection: 'column',
		alignItems: 'center',

		width: '100%',

		backgroundColor: 'rgba(6, 107, 214, 0.10)',
		paddingHorizontal: 10,
		paddingVertical: 9,
		marginBottom: 27,

		borderRadius: 19,
	},
	inputUploaded: {
		borderStyle: 'solid',
		borderWidth: 1,
		borderColor: theme.colors.blue
	},
	inputError: {
		borderColor: theme.colors.red,
		backgroundColor: 'rgba(255, 46, 0, 0.10)'
	},
	button: {
		width: '100%',
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'flex-start'
	},
	previews: {
		width: '100%',
		flexDirection: 'row',
		justifyContent: 'flex-start',
		alignItems: 'flex-start',
		flexWrap: 'wrap'
	},
	preview: {
		borderRadius: 8,
		marginBottom: 10
	},
	label: {
		width: '85%',

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
		marginTop: 0,
		marginLeft: 10,
		marginRight: 10
	}
})
