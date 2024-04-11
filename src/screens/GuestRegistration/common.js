import React from 'react'
import styles from './styles'
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native'
import { PassportSvg, DriverLicenseSvg, LoadedAvatarSvg } from '../../components'
import { showLoadPhotoError } from '../../functions'
import { MaskedTextInput } from 'react-native-mask-text'

export const INPUT_TYPES = {
	RUSSIAN: 'russian',
	DIGITS_TEN: 'digits10',
	DATE: 'date',
	YEAR: 'year'
}

const maskedNumericInput = {
	RenderInput: MaskedTextInput,
	keyboardType: 'numeric'
}

export const BASE_INFO = {
	lastName: { label: 'Фамилия' },
	firstName: { label: 'Имя' },
	midName: { label: 'Отчество' },
	birthDate: {
		label: 'Дата рождения',
		...maskedNumericInput, mask: '99.99.9999',
		info: 'Сервис доступен лицам старше 18 лет'
	}
}

export const DRIVER_LICENSE = {
	serialNumber: {
		...maskedNumericInput, mask: '9999999999',
		type: INPUT_TYPES.DIGITS_TEN,
		label: 'Cерия и номер ВУ без пробелов'
	},
	dateOfIssue: {
		type: INPUT_TYPES.DATE,
		...maskedNumericInput, mask: '99.99.9999',
		label: 'Дата выдачи действующего ВУ',
		info: 'В правах это пункт 4а'
	},
	// firstLicenseIssueYear: {
	// 	...maskedNumericInput, mask: '9999',
	// 	label: 'Год выдачи первых прав',
	// 	condition: props => !props.licenseDatesMatched
	// }
}

export const PASSPORT = {
	serialNumber: {
		...maskedNumericInput, mask: '9999999999',
		type: INPUT_TYPES.DIGITS_TEN,
		label: 'Серия и номер без пробелов'
	},
	dateOfIssue: {
		type: INPUT_TYPES.DATE,
		...maskedNumericInput, mask: '99.99.9999',
		label: 'Дата выдачи паспорта'
	},
	registrationAddress: { label: 'Адрес регистрации, как в паспорте' },
}

export const ERRORS_DICTIONARY = {
	[400]: 'Некорректный запрос, проверьте введенные данные',
	[401]: 'Вы не авторизованы, пройдите авторизацию и повторите снова',
	[403]: 'У вас нет доступа',
	[404]: 'Невозможно выполнить запрос',
	[409]: 'Пользователь с такими данными уже зарегистрирован, проверьте введенные данные',
	[500]: 'Не удалось отправить данные, попробуйте еще раз',
	[502]: 'Не удалось отправить данные, попробуйте еще раз'
}

export const getDefaults = formConfig => Object.keys(formConfig)
	.reduce((acc, el) => ({ ...acc, [el]: '' }), {})

export const FormContainer = ({ title, children, containerRef }) => {
	return <View ref={containerRef} style={styles.formContainer}>
		<Text style={[ styles.header, styles.secondaryHeader ]}>
			{ title }
		</Text>

		{ children }
	</View>
}

export const addPhoto = (onChange, setImage) => async request => {
	try {
		const res = await request
		console.log(res.key, res.text)

		onChange({
			key: res.key,
			text: res.text,
		})
		setImage?.call && setImage(res)
	} catch (err) {
		console.error(err)
		showLoadPhotoError(err.message)
	}
}

export const ChangeButton = ({ onPress, children, text }) => {
	return <TouchableOpacity onPress={onPress}>
		<Text style={[ styles.licenseText, { textDecorationLine: 'underline' } ]}>
			{ text || children || 'Изменить' }
		</Text>
	</TouchableOpacity>
}

export const TERMS_URI = 'https://storage.yandexcloud.net/getarent-documents-bucket/3208ff5d2ed1a6a3.pdf'

export const DOCUMENT_TYPE = {
	PASSPORT: 'passport',
	DRIVER_LICENSE: 'driverLicense',
	AVATAR: 'avatar'
}

const DOCUMENT_SVG = {
	[DOCUMENT_TYPE.PASSPORT]: <PassportSvg />,
	[DOCUMENT_TYPE.DRIVER_LICENSE]: <DriverLicenseSvg />,
	[DOCUMENT_TYPE.AVATAR]: <LoadedAvatarSvg />
}

export const CheckedDocument = ({ title, type = DOCUMENT_TYPE.DRIVER_LICENSE }) => {
	return <View style={checkedDocumentStyles.container}>
		{ DOCUMENT_SVG[type] }
		<View style={checkedDocumentStyles.description}>
			<Text style={[ styles.licenseText, checkedDocumentStyles.title ]}>
				{ title }
			</Text>
			<Text style={styles.licenseText}>прикреплен</Text>
		</View>
	</View>
}

const checkedDocumentStyles = StyleSheet.create({
	container: {
		flexDirection: 'row',
		marginBottom: 16
	},
	description: {
		marginLeft: 8
	},
	title: {
		fontWeight: '700',
		lineHeight: 20
	}
})