import React, { useCallback, useMemo, useState } from 'react'
import { useDispatch } from 'react-redux'
import * as Yup from 'yup'
import { ScrollView, StyleSheet, Text, View } from 'react-native'
import { MaskedTextInput } from 'react-native-mask-text'
import theme from '../theme'
import { ModalizedScreen, Form, LabeledMenuItem, MenuItem, ButtonText, RadioButton } from '../components'
import api from '../api'
import { BASE_PATTERNS, PAYMENT_PATTERNS } from '../constants/patterns'
import actions from '../actions'

const numeric = (length = 1) => ({
	keyboardType: 'numeric',
	RenderInput: MaskedTextInput,
	mask: '9'.repeat(length)
})

const PERSON_FORM = {
	accountNumber: {
		label: 'Расчетный счет', ...numeric(20),
		info: `Только номера счета банка “Тинькофф”`
	}
}

const COMPANY_FORM = {
	companyName: { label: 'Название компании' },
	bankName: { label: 'Название банка' },
	inn: { label: 'ИНН', ...numeric(12) },
	kpp: { label: 'КПП', ...numeric(9) },
	bik: { label: 'БИК', ...numeric(9) },
	accountNumber: { label: 'Расчетный счет организации', ...numeric(22) },
	corrAccountNumber: { label: 'Корреспондентский счет банка', ...numeric(20) }
}

const onlyNumbers = 'Только цифры'
const correctData = 'Введите корретные данные'

const personFormValidation = Yup.object().shape({
	accountNumber: Yup.string()
		.required('Введите счет')
		.matches(BASE_PATTERNS.ONLY_NUMBERS, onlyNumbers)
		.matches(PAYMENT_PATTERNS.ACCOUNT_NUMBER, correctData)
})

const companyFormValidation = Yup.object().shape({
	companyName: Yup.string()
		.required('Введите название компании'),

	bankName: Yup.string()
		.required('Введите название банка'),

	inn: Yup.string()
		.required('Введите ИНН')
		.matches(BASE_PATTERNS.ONLY_NUMBERS, onlyNumbers)
		.matches(PAYMENT_PATTERNS.INN, correctData),

	kpp: Yup.string()
		.required('Введите КПП')
		.matches(BASE_PATTERNS.ONLY_NUMBERS, onlyNumbers)
		.matches(PAYMENT_PATTERNS.KPP, correctData),

	bik: Yup.string()
		.required('Введите БИК')
		.matches(BASE_PATTERNS.ONLY_NUMBERS, onlyNumbers)
		.matches(PAYMENT_PATTERNS.BIK, correctData),

	accountNumber: Yup.string()
		.required('Введите счет')
		.matches(BASE_PATTERNS.ONLY_NUMBERS, onlyNumbers)
		.matches(PAYMENT_PATTERNS.ACCOUNT_NUMBER, correctData),

	corrAccountNumber: Yup.string()
		.required('Введите счет')
		.matches(BASE_PATTERNS.ONLY_NUMBERS, onlyNumbers)
		.matches(PAYMENT_PATTERNS.CORR_ACCOUNT_NUMBER, correctData)
})

export const HostPaymentDetailsModal = ({ navigation, route: { params: details } }) => {
	const { type, details: data = {} } = details || {}

	const [ isIndividual, setIsIndividual ] = useState(type === 'CARD')

	const dispatch = useDispatch()

	const _onSubmit = useCallback((data, isIndividual) => {
		dispatch(actions.setHostPaymentMethodRequest(data, isIndividual))
		navigation.goBack()
	}, [])

	const _onChangeData = useCallback(() => {
		navigation.goBack()
		setTimeout(() => api.navigation.navigate('Chats', {
			screen: 'Support'
		}), 500)
	}, [])

	const fields = useMemo(() => {
		return Object.entries(isIndividual ? PERSON_FORM : COMPANY_FORM)
			.map(([ key, config ]) => ({ key, ...config }))
			// .filter(({ key }) => !!data?.[key])
	}, [ isIndividual, data ])

	return <ModalizedScreen
		onBack={() => navigation.goBack()}
		title="Настройка получения выплат"
	>
		{
			!!type
				? <View style={{ flex: 1/* , paddingHorizontal: 16 */ }}>
					<Text style={styles.smallText}>
						{
							isIndividual
								? PERSON_FORM.accountNumber.info
								: 'Реквизиты ИП или ООО'
							}
					</Text>
					<MenuItem.Group>
						{
							fields.map(({ key, label }, idx) => (
								<LabeledMenuItem
									key={key} label={label}
									isFirst={!idx} isLast={idx === fields.length - 1}
								>
									{ data[key] || ' - ' }
								</LabeledMenuItem>
							))
						}
					</MenuItem.Group>

					<ButtonText
						style={styles.textButton}
						title='Заявка на измение данных'
						onPress={_onChangeData}
					/>
				</View>
				: <ScrollView
					style={{ flex: 1 }}
					keyboardShouldPersistTaps="handled"
					contentContainerStyle={{ flexGrow: 1 }}
				>
					<View style={styles.radioGroup}>
						<RadioButton
							material
							label="Реквизиты ИП или ООО"
							labelStyle={theme.styles.text}
							onPress={() => setIsIndividual(false)}
							checked={!isIndividual}
						/>
						<RadioButton
							material
							label="Реквизиты самозанятого"
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
									fields={PERSON_FORM}
									styles={{ submitButton: styles.button }}
									onSubmit={data => _onSubmit(data, true)}
									validationSchema={personFormValidation}
									rerender={false}
								/>
							</View>
						:
							<View>
								<Form
									fields={COMPANY_FORM}
									styles={{ submitButton: styles.button }}
									onSubmit={data => _onSubmit(data, false)}
									validationSchema={companyFormValidation}
									rerender={false}
								/>
							</View>
					}
				</ScrollView>
		}
	</ModalizedScreen>
}

const styles = StyleSheet.create({
	scroll: {
		paddingTop: 10,
		flexGrow: 1,
		height: '100%',
	},
	button: {
		...theme.styles.primaryBtn,
		flexSrink: 0,
		flexGrow: 0,
		flexBasis: 50
	},
	textButton: {
		position: 'absolute',
		bottom: 0,
		left: '20%',
		right: '20%'
	},
	smallText: {
		...theme.styles.text,
		fontSize: 12,
		marginBottom: 8,
		marginLeft: 16
	},
	radioGroup: {
		flexDirection: 'column',
		marginBottom: 16
	},
})
