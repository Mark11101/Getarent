import React from 'react'
import { View, SafeAreaView, Text, StyleSheet } from 'react-native'
import { useDispatch, useSelector } from 'react-redux'
import * as PS from '../../store/profile/selectors'
import compare from '../../libs/compare'
import styles from '../../modals/styles'
import { ROLE as ROLES } from '../../constants/roles'
import { ButtonText, PrimaryButton, RadioButton, SuccessImageSvg } from '../../components'
import { Alert } from 'react-native'
import actions from '../../actions'
import theme from 'theme';

export const Observer = ({ navigation }) => {
	const potentialRole = useSelector(PS.potentialRoleSelector, compare.values)
	const forcedRole = useSelector(PS.roleSelector, compare.values)
	const isSignUp = useSelector(PS.isSignUpSelector, compare.values)

	const { initialSelectedRole } = useSelector(st => st.layout);

	const [ role, setRole ] = React.useState(ROLES.GUEST)

	const isObserver = forcedRole === ROLES.OBSERVER

	const dispatch = useDispatch()

	React.useEffect(() => {
		setRole(initialSelectedRole);
	}, [initialSelectedRole]);

	const _onContinue = () => {
		let isGuest

		if (isObserver) {
			if (!potentialRole) {
				if (role === ROLES.GUEST) isGuest = true
				if (role === ROLES.HOST) isGuest = false
			} else {
				if (potentialRole === ROLES.GUEST) isGuest = true
				if (potentialRole === ROLES.HOST) isGuest = false
			}
		} else {
			if (forcedRole === ROLES.GUEST) isGuest = true
			if (forcedRole === ROLES.HOST) isGuest = false
		}
		
		if (typeof isGuest !== 'boolean') {
			dispatch(actions.error('Неизвестная роль'))
			return
		}
		navigation.navigate(isGuest ? 'GuestRegistration' : 'HostRegistration')
	}

	const _onLogout = () => Alert.alert(
		'Выйти',
		'Вы уверены, что хотите выйти?',
		[
			{
				text: 'Выйти',
				onPress: () => {
					dispatch(actions.logout())
				}
			},
			{ text: 'Отмена' }
    	]
	)

	return <SafeAreaView style={localStyles.centered}>
		<SuccessImageSvg />

		<Text style={[ styles.title ]}>
			{
				isSignUp && isObserver
					? 'Спасибо за регистрацию!'
					: 'Мы рады вновь видеть вас!'
			}
		</Text>

		<Text style={styles.text}>
			{
				(isObserver && !potentialRole)
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
	</SafeAreaView>
}

const localStyles = StyleSheet.create({
	centered: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center',
		backgroundColor: theme.colors.white,
	}
})
