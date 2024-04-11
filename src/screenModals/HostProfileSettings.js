import React, { useCallback, useState } from 'react'
import { useDispatch } from 'react-redux'
import * as Yup from 'yup'
import { ScrollView, StyleSheet, View } from 'react-native'
import theme from '../theme'
import { ModalizedScreen, Form, RadioButton } from '../components'
import actions from '../actions'
import { BASE_PATTERNS } from '../constants/patterns'

const PERSON_FORM = {
	lastName: { label: 'Фамилия' },
	firstName: { label: 'Имя' },
	midName: { label: 'Отчество' }
}

const COMPANY_FORM = {
	trademark: { label: 'Торговое название' }
}

const onlyRussionSymbols = 'Только русские буквы'

const personFormValidation = Yup.object().shape({
	firstName: Yup.string()
		.required('Введите имя')
		.matches(BASE_PATTERNS.ONLY_RUSSIAN, onlyRussionSymbols),

	lastName: Yup.string()
		.required('Введите фамилию')
		.matches(BASE_PATTERNS.ONLY_RUSSIAN, onlyRussionSymbols),

	midName: Yup.string()
		.required('Введите отчество')
		.matches(BASE_PATTERNS.ONLY_RUSSIAN, onlyRussionSymbols)
})

const companyFormValidation = Yup.object().shape({
	trademark: Yup.string()
		.required('Введите наименование')
})

export const HostProfileSettingsModal = ({ navigation, route: { params: { useTrademark, ...values } = {} } }) => {
	const [ isIndividual, setIsIndividual ] = useState(!useTrademark)

	const dispatch = useDispatch()

	const _onSubmit = useCallback((data, useTrademark) => {
		dispatch(actions.updateProfileRequest({
			...data,
			useTrademark
		}))

		navigation.goBack()
	}, [])

	return <ModalizedScreen
		onBack={() => navigation.goBack()}
		title="Настройка профиля"
	>
		<ScrollView
			style={{ flex: 1 }}
			keyboardShouldPersistTaps="handled"
			contentContainerStyle={{ flexGrow: 1 }}
		>
			<View style={styles.radioGroup}>
				<RadioButton
					material
					label="Использовать торговую марку"
					labelStyle={theme.styles.text}
					onPress={() => setIsIndividual(false)}
					checked={!isIndividual}
				/>
				<RadioButton
					material
					label="Использовать имя физ. лица"
					labelStyle={theme.styles.text}
					onPress={() => setIsIndividual(true)}
					checked={isIndividual}
				/>
			</View>
			
			{
				isIndividual
				?
					<View>
						<Form
							values={{
								firstName: values.firstName,
								midName: values.midName,
								lastName: values.lastName
							}}
							fields={PERSON_FORM}
							styles={{ submitButton: styles.button }}
							onSubmit={data => _onSubmit(data, false)}
							validationSchema={personFormValidation}
						/>
					</View>
				:
					<View>
						<Form
							values={{
								trademark: values.trademark
							}}
							fields={COMPANY_FORM}
							styles={{ submitButton: styles.button }}
							onSubmit={data => _onSubmit(data, true)}
							validationSchema={companyFormValidation}
						/>
					</View>
			}
		</ScrollView>
	</ModalizedScreen>
}

const styles = StyleSheet.create({
	scroll: {
		paddingTop: 10,
		flex: 1,
		height: '100%'
	},
	button: {
		...theme.styles.primaryBtn,
		flexSrink: 0,
		flexGrow: 0,
		flexBasis: 50
	},
	radioGroup: {
		flexDirection: 'column',
		marginBottom: 16
	},
})
