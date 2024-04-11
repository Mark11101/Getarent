import React, { useEffect, useState } from 'react'
import { ScrollView, Text } from 'react-native'
import authStyles from '../../../screens/Auth/styles'
import BouncyCheckbox from 'react-native-bouncy-checkbox'
import theme from '../../../theme'
import { BASE_INFO, DRIVER_LICENSE, FormContainer, addPhoto, ERRORS_DICTIONARY } from '../common'
import { PrimaryButton, Waiter, PhotoLoaderSlim, FormikInput as ImprovedInput } from '../../../components'
import styles from '../styles'
import { Formik } from 'formik'
import { licenseStepSchema } from '../validators'
import api from '../../../api'
import { shallowEqual, useDispatch, useSelector } from 'react-redux'
import actions from 'actions'
import { useScrollToOnFocus } from '../../../hooks/useScrollTo'
import { REGISTRATION_STEPS } from '../../../constants/guestRegistration'
import { profileUserDataSelector } from '../../../store/profile/selectors'
import { guestLicenseSelector } from '../../../store/guest/selectors'
import { ROLE } from '../../../constants/roles'

const photoLoaders = {
	front: {
		key: 'driversLicense.frontSidePhoto',
		label: 'Лицевая сторона ВУ'
	},
	reverse: {
		key: 'driversLicense.reverseSidePhoto',
		label: 'Оборотная сторона ВУ'
	}
}

const DriverLicenseTab = ({ name, navigation, isPassed, route: { params: { scrollTo } = {} } }) => {
	const [ licenseDatesMatched, setLicenseDateMatched ] = useState(false)
	const [ affectedKeys, setAffectedKeys ] = useState([])
	const [ isLoading, setIsLoading ] = useState(false)

	const dispatch = useDispatch()

	const userData = useSelector(profileUserDataSelector, shallowEqual)
	const driversLicense = useSelector(guestLicenseSelector, shallowEqual)

	const setRef = useScrollToOnFocus(scrollTo)

	const _onSubmit = async data => {
		try {
			setIsLoading(true)
			
			const userDataRes = await api.web.guest.updateUserData(data.userData)
			if (userDataRes.error) throw userDataRes.error

			dispatch(actions.setRole(ROLE.GUEST))

			const body = {
				...data.driversLicense,
				firstLicenseIssueYear: licenseDatesMatched
					? data.driversLicense.dateOfIssue?.split?.('.')?.reverse?.()?.[0]
					: data.driversLicense.firstLicenseIssueYear
			}

			const licenseRes = isPassed
				? await api.web.guest.driversLicense.update(body)
				: await api.web.guest.driversLicense.create(body)
			console.log({ licenseRes })
			
			if (licenseRes.error) throw licenseRes.error

			dispatch(actions.loadDriversLicense(licenseRes))
			dispatch(actions.profileRequest())
			
			navigation.navigate(
				isPassed ? REGISTRATION_STEPS.FINAL_STEP : REGISTRATION_STEPS.PASSPORT
			)
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
		<Text style={[ authStyles.header, { marginBottom: 24 } ]}>
			Заполните данные прав
		</Text>

		<Text style={[ authStyles.licenseText, { marginBottom: 24 } ]}>
			Вам потребуются паспорт РФ с постоянной пропиской и действительные водительские права категории B.
		</Text>

		<Formik
			initialValues={{
				userData,
				driversLicense
			}}
			onSubmit={_onSubmit}
			validationSchema={licenseStepSchema(licenseDatesMatched)}
			validateOnChange={false}
			validateOnBlur
		>
			{({
				values,
				isValid,
				dirty,
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
					licenseDatesMatched,
					values.driversLicense?.frontSidePhoto,
					values.driversLicense?.reverseSidePhoto
				])

				useEffect(() => {
					if (userData.lastName || driversLicense.serialNumber) {
						setValues({
							userData,
							driversLicense
						}, true)
					}
				}, [ userData.lastName, driversLicense.serialNumber ])

				return <>
					<FormContainer containerRef={setRef('userData')} title='Ваши Ф.И.О.'>
						{
							Object.entries(BASE_INFO).map(([ key, { label, info, ...rest } ]) => {
								const name = `userData.${key}`
		
								return <ImprovedInput
									key={key} name={name}
									label={label} infoMessage={info}
									onBlur={handleBlur(name)}
									onChange={handleChange(name)}

									{ ...rest }
								/>
							})
						}
					</FormContainer>
		
					<FormContainer containerRef={setRef('driversLicense')} title='Действующее водительское удостоверение'>
						{
							Object.entries(DRIVER_LICENSE)
								.filter(([ _, input ]) =>
									!input.condition?.call || input.condition({ licenseDatesMatched })
								)
								.map(([ key, { label, info, ...rest } ]) => {
									const name = `driversLicense.${key}`
			
									return <ImprovedInput
										key={key} name={name}
										label={label} infoMessage={info}
										onBlur={handleBlur(name)}
										onChange={handleChange(name)}

										{ ...rest }
									/>
								})
						}
		
						<BouncyCheckbox 
							style={[ authStyles.checkbox, { marginTop: 0, marginBottom: 16 } ]}
							isChecked={licenseDatesMatched}
							text={<Text style={authStyles.licenseText}>
								Год выдачи первых прав совпадает с годом выдачи действующих
							</Text>}
							size={22}
							fillColor={theme.colors.blue}
							textStyle={authStyles.policyText}
							onPress={() => {
								setLicenseDateMatched(!licenseDatesMatched)
								validateForm()
							}}
						/>

						{
							!licenseDatesMatched && <ImprovedInput
								name={'driversLicense.firstLicenseIssueYear'}
								label={'Год выдачи первых прав'}
								onBlur={handleBlur('driversLicense.firstLicenseIssueYear')}
								onChange={handleChange('driversLicense.firstLicenseIssueYear')}
								mask='9999'
							/>
						}
		
						<Text style={[ authStyles.licenseText, { marginTop: 0, marginBottom: 16 } ]}>
							Приложите фотографии водительского удостоверения
						</Text>
		
						<PhotoLoaderSlim
							name={photoLoaders.front.key}
							affectedKeys={affectedKeys}
							value={driversLicense?.frontSidePhoto?.key}
							label={photoLoaders.front.label}
							text={photoLoaders.front.label}
							onSelect={addPhoto(
								getFieldHelpers(photoLoaders.front.key).setValue
							)}
						/>
		
						<PhotoLoaderSlim
							name={photoLoaders.reverse.key}
							affectedKeys={affectedKeys}
							value={driversLicense?.reverseSidePhoto?.key}
							label={photoLoaders.reverse.label}
							text={photoLoaders.reverse.label}
							onSelect={addPhoto(
								getFieldHelpers(photoLoaders.reverse.key).setValue
							)}
						/>
					</FormContainer>

					<PrimaryButton
						style={[ authStyles.submitBtn, styles.primaryBtn, { width: 103 }]}
						title={isLoading ? <Waiter size='small' /> : "Далее" }
						onPress={handleSubmit}
						disabled={(!dirty && !scrollTo) || !isValid || isLoading}
					/>
				</>
			}}
		</Formik>
	</ScrollView>
}

export default DriverLicenseTab
