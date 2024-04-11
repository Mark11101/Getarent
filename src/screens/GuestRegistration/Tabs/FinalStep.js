import React, { useCallback, useMemo, useState } from 'react'
import { ScrollView, StyleSheet, Text, View } from 'react-native'
import authStyles from '../../../screens/Auth/styles'
import { KeyValueList, PrimaryButton, TextButton, Waiter } from '../../../components'
import { ChangeButton, CheckedDocument, DOCUMENT_TYPE, FormContainer, TERMS_URI } from '../common'
import theme from '../../../theme'
import BouncyCheckbox from 'react-native-bouncy-checkbox'
import api from '../../../api'
import actions from 'actions'
import { shallowEqual, useDispatch, useSelector } from 'react-redux'
import styles from '../styles'
import { requestSuccessRegistrationModal } from '../../../modals'
import { REGISTRATION_STEPS } from '../../../constants/guestRegistration'
import { profileUserDataSelector } from '../../../store/profile/selectors'
import { guestLicenseSelector, guestPassportSelector } from '../../../store/guest/selectors'

const FinalStep = ({ name, navigation }) => {
	const [ termsAccepted, acceptTerms ] = useState(false)
	const [ isLoading, setIsLoading ] = useState(false)

	const userData = useSelector(profileUserDataSelector, shallowEqual)
	const driversLicense = useSelector(guestLicenseSelector, shallowEqual)
	const passport = useSelector(guestPassportSelector, shallowEqual)

	const dispatch = useDispatch()

	const _onTerms = useCallback(() => {
		api.navigation.navigate('DocumentPopup', { uri: TERMS_URI })
	}, [])

	const _onSubmit = async () => {
		try {
			setIsLoading(true)
			const res = await api.web.guest.commitRegistration()
			console.log(res)
			if (res.error) throw res.error

			dispatch(actions.profileRequest())
						
			const goToCarSearch = await requestSuccessRegistrationModal()
			if (goToCarSearch) {
				api.navigation.navigate('LocationTab')
			}
		} catch (err) {
			console.log(err)
			if (err.statusCode) return dispatch(actions.error(
				ERRORS_DICTIONARY[err.statusCode]
				|| `Непредвиденная ошибка с кодом: ${err.statusCode}`
			))
			dispatch(actions.error('Непредвиденная ошибка'))
		} finally {
			setIsLoading(false)
		}
	}

	const baseInfo = useMemo(() => [
		{ key: 'Фамилия', value: userData?.lastName },
		{ key: 'Имя', value: userData?.firstName },
		{ key: 'Отчество', value: userData?.midName },
		{ key: 'Дата рождения', value: userData?.birthDate }
	], [ userData ])

	const licenseInfo = useMemo(() => [
		{ key: 'Серия номер прав', value: driversLicense?.serialNumber },
		{ key: 'Дата выдачи прав', value: driversLicense?.dateOfIssue },
		{ key: 'Год выдачи первых прав', value: driversLicense?.firstLicenseIssueYear },
	].filter(({ value }) => !!value), [ driversLicense ])

	const passportInfo = useMemo(() => [
		{ key: 'Серия номер паспорта', value: passport?.serialNumber },
		{ key: 'Дата выдачи паспорта', value: passport?.dateOfIssue },
		{ key: 'Адрес регистрации', value: passport?.registrationAddress }
	], [ passport ])

	return <ScrollView name={name} style={{ paddingHorizontal: 17 }}>
		<Text style={[authStyles.header, { marginBottom: 24 }]}>
			Проверьте свои данные
		</Text>

		<Text style={[ authStyles.licenseText, { marginBottom: 24 } ]}>
			Изменить ваши личные данные в дальнейшем можно будет через поддержку Getarent 
		</Text>

		<FormContainer title="Ваши данные">
			<KeyValueList items={baseInfo} />

			<ChangeButton
				onPress={() => navigation.navigate(REGISTRATION_STEPS.DRIVER_LICENSE, { scrollTo: 'userData' })}
			/>
		</FormContainer>

		<FormContainer title="Ваш аватар">
			<CheckedDocument
				type={DOCUMENT_TYPE.AVATAR}
				title='Аватар'
			/>
			<ChangeButton
				onPress={() => navigation.navigate(REGISTRATION_STEPS.PASSPORT, { scrollTo: 'avatar' })}
			/>
		</FormContainer>

		<FormContainer title="Права">
			<KeyValueList items={licenseInfo} />
			<View style={localStyles.line} />
			<CheckedDocument
				title='Лицевая сторона ВУ'
			/>
			<CheckedDocument
				title='Оборотная сторона ВУ'
			/>
			<ChangeButton
				onPress={() => navigation.navigate(REGISTRATION_STEPS.DRIVER_LICENSE, { scrollTo: 'driversLicense' })}
			/>
		</FormContainer>

		<FormContainer title="Паспорт">
			<KeyValueList items={passportInfo} />
			<View style={localStyles.line} />
			<CheckedDocument
				title='Первый разворот паспорта'
				type={DOCUMENT_TYPE.PASSPORT}
			/>
			<CheckedDocument
				title='Разворот паспорта с регистрацией'
				type={DOCUMENT_TYPE.PASSPORT}
			/>
			<ChangeButton
				onPress={() => navigation.navigate(REGISTRATION_STEPS.PASSPORT, { scrollTo: 'passport' })}
			/>
		</FormContainer>

		<BouncyCheckbox
			style={[ { marginBottom: 16 } ]}
			isChecked={termsAccepted}
			text={
				<Text style={[ authStyles.licenseText, { marginTop: 15 } ]}>
					Я прочитал и согласен с&nbsp;
					<TextButton
						style={authStyles.textButton}
						title="Правилами сервиса"
						onPress={_onTerms}
					/>
				</Text>
			}
			size={22}
			fillColor={theme.colors.blue}
			textStyle={authStyles.policyText}
			onPress={() => acceptTerms(!termsAccepted)}
		/>

		<PrimaryButton
			style={[ authStyles.submitBtn, styles.primaryBtn, localStyles.submitBtn ]}
			title={
				isLoading
					? <Waiter size="small" />
					: "Завершить регистрацию"
			}
			disabled={isLoading || !termsAccepted}
			onPress={_onSubmit}
		/>
	</ScrollView>
}

const localStyles = StyleSheet.create({
	submitBtn: {
		alignSelf: 'flex-start',
		paddingHorizontal: 30,
		marginTop: 0,
		minWidth: 232
	},
	line: {
		height: 1,
		width: '100%',
		backgroundColor: theme.colors.svgLightGrey,
		marginBottom: 16
	}
})

export default FinalStep
