import React from 'react'
import { Text, View, Alert } from 'react-native'
import api from '../api'
import styles from './styles'
import {
	ButtonText,
	BlurPopup,
	RadioButton,
	PrimaryButton,
	SuccessImageSvg
} from '../components'
import { useDispatch } from 'react-redux'
import actions from '../actions'
import { ROLE as ROLES } from '../constants/roles'

const ObserverModal = ({ visible, onClose, isSignUp = false, forcedRole = null }) => {
	const [ role, setRole ] = React.useState(ROLES.GUEST)

	const isObserver = forcedRole === ROLES.OBSERVER

	const dispatch = useDispatch()

	const _onContinue = () => {
		onClose()
		if (isObserver ? role === ROLES.GUEST : forcedRole === ROLES.GUEST) {
			api.navigation.navigate('GuestRegistration')
		} else if (isObserver ? role === ROLES.HOST : forcedRole === ROLES.HOST) {
			api.navigation.navigate('HostRegistration')
		}
	}

	const _onLogout = () => Alert.alert(
		'Выйти',
		'Вы уверены, что хотите выйти?',
		[
			{
				text: 'Выйти',
				onPress: () => {
					dispatch(actions.logout())
					onClose()
				}
			},
			{ text: 'Отмена' }
    	]
	)

	return <BlurPopup
		visible={visible}
		onClose={_onLogout}
		maskClosable={false}
	>
		<SuccessImageSvg />

		<Text style={[ styles.title ]}>
			{
				isSignUp
					? 'Спасибо за регистрацию!'
					: 'Мы рады вновь видеть вас!'
			}
		</Text>

		<Text style={styles.text}>
			{
				isObserver
					? 'Что вы хотите?'
					: 'Продолжить регистрацию?'
			}
		</Text>

		{
			isObserver && <View style={styles.radioGroup}>
				<RadioButton
					material
					label="Арендовать авто"
					style={styles.radioBtn}
					labelStyle={{ ...styles.text, ...styles.radioLabel }}
					onPress={() => setRole(ROLES.GUEST)}
					checked={role === ROLES.GUEST}
				/>
				<RadioButton
					material
					label="Добавить автомобиль"
					style={styles.radioBtn}
					labelStyle={{ ...styles.text, ...styles.radioLabel }}
					onPress={() => setRole(ROLES.HOST)}
					checked={role === ROLES.HOST}
				/>
			</View>
		}

		<View style={styles.popupFooter}>
			<PrimaryButton
				style={[ styles.submitBtn ]}
				title="Продолжить"
				onPress={_onContinue}
			/>

			<ButtonText
				styls={[ styles.secondaryBtn ]}
				title='Выйти из аккаунта'
				onPress={_onLogout}
			/>
		</View>
	</BlurPopup>
}

export default ObserverModal
