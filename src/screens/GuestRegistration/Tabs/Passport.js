import React, { useEffect, useState } from 'react'
import { ScrollView, Text, View } from 'react-native'
import authStyles from '../../../screens/Auth/styles'
import { ERRORS_DICTIONARY, FormContainer, PASSPORT, addPhoto } from '../common'
import { PrimaryButton, Waiter, PhotoLoaderSlim, FormikInput as ImprovedInput } from '../../../components'
import styles from '../styles'
import { Formik } from 'formik'
import { passportStepSchema } from '../validators'
import api from '../../../api'
import { shallowEqual, useDispatch, useSelector } from 'react-redux'
import actions from 'actions'
import { REGISTRATION_STEPS } from '../../../constants/guestRegistration'
import { guestPassportSelector } from '../../../store/guest/selectors'
import { useScrollToOnFocus } from '../../../hooks/useScrollTo'
import { WINDOW_WIDTH } from '../../../constants/app'
import compare from '../../../libs/compare'
import { profileAvatarSelector } from '../../../store/profile/selectors'

const photoLoaders = {
	front: {
		key: 'frontSidePhoto',
		label: 'Первый разворот паспорта'
	},
	reg: {
		key: 'registrationSidePhoto',
		// label: 'Разворот паспорта с регистрацией'
		label: 'Разворот с регистрацией'
	},
	avatar: {
		key: 'selfiePhoto',
		label: 'Аватар'
	}
}

const PassportTab = ({ name, navigation, isPassed, route: { params: { scrollTo } = {} } }) => {
	const [ affectedKeys, setAffectedKeys ] = useState([])
	const [ isLoading, setIsLoading ] = useState(false)
	const [ avatarFile, setAvatarFile ] = useState(null)
	const userAvatar = useSelector(profileAvatarSelector, compare.values)

	const dispatch = useDispatch()

	const setRef = useScrollToOnFocus(scrollTo)
	const passport = useSelector(guestPassportSelector, shallowEqual)

	const _onSubmit = async data => {
		try {
			setIsLoading(true)
			
			const passportRes = isPassed
				? await api.web.guest.passport.update(data)
				: await api.web.guest.passport.create(data)
			console.log({ passportRes })

			if (passportRes.error) throw passportRes.error

			if (!userAvatar && avatarFile) {
				const avatarRes = await api.web.uploadAvatar(avatarFile)
				if (avatarRes.error) throw avatarRes.error
			}

			dispatch(actions.loadPassport(passportRes))
			navigation.navigate(REGISTRATION_STEPS.FINAL_STEP)
		} catch (err) {
			console.log(err)
			if (
				/failed to process with following keys/.test(
					err.message
				) && err.affectedKeys
			) {
				setAffectedKeys(err.affectedKeys)
			
				const affectedPhotos = Object.values(data)
					.filter(val => err.affectedKeys.includes(val?.key))
			
				return dispatch(actions.error(
					'Ошибка',
					`Не удалось загрузить фотографии: ${affectedPhotos.map(photo => photo.text).join(', ')}, попробуйте еще раз`
				))
			}
			if (err.statusCode) return dispatch(actions.error(
				ERRORS_DICTIONARY[err.statusCode]
				|| `Непредвиденная ошибка с кодом: ${err.statusCode}`
			))
			dispatch(actions.error('Непредвиденная ошибка'))
		} finally {
			setIsLoading(false)
		}
	}

	return <ScrollView ref={setRef} name={name} style={{ paddingHorizontal: 17 }}>
		<Text style={[authStyles.header, { marginBottom: 24 }]}>
			Заполните паспортные данные
		</Text>

		<Formik
			initialValues={passport}
			onSubmit={_onSubmit}
			validationSchema={passportStepSchema}
			validateOnChange={false}
			validateOnBlur
		>
			{({
				isValid,
				dirty,
				values,
				handleSubmit,
				handleBlur,
				handleChange,
				getFieldHelpers,
				validateForm,
				setValues
			}) => {
				useEffect(() => {
					validateForm()
				}, [
					values.frontSidePhoto,
					values.registrationSidePhoto,
					values.selfiePhoto
				])

				useEffect(() => {
					if (passport.serialNumber) setValues(passport, true)
				}, [ passport.serialNumber ])

				return <>
					<FormContainer containerRef={setRef('passport')} title='Паспорт'>
						{
							Object.entries(PASSPORT)
								.map(([ key, { label, info, ...rest } ]) => <ImprovedInput
									key={key} name={key}
									label={label} infoMessage={info}
									onBlur={handleBlur(key)}
									onChange={handleChange(key)}

									{ ...rest }
								/>)
						}

						<Text style={[authStyles.licenseText, { marginBottom: 24 }]}>
							Приложите фотографии паспорта
						</Text>
			
						<PhotoLoaderSlim
							name={photoLoaders.front.key}
							value={passport?.frontSidePhoto?.key}
							affectedKeys={affectedKeys}
							label={photoLoaders.front.label}
							text={photoLoaders.front.label}
							onSelect={addPhoto(
								getFieldHelpers(photoLoaders.front.key).setValue
							)}
						/>

						<PhotoLoaderSlim
							name={photoLoaders.reg.key}
							value={passport?.registrationSidePhoto?.key}
							affectedKeys={affectedKeys}
							label={photoLoaders.reg.label}
							text={photoLoaders.reg.label}
							onSelect={addPhoto(
								getFieldHelpers(photoLoaders.reg.key).setValue
							)}
						/>
					</FormContainer>
			
					<FormContainer containerRef={setRef('avatar')} title='Ваш аватар'>
					<View style={{ width: '100%', flexDirection: 'row', alignItems: 'center' }}>
							<PhotoLoaderSlim
								style={{ flexSrink: 0, flexGrow: 0, flexBasis: 100 }}
								name={photoLoaders.avatar.key} round
								value={passport?.selfiePhotoKey}
								preview={userAvatar}
								affectedKeys={affectedKeys}
								label='Загрузить'
								text={photoLoaders.avatar.label}
								onSelect={addPhoto(
									getFieldHelpers(photoLoaders.avatar.key).setValue,
									setAvatarFile
								)}
							/>
							<Text style={[ authStyles.licenseText, { width: WINDOW_WIDTH - 164, fontSize: 14, paddingLeft: 16 } ]}>
								Используйте свободный
								формат социальных сетей
							</Text>
						</View>

					</FormContainer>

					<PrimaryButton
						style={[ authStyles.submitBtn, styles.primaryBtn, { width: 103 } ]}
						title={isLoading ? <Waiter size="small" /> : "Далее" }
						onPress={handleSubmit}
						disabled={(!dirty && !scrollTo) || !isValid || isLoading}
					/>
				</>
			}}
		</Formik>
	</ScrollView>
}

export default PassportTab
